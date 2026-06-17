"use client";

import { signIn } from "next-auth/react";
import { Layers, ArrowRight, Mail, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMsg("Account created successfully! Please sign in.");
    }
    if (searchParams.get("error") === "CredentialsSignin") {
      setError("Invalid email or password");
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingCredentials(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setIsLoadingCredentials(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong");
      setIsLoadingCredentials(false);
    }
  };

  return (
    <div
      id="login-page-v4"
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
            Welcome back
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
          
          {successMsg && (
            <div style={{ padding: "0.75rem", borderRadius: "0.5rem", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "var(--accent-emerald)", fontSize: "0.875rem", marginBottom: "1.5rem", textAlign: "center" }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleCredentialsLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              disabled={isLoadingCredentials}
              style={{
                width: "100%",
                padding: "0.875rem",
                borderRadius: "0.75rem",
                background: "linear-gradient(135deg, var(--accent-violet), var(--accent-blue))",
                color: "white",
                fontWeight: 600,
                fontSize: "1rem",
                border: "none",
                cursor: isLoadingCredentials ? "not-allowed" : "pointer",
                opacity: isLoadingCredentials ? 0.7 : 1,
                transition: "all 0.2s",
                boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
                marginTop: "0.5rem"
              }}
            >
              {isLoadingCredentials ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", margin: "1.5rem 0", color: "var(--text-muted)", fontSize: "0.875rem" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--border-primary)" }} />
            <span style={{ padding: "0 1rem" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "var(--border-primary)" }} />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoadingGoogle}
            className="group relative w-full flex items-center justify-center gap-4 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(180deg, rgba(34, 34, 46, 0.8) 0%, rgba(26, 26, 36, 0.8) 100%)",
              padding: "0.875rem 1.5rem",
              borderRadius: "0.75rem",
              border: "1px solid var(--border-primary)",
              color: "white",
              fontSize: "0.9375rem",
              fontWeight: 500,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              if (!isLoadingGoogle) {
                e.currentTarget.style.background = "linear-gradient(180deg, rgba(42, 42, 56, 0.9) 0%, rgba(34, 34, 46, 0.9) 100%)";
                e.currentTarget.style.borderColor = "var(--border-subtle)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoadingGoogle) {
                e.currentTarget.style.background = "linear-gradient(180deg, rgba(34, 34, 46, 0.8) 0%, rgba(26, 26, 36, 0.8) 100%)";
                e.currentTarget.style.borderColor = "var(--border-primary)";
              }
            }}
          >
            {isLoadingGoogle ? (
              <div
                className="animate-spin"
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  borderRadius: "50%",
                  border: "2px solid var(--text-muted)",
                  borderTopColor: "white",
                }}
              />
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="20" height="20" style={{ transition: "transform 0.2s ease" }}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Don't have an account?{" "}
            <Link href="/register" style={{ color: "var(--accent-violet)", textDecoration: "none", fontWeight: 500 }}>
              Sign Up
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
