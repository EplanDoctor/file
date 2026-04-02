"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user, redirect to home with a flag
    if (!loading && !user) {
      router.push("/?auth=required");
    }
  }, [user, loading, router]);

  // While checking auth status, show a loader
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-electric-200 border-t-electric-600 rounded-full animate-spin"></div>
          <p className="text-xs font-black text-slate-400 tracking-widest uppercase">GİRİŞ KONTROL EDİLİYOR...</p>
        </div>
      </div>
    );
  }

  // If user exists, render children
  return <>{children}</>;
}
