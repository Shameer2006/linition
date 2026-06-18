import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const actionSchema = z.object({
  action: z.enum(["ACCEPT", "REJECT"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  try {
    const body = await request.json();
    const { action } = actionSchema.parse(body);

    const memberRecord = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: projectId,
        },
      },
    });

    if (!memberRecord || memberRecord.status !== "PENDING") {
      return NextResponse.json(
        { error: "No pending invitation found for this project" },
        { status: 404 }
      );
    }

    if (action === "ACCEPT") {
      const updated = await prisma.projectMember.update({
        where: { id: memberRecord.id },
        data: { status: "ACCEPTED" },
      });
      return NextResponse.json(updated);
    } else {
      // REJECT: delete the record
      await prisma.projectMember.delete({
        where: { id: memberRecord.id },
      });
      return NextResponse.json({ message: "Invitation rejected" });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error },
        { status: 400 }
      );
    }
    console.error("Failed to process invitation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
