import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/validations";
import { NextRequest } from "next/server";
// GET /api/tasks - List all tasks for the authenticated user
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") as "PENDING" | "IN_PROGRESS" | "COMPLETED" | null;
  const priority = searchParams.get("priority") as "LOW" | "MEDIUM" | "HIGH" | null;
  const projectId = searchParams.get("projectId");

  const where: any = {
    project: {
      OR: [
        { userId: session.user.id },
        { members: { some: { userId: session.user.id } } }
      ]
    }
  };

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  if (status && ["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status)) {
    where.status = status;
  }

  if (priority && ["LOW", "MEDIUM", "HIGH"].includes(priority)) {
    where.priority = priority;
  }

  if (projectId) {
    where.projectId = projectId;
  }

  const tasks = await prisma.task.findMany({
    where,
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(tasks);
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = createTaskSchema.parse(body);

    // Verify project ownership or membership
    const project = await prisma.project.findUnique({
      where: { id: validated.projectId },
      include: { members: true }
    });

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    const isMember = project.userId === session.user.id || project.members.some(m => m.userId === session.user.id);
    if (!isMember) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const task = await prisma.task.create({
      data: {
        name: validated.name,
        description: validated.description,
        priority: validated.priority || "MEDIUM",
        status: validated.status || "PENDING",
        dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
        projectId: validated.projectId,
      },
    });

    return Response.json(task, { status: 201 });
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
