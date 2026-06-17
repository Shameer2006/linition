import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createProjectSchema } from "@/lib/validations";
import { NextRequest } from "next/server";
// GET /api/projects - List all projects for the authenticated user
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") as "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | null;

  const where: any = {
    OR: [
      { userId: session.user.id },
      { members: { some: { userId: session.user.id } } }
    ]
  };

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  if (status && ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"].includes(status)) {
    where.status = status;
  }

  const projects = await prisma.project.findMany({
    where,
    include: {
      tasks: {
        select: {
          id: true,
          status: true,
        },
      },
      members: {
        include: {
          user: {
            select: { name: true, email: true, image: true }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(projects);
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = createProjectSchema.parse(body);

    const project = await prisma.project.create({
      data: {
        name: validated.name,
        description: validated.description,
        status: validated.status || "NOT_STARTED",
        startDate: validated.startDate ? new Date(validated.startDate) : null,
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        userId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: "OWNER",
          }
        }
      },
    });

    return Response.json(project, { status: 201 });
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
