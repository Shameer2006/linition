import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProjectSchema } from "@/lib/validations";
import { NextRequest } from "next/server";

// GET /api/projects/[id] - Get a single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      tasks: {
        orderBy: { createdAt: "desc" },
      },
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, image: true } }
        }
      }
    },
  });

  if (!project) {
    return Response.json({ error: "Project not found" }, { status: 404 });
  }

  const isMember = project.userId === session.user.id || project.members.some(m => m.userId === session.user.id);
  if (!isMember) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  return Response.json(project);
}

// PUT /api/projects/[id] - Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.project.findUnique({ 
    where: { id },
    include: { members: true }
  });
  
  if (!existing) {
    return Response.json({ error: "Project not found" }, { status: 404 });
  }
  
  const isMember = existing.userId === session.user.id || existing.members.some(m => m.userId === session.user.id);
  if (!isMember) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validated = updateProjectSchema.parse(body);

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(validated.name !== undefined && { name: validated.name }),
        ...(validated.description !== undefined && {
          description: validated.description,
        }),
        ...(validated.status !== undefined && { status: validated.status }),
        ...(validated.startDate !== undefined && {
          startDate: validated.startDate
            ? new Date(validated.startDate)
            : null,
        }),
        ...(validated.endDate !== undefined && {
          endDate: validated.endDate ? new Date(validated.endDate) : null,
        }),
      },
    });

    return Response.json(project);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return Response.json(
        { error: "Validation failed", details: error },
        { status: 400 }
      );
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.project.findUnique({ 
    where: { id },
    include: { members: true }
  });
  
  if (!existing) {
    return Response.json({ error: "Project not found" }, { status: 404 });
  }
  
  const isOwner = existing.userId === session.user.id || existing.members.some(m => m.userId === session.user.id && m.role === "OWNER");
  if (!isOwner) {
    return Response.json({ error: "Forbidden: Only owners can delete projects" }, { status: 403 });
  }

  await prisma.project.delete({ where: { id } });

  return Response.json({ message: "Project deleted" });
}
