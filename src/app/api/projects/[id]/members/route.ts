import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["MEMBER", "VIEWER"]).default("MEMBER"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify the inviter is the OWNER or the project creator
  const project = await prisma.project.findUnique({
    where: { id },
    include: { members: true },
  });

  if (!project) {
    return Response.json({ error: "Project not found" }, { status: 404 });
  }

  const isOwner =
    project.userId === session.user.id ||
    project.members.some(
      (m) => m.userId === session.user.id && m.role === "OWNER"
    );

  if (!isOwner) {
    return Response.json(
      { error: "Forbidden: Only owners can invite members" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const validated = inviteSchema.parse(body);

    // Find the user to invite
    const userToInvite = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!userToInvite) {
      return Response.json(
        { error: "User with this email not found" },
        { status: 404 }
      );
    }

    // Check if already a member
    const existingMember = project.members.find(
      (m) => m.userId === userToInvite.id
    );

    if (existingMember || project.userId === userToInvite.id) {
      return Response.json(
        { error: "User is already a member of this project" },
        { status: 400 }
      );
    }

    // Create the member
    const newMember = await prisma.projectMember.create({
      data: {
        projectId: id,
        userId: userToInvite.id,
        role: validated.role,
      },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
    });

    return Response.json(newMember, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Validation failed", details: error },
        { status: 400 }
      );
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
