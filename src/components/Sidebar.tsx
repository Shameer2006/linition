"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Layers,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        position: "relative",
        zIndex: 20,
        flexShrink: 0,
        width: collapsed ? "68px" : "260px",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-subtle)",
        boxSizing: "border-box"
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0 1.25rem",
          height: "4rem",
          flexShrink: 0,
          borderBottom: "1px solid var(--border-subtle)",
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            width: "2rem",
            height: "2rem",
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            background: "linear-gradient(135deg, var(--accent-violet), var(--accent-blue))",
          }}
        >
          <Layers size={18} color="white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <span style={{ fontSize: "1rem", fontWeight: 600, letterSpacing: "-0.025em", whiteSpace: "nowrap" }} className="gradient-text">
            Flowboard
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem", overflowY: "auto", boxSizing: "border-box" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.625rem 0.75rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                transition: "all 0.2s ease",
                position: "relative",
                textDecoration: "none",
                background: isActive ? "var(--bg-active)" : "transparent",
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                boxSizing: "border-box"
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "var(--bg-hover)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "3px",
                    height: "1.25rem",
                    borderTopRightRadius: "9999px",
                    borderBottomRightRadius: "9999px",
                    background: "linear-gradient(180deg, var(--accent-violet), var(--accent-blue))",
                  }}
                />
              )}
              <Icon
                size={20}
                style={{
                  flexShrink: 0,
                  transition: "color 0.2s ease",
                  color: isActive ? "var(--accent-violet)" : "var(--text-muted)",
                }}
              />
              {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: "absolute",
          top: "1.25rem",
          right: "-0.75rem",
          width: "1.5rem",
          height: "1.5rem",
          borderRadius: "9999px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s ease",
          background: "var(--bg-tertiary)",
          border: "1px solid var(--border-primary)",
          color: "var(--text-muted)",
          padding: 0
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--accent-violet)";
          e.currentTarget.style.color = "var(--accent-violet)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border-primary)";
          e.currentTarget.style.color = "var(--text-muted)";
        }}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* User section */}
      <div
        style={{
          padding: "1rem 0.75rem",
          flexShrink: 0,
          borderTop: "1px solid var(--border-subtle)",
          boxSizing: "border-box"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0 0.5rem", marginBottom: "0.75rem", boxSizing: "border-box" }}>
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt=""
              style={{ width: "2rem", height: "2rem", borderRadius: "9999px", flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                background: "var(--bg-active)",
              }}
            >
              <User size={16} style={{ color: "var(--text-muted)" }} />
            </div>
          )}
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  margin: 0,
                  color: "var(--text-primary)"
                }}
              >
                {session?.user?.name || "User"}
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  margin: 0,
                  color: "var(--text-muted)"
                }}
              >
                {session?.user?.email || ""}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.5rem 0.75rem",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            transition: "all 0.2s ease",
            cursor: "pointer",
            color: "var(--text-secondary)",
            background: "transparent",
            border: "none",
            boxSizing: "border-box"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-hover)";
            e.currentTarget.style.color = "var(--accent-rose)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
