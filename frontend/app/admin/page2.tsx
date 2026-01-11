"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

/* =====================================================
   ADMIN DASHBOARD PAGE
===================================================== */

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  // 🔐 HARD GUARD (client-side)
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.replace("/");
    }
  }, [user, loading, router]);

  // ⏳ Loading state (important on refresh)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] text-slate-300">
        Loading admin dashboard...
      </div>
    );
  }

  // ❌ Not admin (extra safety)
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200">

      {/* ================= HEADER ================= */}
      <header className="border-b border-white/10 bg-[#0F1629]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">
              Admin Dashboard
            </h1>
            <p className="text-xs text-slate-400">
              Alpha Result • Control Panel
            </p>
          </div>

          <button
            onClick={logout}
            className="text-sm px-4 py-2 rounded-md 
                       bg-red-500/10 text-red-400 
                       hover:bg-red-500/20 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* ===== STATS ===== */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard title="Semesters" value="4" />
          <StatCard title="Branches" value="6" />
          <StatCard title="Subjects" value="42" />
          <StatCard title="Papers" value="128" />
          <StatCard title="Questions" value="1,340" />
        </section>

        {/* ===== QUICK ACTIONS ===== */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-white">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionCard title="Create Semester" />
            <ActionCard title="Create Branch" />
            <ActionCard title="Create Subject" />
            <ActionCard title="Create Paper" />
          </div>
        </section>

      </main>
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div
      className="bg-[#11172C] rounded-xl p-5 
                 border border-white/10 
                 hover:border-indigo-500/40 transition"
    >
      <p className="text-xs uppercase tracking-wide text-slate-400">
        {title}
      </p>
      <p className="text-3xl font-bold mt-2 text-white">
        {value}
      </p>
    </div>
  );
}

function ActionCard({ title }: { title: string }) {
  return (
    <button
      className="bg-[#11172C] border border-white/10 
                 rounded-xl p-5 text-left
                 hover:border-indigo-500/50 
                 hover:bg-indigo-500/10 transition"
    >
      <p className="font-semibold text-white">
        {title}
      </p>
      <p className="text-xs text-slate-400 mt-1">
        Add new {title.toLowerCase()}
      </p>
    </button>
  );
}
