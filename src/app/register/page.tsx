"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layers, ArrowRight, User, Mail, Lock } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="bg-grid min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-inter, sans-serif)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "var(--accent-violet)",
          opacity: 0.15,
          filter: "blur(140px)",
          animation: "pulse-slow 8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "var(--accent-blue)",
          opacity: 0.15,
          filter: "blur(120px)",
          animation: "pulse-slow 8s ease-in-out infinite 2s",
          pointerEvents: "none",
        }}
      />
      
      <div 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, var(--accent-violet), var(--accent-blue))",
          opacity: 0.8
        }}
      />

      <div className="relative z-10 w-full px-6 flex flex-col items-center animate-fade-in" style={{ maxWidth: "440px" }}>
        
        <div className="flex flex-col items-center justify-center mb-8" style={{ animationDelay: "50ms" }}>
          <div className="relative mb-4">
            <div 
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, var(--accent-violet), var(--accent-blue))",
                borderRadius: "1.25rem",
                filter: "blur(12px)",
                opacity: 0.6
              }}
            />
            <div 
              className="relative flex items-center justify-center"
              style={{
                width: "4rem",
                height: "4rem",
                borderRadius: "1.25rem",
                background: "linear-gradient(135deg, var(--accent-violet), var(--accent-blue))",
                boxShadow: "0 10px 25px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.1)"
              }}
            >
              <Layers size={28} color="white" strokeWidth={2.5} />
            </div>
          </div>
          <h1 
            className="text-3xl font-bold tracking-tight text-center"
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 2px 10px rgba(0,0,0,0.2)"
            }}
          >
            Create an Account
          </h1>
        </div>

        <div 
          className="w-full relative overflow-hidden animate-slide-in"
          style={{ 
            animationDelay: "150ms",
            background: "rgba(17, 17, 24, 0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: "1.5rem",
            padding: "2rem",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0,0,0,0.3)",
          }}
        >
          <div 
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)"
            }}
          />

          {error && (
            <div style={{ padding: "0.75rem", borderRadius: "0.5rem", background: "rgba(244, 63, 94, 0.1)", border: "1px solid rgba(244, 63, 94, 0.2)", color: "var(--accent-rose)", fontSize: "0.875rem", marginBottom: "1.5rem", textAlign: "center" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>
                <User size={18} />
              </div>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem 0.875rem 3rem",
                  borderRadius: "0.75rem",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                  outline: "none",
                  fontSize: "0.9375rem",
                  transition: "all 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-violet)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-primary)"; }}
              />
            </div>

            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem 0.875rem 3rem",
                  borderRadius: "0.75rem",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                  outline: "none",
                  fontSize: "0.9375rem",
                  transition: "all 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-violet)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-primary)"; }}
              />
            </div>

            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem 0.875rem 3rem",
                  borderRadius: "0.75rem",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                  outline: "none",
                  fontSize: "0.9375rem",
                  transition: "all 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-violet)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-primary)"; }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "0.875rem",
                borderRadius: "0.75rem",
                background: "linear-gradient(135deg, var(--accent-violet), var(--accent-blue))",
                color: "white",
                fontWeight: 600,
                fontSize: "1rem",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
                transition: "all 0.2s",
                boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
                marginTop: "0.5rem"
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(139, 92, 246, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(139, 92, 246, 0.3)";
                }
              }}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--accent-violet)", textDecoration: "none", fontWeight: 500 }}>
              Sign In
            </Link>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.05); }
        }
      `}} />
    </div>
  );
}
