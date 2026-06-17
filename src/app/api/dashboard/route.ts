import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/dashboard - Get dashboard statistics
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const projectWhere = {
    OR: [
      { userId },
      { members: { some: { userId } } }
    ]
  };

  const taskWhere = {
    project: projectWhere
  };

  const [
    totalProjects,
    projectsNotStarted,
    projectsInProgress,
    projectsCompleted,
    totalTasks,
    tasksPending,
    tasksInProgress,
    tasksCompleted,
    recentProjects,
    upcomingTasks,
  ] = await Promise.all([
    prisma.project.count({ where: projectWhere }),
    prisma.project.count({ where: { ...projectWhere, status: "NOT_STARTED" } }),
    prisma.project.count({ where: { ...projectWhere, status: "IN_PROGRESS" } }),
    prisma.project.count({ where: { ...projectWhere, status: "COMPLETED" } }),
    prisma.task.count({ where: taskWhere }),
    prisma.task.count({ where: { ...taskWhere, status: "PENDING" } }),
    prisma.task.count({
      where: { ...taskWhere, status: "IN_PROGRESS" },
    }),
    prisma.task.count({
      where: { ...taskWhere, status: "COMPLETED" },
    }),
    prisma.project.findMany({
      where: projectWhere,
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        tasks: { select: { id: true, status: true } },
      },
    }),
    prisma.task.findMany({
      where: {
        ...taskWhere,
        status: { not: "COMPLETED" },
        dueDate: { not: null },
      },
      orderBy: { dueDate: "asc" },
      take: 5,
      include: {
        project: { select: { id: true, name: true } },
      },
    }),
  ]);

  return Response.json({
    totalProjects,
    projectsNotStarted,
    projectsInProgress,
    projectsCompleted,
    totalTasks,
    tasksPending,
    tasksInProgress,
    tasksCompleted,
    recentProjects,
    upcomingTasks,
  });
}
