"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  CalendarDays,
  Clock,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  X,
  UserPlus
} from "lucide-react";
import { ShareModal } from "@/components/ShareModal";

interface Task {
  id: string;
  name: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate: string | null;
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  tasks: Task[];
  members: {
    id: string;
    role: string;
    status: string;
    user: {
      name: string | null;
      email: string | null;
      image: string | null;
    };
  }[];
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  NOT_STARTED: { label: "Not Started", color: "var(--text-muted)", bg: "rgba(94, 94, 114, 0.12)" },
  IN_PROGRESS: { label: "In Progress", color: "var(--accent-blue)", bg: "rgba(59, 130, 246, 0.12)" },
  COMPLETED: { label: "Completed", color: "var(--accent-emerald)", bg: "rgba(16, 185, 129, 0.12)" },
  PENDING: { label: "Pending", color: "var(--accent-amber)", bg: "rgba(245, 158, 11, 0.12)" },
};

const priorityConfig: Record<string, { color: string; bg: string }> = {
  LOW: { color: "var(--accent-cyan)", bg: "rgba(6, 182, 212, 0.12)" },
  MEDIUM: { color: "var(--accent-amber)", bg: "rgba(245, 158, 11, 0.12)" },
  HIGH: { color: "var(--accent-rose)", bg: "rgba(244, 63, 94, 0.12)" },
};

function TaskModal({
  task,
  projectId,
  onClose,
  onSave,
}: {
  task?: Task | null;
  projectId: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const [name, setName] = useState(task?.name || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "MEDIUM");
  const [status, setStatus] = useState(task?.status || "PENDING");
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Task name is required");
      return;
    }
    setSaving(true);
    setError("");

    const body = {
      name: name.trim(),
      description: description.trim() || null,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      projectId,
    };

    try {
      const res = await fetch(
        task ? `/api/tasks/${task.id}` : "/api/tasks",
        {
          method: task ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        boxSizing: "border-box"
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)"
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "32rem",
          background: "var(--bg-secondary)",
          borderRadius: "1rem",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.4)",
          border: "1px solid var(--border-subtle)",
          animation: "scale-in 0.2s ease-out forwards",
          boxSizing: "border-box"
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid var(--border-subtle)"
          }}
        >
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600, margin: 0, color: "var(--text-primary)" }}>
            {task ? "Edit Task" : "New Task"}
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: "0.375rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              transition: "colors 0.2s",
              color: "var(--text-muted)",
              background: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", boxSizing: "border-box" }}>
          {error && (
            <div
              style={{
                fontSize: "0.875rem",
                padding: "0.625rem 1rem",
                borderRadius: "0.5rem",
                background: "rgba(244, 63, 94, 0.1)",
                color: "var(--accent-rose)",
                border: "1px solid rgba(244, 63, 94, 0.2)",
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Task Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter task name"
              style={{
                width: "100%",
                padding: "0.625rem 1rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                transition: "all 0.2s",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-primary)",
                outline: "none",
                boxSizing: "border-box"
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-violet)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-primary)"; }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
              style={{
                width: "100%",
                padding: "0.625rem 1rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                transition: "all 0.2s",
                resize: "none",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-primary)",
                outline: "none",
                boxSizing: "border-box"
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-violet)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-primary)"; }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task["priority"])}
                style={{
                  width: "100%",
                  padding: "0.625rem 1rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Task["status"])}
                style={{
                  width: "100%",
                  padding: "0.625rem 1rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{
                width: "100%",
                padding: "0.625rem 1rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-primary)",
                outline: "none",
                colorScheme: "dark",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "0.625rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "colors 0.2s",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-secondary)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-tertiary)"; }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1,
                padding: "0.625rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: saving ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                opacity: saving ? 0.5 : 1,
                background: "linear-gradient(135deg, var(--accent-violet), var(--accent-blue))",
                border: "none",
                color: "white",
              }}
            >
              {saving ? "Saving..." : task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [showShareModal, setShowShareModal] = useState(false);

  const fetchProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProject(data);
    } catch {
      router.push("/projects");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchProject();

    // Simulate real-time updates via polling
    const interval = setInterval(() => {
      fetchProject();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchProject]);

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Delete this task?")) return;
    await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    fetchProject();
  };

  const handleToggleComplete = async (task: Task) => {
    const newStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchProject();
  };

  if (loading) {
    return (
      <div style={{ width: "100%", boxSizing: "border-box" }}>
        <div style={{ width: "6rem", height: "2rem", background: "rgba(255,255,255,0.05)", borderRadius: "0.25rem", marginBottom: "1.5rem", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
        <div style={{ width: "16rem", height: "2rem", background: "rgba(255,255,255,0.05)", borderRadius: "0.25rem", marginBottom: "0.5rem", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
        <div style={{ width: "24rem", height: "1.25rem", background: "rgba(255,255,255,0.05)", borderRadius: "0.25rem", marginBottom: "2rem", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ width: "100%", height: "4rem", borderRadius: "0.5rem", background: "rgba(255,255,255,0.05)", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
          ))}
        </div>
      </div>
    );
  }

  if (!project) return null;

  const sc = statusConfig[project.status];
  const completed = project.tasks.filter((t) => t.status === "COMPLETED").length;
  const progress = project.tasks.length > 0 ? (completed / project.tasks.length) * 100 : 0;

  return (
    <div style={{ width: "100%", paddingBottom: "2rem", boxSizing: "border-box" }}>
      {/* Back button */}
      <button
        onClick={() => router.push("/projects")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.875rem",
          marginBottom: "1.5rem",
          cursor: "pointer",
          transition: "colors 0.2s",
          color: "var(--text-secondary)",
          background: "transparent",
          border: "none",
          padding: 0
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
      >
        <ArrowLeft size={16} /> Back to Projects
      </button>

      {/* Project Header */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid var(--glass-border)",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          animation: "fade-in 0.5s ease-out forwards",
          animationDelay: "50ms",
          opacity: 0,
          boxSizing: "border-box",
          width: "100%"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1rem" }}>
          <div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                fontSize: "0.6875rem",
                fontWeight: 500,
                padding: "0.25rem 0.625rem",
                borderRadius: "9999px",
                marginBottom: "0.75rem",
                background: sc.bg,
                color: sc.color,
              }}
            >
              <span style={{ width: "0.375rem", height: "0.375rem", borderRadius: "9999px", background: sc.color }} />
              {sc.label}
            </span>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "var(--text-primary)" }}>
              {project.name}
            </h1>
            {project.description && (
              <p style={{ fontSize: "0.875rem", margin: 0, maxWidth: "42rem", color: "var(--text-secondary)" }}>
                {project.description}
              </p>
            )}
          </div>
          <div style={{ marginLeft: "auto" }}>
            <button
              onClick={() => setShowShareModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
                background: "rgba(139, 92, 246, 0.1)",
                color: "var(--accent-violet)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                transition: "all 0.2s",
                height: "fit-content"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(139, 92, 246, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
              }}
            >
              <UserPlus size={16} /> Share
            </button>
          </div>
        </div>

        {/* Contributors Avatar Group */}
        {(() => {
          const activeMembers = project.members.filter(m => m.status === "ACCEPTED");
          if (activeMembers.length === 0) return null;
          return (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {activeMembers.map((member, index) => (
                  <div
                    key={member.id}
                    title={member.user.name || member.user.email || "User"}
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "9999px",
                      background: "var(--bg-tertiary)",
                      border: "2px solid var(--bg-secondary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: index > 0 ? "-0.75rem" : "0",
                      position: "relative",
                      zIndex: activeMembers.length - index,
                      overflow: "hidden",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--text-primary)"
                    }}
                  >
                    {member.user.image ? (
                      <img src={member.user.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      (member.user.name?.[0] || member.user.email?.[0] || "?").toUpperCase()
                    )}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                {activeMembers.length} {activeMembers.length === 1 ? "Contributor" : "Contributors"}
              </span>
            </div>
          );
        })()}

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", fontSize: "0.75rem", color: "var(--text-muted)", flexWrap: "wrap", marginBottom: "1rem" }}>
          {project.startDate && (
            <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <CalendarDays size={13} />
              Start: {new Date(project.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          )}
          {project.endDate && (
            <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <Clock size={13} />
              Due: {new Date(project.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          )}
          <span>{project.tasks.length} tasks</span>
        </div>

        {/* Progress */}
        <div style={{ marginTop: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.375rem", fontSize: "0.75rem" }}>
            <span style={{ color: "var(--text-muted)" }}>{completed}/{project.tasks.length} completed</span>
            <span style={{ fontWeight: 500, color: "var(--text-secondary)" }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ width: "100%", height: "0.375rem", borderRadius: "9999px", overflow: "hidden", background: "var(--bg-active)" }}>
            <div
              style={{
                height: "100%",
                borderRadius: "9999px",
                transition: "width 0.5s ease",
                width: `${progress}%`,
                background: "linear-gradient(90deg, var(--accent-violet), var(--accent-emerald))",
              }}
            />
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", animation: "fade-in 0.5s ease-out forwards", animationDelay: "100ms", opacity: 0, boxSizing: "border-box", width: "100%" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, margin: 0, color: "var(--text-primary)" }}>Tasks</h2>
        <button
          onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 0.875rem",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s",
            background: "linear-gradient(135deg, var(--accent-violet), var(--accent-blue))",
            border: "none",
            color: "white",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(139, 92, 246, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <Plus size={16} /> Add Task
        </button>
      </div>

      {/* Task List */}
      {project.tasks.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 0",
            animation: "fade-in 0.5s ease-out forwards",
            color: "var(--text-muted)",
          }}
        >
          <CheckCircle2 size={40} style={{ marginBottom: "0.75rem", opacity: 0.3 }} />
          <p style={{ fontSize: "0.875rem", margin: 0 }}>No tasks yet. Add your first task!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
          {project.tasks.map((task) => {
            const tc = statusConfig[task.status];
            const pc = priorityConfig[task.priority];

            return (
              <div
                key={task.id}
                onClick={() => { setEditingTask(task); setShowTaskModal(true); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem 1.25rem",
                  borderRadius: "0.5rem",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--glass-border)",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                  width: "100%",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-primary)";
                  const actions = e.currentTarget.querySelector('.task-actions') as HTMLElement;
                  if (actions) actions.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--glass-border)";
                  const actions = e.currentTarget.querySelector('.task-actions') as HTMLElement;
                  if (actions) actions.style.opacity = "0";
                }}
              >
                {/* Toggle complete */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleToggleComplete(task); }}
                  style={{
                    flexShrink: 0,
                    cursor: "pointer",
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {task.status === "COMPLETED" ? (
                    <CheckCircle2 size={20} style={{ color: "var(--accent-emerald)" }} />
                  ) : (
                    <Circle size={20} style={{ color: "var(--text-muted)" }} />
                  )}
                </button>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: task.status === "COMPLETED" ? "var(--text-muted)" : "var(--text-primary)",
                      textDecoration: task.status === "COMPLETED" ? "line-through" : "none",
                    }}
                  >
                    {task.name}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: "0.625rem",
                        fontWeight: 500,
                        padding: "0.125rem 0.5rem",
                        borderRadius: "9999px",
                        background: pc.bg,
                        color: pc.color,
                      }}
                    >
                      {task.priority}
                    </span>
                    <span
                      style={{
                        fontSize: "0.625rem",
                        fontWeight: 500,
                        padding: "0.125rem 0.5rem",
                        borderRadius: "9999px",
                        background: tc.bg,
                        color: tc.color,
                      }}
                    >
                      {tc.label}
                    </span>
                    {task.dueDate && (
                      <span style={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--text-muted)" }}>
                        <CalendarDays size={11} />
                        {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div
                  className="task-actions"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    opacity: 0,
                    transition: "opacity 0.2s"
                  }}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingTask(task); setShowTaskModal(true); }}
                    style={{
                      padding: "0.375rem",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                      background: "transparent",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                    style={{
                      padding: "0.375rem",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                      background: "transparent",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(244, 63, 94, 0.08)";
                      e.currentTarget.style.color = "var(--accent-rose)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-muted)";
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          projectId={id}
          onClose={() => setShowTaskModal(false)}
          onSave={fetchProject}
        />
      )}

      {showShareModal && (
        <ShareModal
          projectId={id}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Global styles for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}} />
    </div>
  );
}
