import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const invitations = await prisma.projectMember.findMany({
      where: {
        userId: session.user.id,
        status: "PENDING",
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            user: { select: { name: true, email: true } }, // owner
          },
        },
      },
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error("Failed to fetch invitations:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
