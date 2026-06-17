"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  FolderKanban,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  tasks: Array<{ id: string; status: string }>;
}

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  NOT_STARTED: {
    label: "Not Started",
    color: "var(--text-muted)",
    bg: "rgba(94, 94, 114, 0.12)",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "var(--accent-blue)",
    bg: "rgba(59, 130, 246, 0.12)",
  },
  COMPLETED: {
    label: "Completed",
    color: "var(--accent-emerald)",
    bg: "rgba(16, 185, 129, 0.12)",
  },
};

function ProjectModal({
  project,
  onClose,
  onSave,
}: {
  project?: Project | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [status, setStatus] = useState(project?.status || "NOT_STARTED");
  const [startDate, setStartDate] = useState(
    project?.startDate
      ? new Date(project.startDate).toISOString().split("T")[0]
      : ""
  );
  const [endDate, setEndDate] = useState(
    project?.endDate
      ? new Date(project.endDate).toISOString().split("T")[0]
      : ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Project name is required");
      return;
    }
    setSaving(true);
    setError("");

    const body = {
      name: name.trim(),
      description: description.trim() || null,
      status,
      startDate: startDate ? new Date(startDate).toISOString() : null,
      endDate: endDate ? new Date(endDate).toISOString() : null,
    };

    try {
      const res = await fetch(
        project ? `/api/projects/${project.id}` : "/api/projects",
        {
          method: project ? "PUT" : "POST",
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
            {project ? "Edit Project" : "New Project"}
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
            <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>
              Project Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
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
            <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project description"
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

          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Project["status"])}
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
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
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
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
              {saving ? "Saving..." : project ? "Update Project" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);

    const res = await fetch(`/api/projects?${params.toString()}`);
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    fetchProjects();
  };

  return (
    <div style={{ width: "100%", paddingBottom: "2rem", boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", animation: "fade-in 0.5s ease-out forwards", boxSizing: "border-box", width: "100%" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 0.25rem 0", color: "var(--text-primary)" }}>
            Projects
          </h1>
          <p style={{ fontSize: "0.875rem", margin: 0, color: "var(--text-secondary)" }}>
            Manage and track all your projects
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProject(null);
            setShowModal(true);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 1rem",
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
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", animation: "fade-in 0.5s ease-out forwards", animationDelay: "50ms", opacity: 0, boxSizing: "border-box", width: "100%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flex: 1,
            maxWidth: "28rem",
            padding: "0.625rem 1rem",
            borderRadius: "0.5rem",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-primary)",
            boxSizing: "border-box"
          }}
        >
          <Search size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            style={{
              flex: 1,
              background: "transparent",
              fontSize: "0.875rem",
              outline: "none",
              color: "var(--text-primary)",
              border: "none",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 1rem",
            borderRadius: "0.5rem",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-primary)",
            boxSizing: "border-box"
          }}
        >
          <Filter size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              background: "transparent",
              fontSize: "0.875rem",
              outline: "none",
              cursor: "pointer",
              color: "var(--text-primary)",
              border: "none",
            }}
          >
            <option value="">All Status</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                borderRadius: "0.75rem",
                padding: "1.5rem",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
                boxSizing: "border-box"
              }}
            >
              <div style={{ width: "75%", height: "1.25rem", background: "rgba(255,255,255,0.05)", marginBottom: "0.75rem", borderRadius: "0.25rem", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
              <div style={{ width: "100%", height: "1rem", background: "rgba(255,255,255,0.05)", marginBottom: "0.5rem", borderRadius: "0.25rem", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
              <div style={{ width: "50%", height: "1rem", background: "rgba(255,255,255,0.05)", marginBottom: "1rem", borderRadius: "0.25rem", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
              <div style={{ width: "5rem", height: "1.5rem", borderRadius: "9999px", background: "rgba(255,255,255,0.05)", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "5rem 0",
            animation: "fade-in 0.5s ease-out forwards",
            color: "var(--text-muted)",
          }}
        >
          <FolderKanban size={48} style={{ marginBottom: "1rem", opacity: 0.3 }} />
          <p style={{ fontSize: "1.125rem", fontWeight: 500, margin: "0 0 0.25rem 0" }}>No projects found</p>
          <p style={{ fontSize: "0.875rem", margin: 0 }}>
            Create your first project to get started
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem", width: "100%" }}>
          {projects.map((project) => {
            const total = project.tasks.length;
            const completed = project.tasks.filter((t) => t.status === "COMPLETED").length;
            const progress = total > 0 ? (completed / total) * 100 : 0;
            const sc = statusConfig[project.status];

            return (
              <div
                key={project.id}
                style={{
                  position: "relative",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-primary)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  const menuBtn = e.currentTarget.querySelector('.project-menu-btn') as HTMLElement;
                  if (menuBtn) menuBtn.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--glass-border)";
                  e.currentTarget.style.transform = "translateY(0)";
                  setActiveMenu(null);
                  const menuBtn = e.currentTarget.querySelector('.project-menu-btn') as HTMLElement;
                  if (menuBtn && activeMenu !== project.id) menuBtn.style.opacity = "0";
                }}
              >
                {/* Menu */}
                <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
                  <button
                    className="project-menu-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === project.id ? null : project.id);
                    }}
                    style={{
                      padding: "0.375rem",
                      borderRadius: "0.5rem",
                      opacity: activeMenu === project.id ? 1 : 0,
                      transition: "all 0.2s",
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
                    <MoreHorizontal size={16} />
                  </button>

                  {activeMenu === project.id && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "100%",
                        marginTop: "0.25rem",
                        width: "9rem",
                        borderRadius: "0.5rem",
                        padding: "0.25rem 0",
                        zIndex: 10,
                        animation: "scale-in 0.1s ease-out forwards",
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-primary)",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      <button
                        onClick={() => {
                          setEditingProject(project);
                          setShowModal(true);
                          setActiveMenu(null);
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.5rem 0.75rem",
                          fontSize: "0.875rem",
                          cursor: "pointer",
                          color: "var(--text-secondary)",
                          background: "transparent",
                          border: "none",
                          textAlign: "left"
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(project.id);
                          setActiveMenu(null);
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.5rem 0.75rem",
                          fontSize: "0.875rem",
                          cursor: "pointer",
                          color: "var(--accent-rose)",
                          background: "transparent",
                          border: "none",
                          textAlign: "left"
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(244, 63, 94, 0.08)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>

                <Link href={`/projects/${project.id}`} style={{ textDecoration: "none", display: "block" }}>
                  {/* Status badge */}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      fontSize: "0.6875rem",
                      fontWeight: 500,
                      padding: "0.25rem 0.625rem",
                      borderRadius: "9999px",
                      marginBottom: "1rem",
                      background: sc.bg,
                      color: sc.color,
                    }}
                  >
                    <span style={{ width: "0.375rem", height: "0.375rem", borderRadius: "9999px", background: sc.color }} />
                    {sc.label}
                  </span>

                  <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 0.375rem 0", paddingRight: "2rem", color: "var(--text-primary)" }}>
                    {project.name}
                  </h3>

                  {project.description && (
                    <p style={{
                      fontSize: "0.875rem",
                      margin: "0 0 1rem 0",
                      color: "var(--text-muted)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}>
                      {project.description}
                    </p>
                  )}

                  {/* Progress */}
                  <div style={{ marginTop: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {completed}/{total} tasks
                      </span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-secondary)" }}>
                        {total > 0 ? Math.round(progress) : 0}%
                      </span>
                    </div>
                    <div style={{ width: "100%", height: "0.375rem", borderRadius: "9999px", overflow: "hidden", background: "var(--bg-active)" }}>
                      <div
                        style={{
                          height: "100%",
                          borderRadius: "9999px",
                          transition: "width 0.5s ease",
                          width: `${progress}%`,
                          background: "linear-gradient(90deg, var(--accent-violet), var(--accent-blue))",
                        }}
                      />
                    </div>
                  </div>

                  {/* Date */}
                  {project.endDate && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.75rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      <CalendarDays size={12} />
                      Due {new Date(project.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProjectModal
          project={editingProject}
          onClose={() => setShowModal(false)}
          onSave={fetchProjects}
        />
      )}

      {/* Global styles for animations */}
      <style dangerouslySetInnerHTML={{__html: `
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
