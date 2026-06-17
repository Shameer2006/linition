"use client";

import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/Sidebar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div 
        className="bg-grid"
        style={{ 
          display: "flex", 
          height: "100vh", 
          background: "var(--bg-primary)",
          overflow: "hidden" 
        }}
      >
        <Sidebar />
        <main 
          style={{ 
            flex: 1, 
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            height: "100%"
          }}
        >
          <div 
            style={{ 
              maxWidth: "1400px", 
              margin: "0 auto", 
              padding: "2rem",
              width: "100%",
              boxSizing: "border-box"
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
