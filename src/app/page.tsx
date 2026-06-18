"use client";

import Link from "next/link";
import { Layers, ArrowRight, LayoutDashboard, CheckCircle2, Zap, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-inter, sans-serif)",
        boxSizing: "border-box"
      }}
    >
      {/* Dynamic Background Elements */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "20%",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: "var(--accent-violet)",
          opacity: 0.12,
          filter: "blur(140px)",
          animation: "pulse-slow 10s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "var(--accent-blue)",
          opacity: 0.1,
          filter: "blur(120px)",
          animation: "pulse-slow 12s ease-in-out infinite 2s",
          pointerEvents: "none",
        }}
      />

      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "1.25rem 2rem",
          boxSizing: "border-box",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(10, 10, 15, 0.4)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          position: "relative",
          zIndex: 20
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.5rem",
              width: "2.5rem",
              height: "2.5rem",
              background: "linear-gradient(135deg, var(--accent-violet), var(--accent-blue))",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            }}
          >
            <Layers size={20} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: "bold", fontSize: "1.25rem", letterSpacing: "-0.025em" }}>Linition</span>
        </div>
        <div>
          <Link
            href="/login"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: 500,
              padding: "0.6rem 1.25rem",
              borderRadius: "0.75rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white",
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}
          >
            Sign In
            <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "5rem 1.5rem 8rem",
          position: "relative",
          zIndex: 10,
          boxSizing: "border-box",
          width: "100%"
        }}
      >
        <div
          className="animate-fade-in"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "56rem",
            width: "100%",
            margin: "0 auto"
          }}
        >

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "2rem",
              padding: "0.375rem 1rem",
              borderRadius: "2rem",
              background: "rgba(139, 92, 246, 0.1)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              color: "var(--accent-violet)"
            }}
          >
            <Zap size={14} fill="currentColor" />
            <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Introducing Linition 2.0</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(3rem, 5vw + 1rem, 4.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              marginBottom: "1.5rem",
              lineHeight: 1.1,
              background: "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.6) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Manage projects with <br /> unparalleled clarity.
          </h1>

          <p
            style={{
              fontSize: "clamp(1.125rem, 2vw, 1.25rem)",
              marginBottom: "3rem",
              maxWidth: "42rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6
            }}
          >
            Linition is the premium task management platform designed for high-performing teams. Organize work, track progress, and achieve your goals in a beautifully crafted workspace.
          </p>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "5rem" }}>
            <Link
              href="/login"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                background: "linear-gradient(135deg, var(--accent-violet), var(--accent-blue))",
                padding: "1rem 2rem",
                borderRadius: "1rem",
                color: "white",
                fontWeight: 600,
                fontSize: "1.125rem",
                textDecoration: "none",
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
                transition: "transform 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              Get Started
              <ArrowRight size={20} />
            </Link>
          </div>

          {/* Abstract App Mockup / Visual */}
          <div
            className="animate-slide-in"
            style={{
              width: "100%",
              position: "relative",
              animationDelay: "300ms",
              padding: "1rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "1.5rem",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
              boxSizing: "border-box"
            }}
          >
            <div
              style={{
                background: "rgba(17, 17, 24, 0.8)",
                backdropFilter: "blur(20px)",
                borderRadius: "1rem",
                border: "1px solid rgba(255,255,255,0.05)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                aspectRatio: "16/9",
                width: "100%"
              }}
            >
              {/* Mockup Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1rem",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  boxSizing: "border-box"
                }}
              >
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "rgba(239, 68, 68, 0.8)" }} />
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "rgba(245, 158, 11, 0.8)" }} />
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.8)" }} />
              </div>
              {/* Mockup Body Content */}
              <div style={{ display: "flex", flex: 1, padding: "1.5rem", gap: "1.5rem", boxSizing: "border-box" }}>
                {/* Mockup Sidebar */}
                <div
                  style={{
                    width: "25%",
                    borderRadius: "0.75rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    background: "rgba(255,255,255,0.02)",
                    boxSizing: "border-box"
                  }}
                >
                  <div style={{ height: "2rem", borderRadius: "0.375rem", margin: "1rem", background: "rgba(255,255,255,0.05)" }} />
                  <div style={{ height: "1.5rem", width: "66%", borderRadius: "0.375rem", margin: "0 1rem", background: "rgba(255,255,255,0.03)" }} />
                  <div style={{ height: "1.5rem", width: "75%", borderRadius: "0.375rem", margin: "0 1rem", background: "rgba(255,255,255,0.03)" }} />
                </div>
                {/* Mockup Main */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ height: "2.5rem", width: "33%", borderRadius: "0.5rem", background: "rgba(255,255,255,0.05)" }} />
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ height: "8rem", flex: 1, borderRadius: "0.75rem", background: "rgba(139, 92, 246, 0.1)", border: "1px solid rgba(139, 92, 246, 0.2)" }} />
                    <div style={{ height: "8rem", flex: 1, borderRadius: "0.75rem", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)" }} />
                  </div>
                  <div style={{ flex: 1, borderRadius: "0.75rem", marginTop: "1rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Features Grid */}
      <section
        style={{
          width: "100%",
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "5rem 1.5rem",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            width: "100%"
          }}
        >

          <div style={{ padding: "1.5rem", borderRadius: "1rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", boxSizing: "border-box" }}>
            <div style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", background: "rgba(139, 92, 246, 0.1)", color: "var(--accent-violet)" }}>
              <LayoutDashboard size={24} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--text-primary)" }}>Intuitive Dashboard</h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>Get a bird's-eye view of all your projects and tasks instantly. Our dashboard keeps your focus sharp.</p>
          </div>

          <div style={{ padding: "1.5rem", borderRadius: "1rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", boxSizing: "border-box" }}>
            <div style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", background: "rgba(59, 130, 246, 0.1)", color: "var(--accent-blue)" }}>
              <CheckCircle2 size={24} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--text-primary)" }}>Seamless Tracking</h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>Track tasks from pending to completion with fluid state management and visually distinct priority levels.</p>
          </div>

          <div style={{ padding: "1.5rem", borderRadius: "1rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", boxSizing: "border-box" }}>
            <div style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--text-primary)" }}>Secure by Design</h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>Enterprise-grade security using Google OAuth and strict ownership boundaries to keep your data safe.</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          width: "100%",
          textAlign: "center",
          padding: "2rem",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          color: "var(--text-muted)",
          boxSizing: "border-box"
        }}
      >
        <p style={{ fontSize: "0.875rem" }}>© {new Date().getFullYear()} Linition. All rights reserved.</p>
      </footer>

      {/* Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.05); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-slide-in {
          opacity: 0;
          animation: slide-in 1s ease-out forwards;
        }
      `}} />
    </div>
  );
}
