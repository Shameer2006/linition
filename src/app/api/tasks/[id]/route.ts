import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateTaskSchema } from "@/lib/validations";
import { NextRequest } from "next/server";

// GET /api/tasks/[id] - Get a single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      project: {
        include: { members: true },
      },
    },
  });

  if (!task) {
    return Response.json({ error: "Task not found" }, { status: 404 });
  }

  const isMember = task.project.userId === session.user.id || task.project.members.some(m => m.userId === session.user.id);
  if (!isMember) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  return Response.json(task);
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.task.findUnique({
    where: { id },
    include: { project: { include: { members: true } } },
  });

  if (!existing) {
    return Response.json({ error: "Task not found" }, { status: 404 });
  }
  
  const isMember = existing.project.userId === session.user.id || existing.project.members.some(m => m.userId === session.user.id);
  if (!isMember) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validated = updateTaskSchema.parse(body);

    // If changing project, verify ownership/membership of new project
    if (validated.projectId && validated.projectId !== existing.projectId) {
      const newProject = await prisma.project.findUnique({
        where: { id: validated.projectId },
        include: { members: true }
      });
      if (!newProject) {
        return Response.json({ error: "Project not found" }, { status: 404 });
      }
      const isNewMember = newProject.userId === session.user.id || newProject.members.some(m => m.userId === session.user.id);
      if (!isNewMember) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(validated.name !== undefined && { name: validated.name }),
        ...(validated.description !== undefined && {
          description: validated.description,
        }),
        ...(validated.priority !== undefined && {
          priority: validated.priority,
        }),
        ...(validated.status !== undefined && { status: validated.status }),
        ...(validated.dueDate !== undefined && {
          dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
        }),
        ...(validated.projectId !== undefined && {
          projectId: validated.projectId,
        }),
      },
    });

    return Response.json(task);
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

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.task.findUnique({
    where: { id },
    include: { project: { include: { members: true } } },
  });

  if (!existing) {
    return Response.json({ error: "Task not found" }, { status: 404 });
  }
  
  const isMember = existing.project.userId === session.user.id || existing.project.members.some(m => m.userId === session.user.id);
  if (!isMember) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.task.delete({ where: { id } });

  return Response.json({ message: "Task deleted" });
}
