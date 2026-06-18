"use client";

import { useState, useEffect } from "react";
import { Check, X, Building } from "lucide-react";

type Invitation = {
  id: string;
  projectId: string;
  project: {
    id: string;
    name: string;
    description: string | null;
    user: {
      name: string | null;
      email: string | null;
    };
  };
};

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const res = await fetch("/api/invitations");
      if (res.ok) {
        const data = await res.json();
        setInvitations(data);
      }
    } catch (error) {
      console.error("Failed to fetch invitations", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (projectId: string, action: "ACCEPT" | "REJECT") => {
    try {
      const res = await fetch(`/api/invitations/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        setInvitations((prev) => prev.filter((inv) => inv.projectId !== projectId));
      } else {
        console.error("Failed to process invitation");
      }
    } catch (error) {
      console.error("Error processing invitation", error);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", maxWidth: "56rem", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: "1rem", boxSizing: "border-box" }}>
        <div style={{ width: "16rem", height: "2rem", background: "rgba(255,255,255,0.05)", borderRadius: "0.25rem", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ width: "100%", height: "5rem", borderRadius: "0.75rem", background: "rgba(255,255,255,0.05)", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite", animationDelay: `${i * 100}ms` }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "56rem", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      <div className="animate-fade-in" style={{ animationDelay: "50ms", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
          Pending Invitations
        </h1>
        <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Manage your project collaboration requests.
        </p>
      </div>

      {invitations.length === 0 ? (
        <div 
          className="animate-slide-in"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem",
            borderRadius: "1rem",
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px dashed var(--border-subtle)",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.2)",
            animationDelay: "150ms",
            textAlign: "center"
          }}
        >
          <div 
            style={{
              width: "4rem",
              height: "4rem",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
              border: "1px solid rgba(255,255,255,0.05)"
            }}
          >
            <Building size={32} style={{ color: "var(--text-muted)" }} />
          </div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 0.5rem 0" }}>
            No pending invitations
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", maxWidth: "24rem", margin: 0 }}>
            You don't have any pending project invitations right now. When someone shares a project with you, it will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem", boxSizing: "border-box" }}>
          {invitations.map((inv, index) => (
            <div
              key={inv.id}
              className="animate-slide-in"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1.25rem",
                borderRadius: "0.75rem",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--border-subtle)",
                animationDelay: `${index * 100 + 100}ms`,
                transition: "all 0.3s ease",
                boxSizing: "border-box",
                flexWrap: "wrap",
                gap: "1rem"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.borderColor = "var(--border-primary)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 10px 30px -10px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div 
                  style={{
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.1)"
                  }}
                >
                  <Building size={24} style={{ color: "var(--accent-violet)" }} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 0.25rem 0" }}>
                    {inv.project.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 500, padding: "0.125rem 0.5rem", borderRadius: "9999px", background: "rgba(255,255,255,0.1)", color: "var(--text-secondary)" }}>
                      Project
                    </span>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                      Invited by <strong style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{inv.project.user.name || inv.project.user.email}</strong>
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <button
                  onClick={() => handleAction(inv.projectId, "REJECT")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    transition: "all 0.2s",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    background: "transparent",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-primary)",
                    cursor: "pointer",
                    boxSizing: "border-box"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(244, 63, 94, 0.1)";
                    e.currentTarget.style.color = "var(--accent-rose)";
                    e.currentTarget.style.borderColor = "rgba(244, 63, 94, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-secondary)";
                    e.currentTarget.style.borderColor = "var(--border-primary)";
                  }}
                >
                  <X size={16} /> Decline
                </button>
                <button
                  onClick={() => handleAction(inv.projectId, "ACCEPT")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1.25rem",
                    borderRadius: "0.5rem",
                    transition: "all 0.2s",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    background: "linear-gradient(135deg, var(--accent-emerald), #059669)",
                    color: "white",
                    border: "none",
                    boxShadow: "0 4px 10px -4px rgba(16, 185, 129, 0.3)",
                    cursor: "pointer",
                    boxSizing: "border-box"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px -6px rgba(16, 185, 129, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 10px -4px rgba(16, 185, 129, 0.3)";
                  }}
                >
                  <Check size={16} strokeWidth={2.5} /> Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
