import { useState } from "react";
import { X, UserPlus, Check } from "lucide-react";

export function ShareModal({
  projectId,
  onClose,
}: {
  projectId: string;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to invite user");
      }

      setSuccess("User invited successfully!");
      setEmail("");
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
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
          backdropFilter: "blur(4px)",
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "28rem",
          background: "var(--bg-secondary)",
          borderRadius: "1rem",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.4)",
          border: "1px solid var(--border-subtle)",
          animation: "scale-in 0.2s ease-out forwards",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.25rem",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <UserPlus size={20} className="text-accent-violet" />
            Share Project
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: "0.375rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleShare} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {error && (
            <div style={{ padding: "0.75rem", borderRadius: "0.5rem", background: "rgba(244, 63, 94, 0.1)", color: "var(--accent-rose)", fontSize: "0.875rem", border: "1px solid rgba(244, 63, 94, 0.2)" }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ padding: "0.75rem", borderRadius: "0.5rem", background: "rgba(16, 185, 129, 0.1)", color: "var(--accent-emerald)", fontSize: "0.875rem", border: "1px solid rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Check size={16} /> {success}
            </div>
          )}

          <div>
            <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "0.375rem", display: "block" }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "0.375rem", display: "block" }}>
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-primary)",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="MEMBER">Member (Can edit tasks)</option>
              <option value="VIEWER">Viewer (Read-only)</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.625rem 1rem",
                borderRadius: "0.5rem",
                background: "transparent",
                border: "1px solid var(--border-primary)",
                color: "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !email}
              style={{
                padding: "0.625rem 1rem",
                borderRadius: "0.5rem",
                background: "linear-gradient(135deg, var(--accent-violet), var(--accent-blue))",
                border: "none",
                color: "white",
                cursor: loading || !email ? "not-allowed" : "pointer",
                opacity: loading || !email ? 0.7 : 1,
                fontWeight: 500,
              }}
            >
              {loading ? "Sending..." : "Send Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
