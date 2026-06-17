"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  CheckSquare,
  Clock,
  TrendingUp,
  ArrowRight,
  CalendarDays,
  Circle,
} from "lucide-react";

interface DashboardData {
  totalProjects: number;
  projectsNotStarted: number;
  projectsInProgress: number;
  projectsCompleted: number;
  totalTasks: number;
  tasksPending: number;
  tasksInProgress: number;
  tasksCompleted: number;
  recentProjects: Array<{
    id: string;
    name: string;
    status: string;
    tasks: Array<{ id: string; status: string }>;
  }>;
  upcomingTasks: Array<{
    id: string;
    name: string;
    dueDate: string;
    priority: string;
    status: string;
    project: { id: string; name: string };
  }>;
}

const statusColors: Record<string, string> = {
  NOT_STARTED: "var(--text-muted)",
  IN_PROGRESS: "var(--accent-blue)",
  COMPLETED: "var(--accent-emerald)",
  PENDING: "var(--accent-amber)",
};

const priorityColors: Record<string, string> = {
  LOW: "var(--accent-cyan)",
  MEDIUM: "var(--accent-amber)",
  HIGH: "var(--accent-rose)",
};

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  delay,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  delay: number;
}) {
  return (
    <div
      style={{
        padding: "1.5rem",
        borderRadius: "0.75rem",
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid var(--glass-border)",
        boxShadow: "var(--shadow-glow)",
        transition: "all 0.3s ease",
        animation: `fade-in 0.5s ease-out forwards`,
        animationDelay: `${delay}ms`,
        opacity: 0,
        boxSizing: "border-box",
        width: "100%"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--glass-border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div
          style={{
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${color}15`,
          }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <p style={{ fontSize: "1.875rem", fontWeight: 700, margin: "0 0 0.25rem 0", color: "var(--text-primary)" }}>
        {value}
      </p>
      <p style={{ fontSize: "0.875rem", margin: 0, color: "var(--text-secondary)" }}>
        {label}
      </p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        padding: "1.5rem",
        borderRadius: "0.75rem",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-subtle)",
        boxSizing: "border-box",
        width: "100%"
      }}
    >
      <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.5rem", background: "rgba(255,255,255,0.05)", marginBottom: "1rem", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
      <div style={{ width: "4rem", height: "2rem", background: "rgba(255,255,255,0.05)", marginBottom: "0.5rem", borderRadius: "0.25rem", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
      <div style={{ width: "6rem", height: "1rem", background: "rgba(255,255,255,0.05)", borderRadius: "0.25rem", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ width: "100%" }}>
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ width: "12rem", height: "2rem", background: "rgba(255,255,255,0.05)", marginBottom: "0.5rem", borderRadius: "0.25rem", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
          <div style={{ width: "18rem", height: "1.25rem", background: "rgba(255,255,255,0.05)", borderRadius: "0.25rem", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const taskCompletionRate =
    data.totalTasks > 0
      ? Math.round((data.tasksCompleted / data.totalTasks) * 100)
      : 0;

  return (
    <div style={{ width: "100%", paddingBottom: "2rem", boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem", animation: "fade-in 0.5s ease-out forwards" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 0.25rem 0", color: "var(--text-primary)" }}>
          Dashboard
        </h1>
        <p style={{ fontSize: "0.875rem", margin: 0, color: "var(--text-secondary)" }}>
          Overview of your projects and tasks
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        <StatCard label="Total Projects" value={data.totalProjects} icon={FolderKanban} color="var(--accent-violet)" delay={0} />
        <StatCard label="Total Tasks" value={data.totalTasks} icon={CheckSquare} color="var(--accent-blue)" delay={50} />
        <StatCard label="Completed Tasks" value={data.tasksCompleted} icon={TrendingUp} color="var(--accent-emerald)" delay={100} />
        <StatCard label="Pending Tasks" value={data.tasksPending} icon={Clock} color="var(--accent-amber)" delay={150} />
      </div>

      {/* Progress bar */}
      <div
        style={{
          padding: "1.5rem",
          borderRadius: "0.75rem",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--shadow-glow)",
          marginBottom: "2rem",
          animation: "fade-in 0.5s ease-out forwards",
          animationDelay: "200ms",
          opacity: 0,
          boxSizing: "border-box"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <p style={{ fontSize: "0.875rem", fontWeight: 500, margin: 0, color: "var(--text-primary)" }}>
            Overall Task Completion
          </p>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, margin: 0, color: "var(--accent-emerald)" }}>
            {taskCompletionRate}%
          </p>
        </div>
        <div style={{ width: "100%", height: "0.5rem", borderRadius: "9999px", background: "var(--bg-active)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              borderRadius: "9999px",
              transition: "width 1s ease-out",
              width: `${taskCompletionRate}%`,
              background: "linear-gradient(90deg, var(--accent-violet), var(--accent-emerald))",
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginTop: "0.75rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <Circle size={8} fill="var(--accent-amber)" stroke="none" />
            Pending: {data.tasksPending}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <Circle size={8} fill="var(--accent-blue)" stroke="none" />
            In Progress: {data.tasksInProgress}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <Circle size={8} fill="var(--accent-emerald)" stroke="none" />
            Completed: {data.tasksCompleted}
          </span>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
        
        {/* Recent Projects */}
        <div
          style={{
            padding: "1.5rem",
            borderRadius: "0.75rem",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--glass-border)",
            boxShadow: "var(--shadow-glow)",
            animation: "fade-in 0.5s ease-out forwards",
            animationDelay: "250ms",
            opacity: 0,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, margin: 0, color: "var(--text-primary)" }}>
              Recent Projects
            </h2>
            <Link
              href="/projects"
              style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", fontWeight: 500, color: "var(--accent-violet)", textDecoration: "none" }}
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {data.recentProjects.length === 0 ? (
            <p style={{ fontSize: "0.875rem", padding: "2rem 0", textAlign: "center", margin: 0, color: "var(--text-muted)" }}>
              No projects yet. Create your first project!
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {data.recentProjects.map((project) => {
                const total = project.tasks.length;
                const completed = project.tasks.filter((t) => t.status === "COMPLETED").length;

                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      transition: "all 0.2s ease",
                      background: "transparent",
                      textDecoration: "none",
                      boxSizing: "border-box"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{ width: "0.5rem", height: "0.5rem", borderRadius: "9999px", flexShrink: 0, background: statusColors[project.status] || "var(--text-muted)" }} />
                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                      <p style={{ fontSize: "0.875rem", fontWeight: 500, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--text-primary)" }}>
                        {project.name}
                      </p>
                      <p style={{ fontSize: "0.75rem", margin: 0, color: "var(--text-muted)" }}>
                        {total} tasks, {completed} completed
                      </p>
                    </div>
                    <ArrowRight size={14} style={{ color: "var(--text-muted)" }} />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Tasks */}
        <div
          style={{
            padding: "1.5rem",
            borderRadius: "0.75rem",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--glass-border)",
            boxShadow: "var(--shadow-glow)",
            animation: "fade-in 0.5s ease-out forwards",
            animationDelay: "300ms",
            opacity: 0,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, margin: 0, color: "var(--text-primary)" }}>
              Upcoming Tasks
            </h2>
            <Link
              href="/tasks"
              style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", fontWeight: 500, color: "var(--accent-violet)", textDecoration: "none" }}
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {data.upcomingTasks.length === 0 ? (
            <p style={{ fontSize: "0.875rem", padding: "2rem 0", textAlign: "center", margin: 0, color: "var(--text-muted)" }}>
              No upcoming tasks. All caught up!
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {data.upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    transition: "all 0.2s ease",
                    background: "transparent",
                    boxSizing: "border-box"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ width: "0.375rem", height: "2rem", borderRadius: "9999px", flexShrink: 0, background: priorityColors[task.priority] || "var(--text-muted)" }} />
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 500, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--text-primary)" }}>
                      {task.name}
                    </p>
                    <p style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", margin: 0, color: "var(--text-muted)" }}>
                      <span>{task.project.name}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <CalendarDays size={12} />
                        {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "0.625rem",
                      fontWeight: 500,
                      padding: "0.125rem 0.5rem",
                      borderRadius: "9999px",
                      flexShrink: 0,
                      background: `${priorityColors[task.priority]}15`,
                      color: priorityColors[task.priority],
                    }}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Global styles for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}} />
    </div>
  );
}
