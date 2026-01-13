"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { apiGet, apiPut } from "@/lib/api";


/* =====================================================
   ADMIN DASHBOARD PAGE
===================================================== */

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [sem_count, setsem_count] = useState<number | null>(null);
  const [branch_count, setbranch_count] = useState<number | null>(null);
  const [subject_count, setsubject_count] = useState<number | null>(null);
  const [paper_count, setpaper_count] = useState<number | null>(null);

  // 🔐 HARD GUARD (client-side)
  useEffect(() => {
    if (!loading && (!user || user.role !== "superalpha")) {
      router.replace("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === "superalpha") {
    count_semester();
    count_branch();
    count_subject();
    count_paper();
    }
  }, [user, loading]
  );

  function count_semester(){
    if (loading) return;              // ⛔ wait for auth to resolve
    if (!user || user.role !== "superalpha") return;
     apiGet("/admin/ssb/semester/count")
    .then(json => {
      setsem_count(json.data)
    })
  }

  function count_branch(){
    if (loading) return;              // ⛔ wait for auth to resolve
    if (!user || user.role !== "superalpha") return;
     apiGet("/admin/ssb/branch/count")
    .then(json => {
      setbranch_count(json.data)
    })
  }

  function count_subject(){
    if (loading) return;              // ⛔ wait for auth to resolve
    if (!user || user.role !== "superalpha") return;
     apiGet("/admin/ssb/subject/count")
    .then(json => {
      setsubject_count(json.data)
    })
  }

  function count_paper(){
    if (loading) return;              // ⛔ wait for auth to resolve
    if (!user || user.role !== "superalpha") return;
     apiGet("/admin/ssb/papers/count")
    .then(json => {
      setpaper_count(json.data)
    })
  }


  // ⏳ Loading state (important on refresh)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] text-slate-300">
        Loading admin dashboard...
      </div>
    );
  }

  // ❌ Not admin (extra safety)
  if (!user || user.role !== "superalpha") {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200">

      {/* ================= HEADER ================= */}
      {/* <header className="border-b border-white/10 bg-[#0F1629]">
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
      </header> */}

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* ===== STATS ===== */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard title="Semesters" value={sem_count} />
          <StatCard title="Branches" value={branch_count} />
          <StatCard title="Subjects" value={subject_count} />
          <StatCard title="Papers" value={paper_count} />
          <StatCard title="Questions" value={paper_count*9} />
        </section>

        {/* ===== QUICK ACTIONS ===== */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-white">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionCard title="Create Semester" url="ssb" />
            <ActionCard title="Create Branch" url="ssb" />
            <ActionCard title="Create Subject" url="ssb" />
            <ActionCard title="Create Paper" url="papers" />
          </div>
        </section>

      </main>
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

function StatCard({ title, value }: { title: string; value: number }) {
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

function ActionCard({ title, url }: { title: string, url: string }) {
  return (
    <a href={`/admin/${url}`}
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
    </a>  
  );
}
{/* <Footer /> */}
