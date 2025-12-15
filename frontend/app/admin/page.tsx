// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { API_URL } from "@/lib/api";
// import { useAuth } from "@/lib/auth";
// import { useRouter } from "next/navigation";
// const { user, loading } = useAuth();

// export default function AdminDashboard() {
//   const { user } = useAuth();
//   const router = useRouter();

//   const [stats, setStats] = useState({
//     semesters: 0,
//     branches: 0,
//     subjects: 0,
//     papers: 0,
//     questions: 0,
//   });

//   // 🔐 Guard (extra safety)

// //   useEffect(() => {
// //     if (loading) return; // ⛔ wait
  
// //     if (!user || user.role !== "admin") {
// //       router.replace("/");
// //     }
// //   }, [user, loading]);
// useEffect(() => {
//     if (loading) return; // ⛔ wait
  
//     if (!user || user.role !== "admin") {
//       router.replace("/");
//     }
//   }, [user, loading]);

//   // 🔢 Fetch stats
//   useEffect(() => {
//     async function loadStats() {
//       try {
//         const res = await fetch(`${API_URL}/admin/stats`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         const data = await res.json();
//         setStats(data);
//       } catch {
//         // silent fail
//       }
//     }
//     loadStats();
//   }, []);

//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10">

//       {/* PAGE HEADER */}
//       <div className="mb-10">
//         <h1 className="text-3xl font-extrabold tracking-tight">
//           Admin Dashboard
//         </h1>
//         <p className="text-slate-400 mt-1">
//           Manage academic structure and exam papers
//         </p>
//       </div>

//       {/* STATS GRID */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

//         <StatCard title="Semesters" value={stats.semesters} />
//         <StatCard title="Branches" value={stats.branches} />
//         <StatCard title="Subjects" value={stats.subjects} />
//         <StatCard title="Papers" value={stats.papers} />
//         <StatCard title="Questions" value={stats.questions} />

//       </div>

//       {/* QUICK ACTIONS */}
//       <div className="mt-12">
//         <h2 className="text-lg font-semibold mb-4">
//           Quick Actions
//         </h2>

//         <div className="flex flex-wrap gap-4">
//           <Link
//             href="/admin/structure"
//             className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 
//                        text-white font-semibold transition"
//           >
//             Manage Structure
//           </Link>

//           <Link
//             href="/admin/papers"
//             className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 
//                        text-slate-200 font-semibold transition"
//           >
//             Manage Papers
//           </Link>
//         </div>
//       </div>

//     </div>
//   );
// }

// /* -------------------- */
// /* STAT CARD COMPONENT */
// /* -------------------- */

// function StatCard({ title, value }: { title: string; value: number }) {
//   return (
//     <div className="bg-slate-900 border border-slate-800 
//                     rounded-2xl p-6 shadow-sm hover:border-slate-700 transition">

//       <div className="text-slate-400 text-sm mb-1">
//         {title}
//       </div>

//       <div className="text-3xl font-extrabold">
//         {value}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/lib/auth";

// export default function AdminDashboard() {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (loading) return;

//     if (!user || user.role !== "admin") {
//       router.replace("/");
//     }
//   }, [user, loading]);

//   if (loading) {
//     return <div className="text-center py-10">Loading...</div>;
//   }

//   if (!user || user.role !== "admin") {
//     return null;
//   }

//   return (
//     <div className="p-6 text-white">
//       <h1 className="text-2xl font-bold">Admin Dashboard</h1>
//     </div>
//   );
// }



// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/lib/auth";

// export default function AdminDashboard() {
//   const { user, loading, logout } = useAuth();
//   const router = useRouter();

//   // 🔐 Guard
//   useEffect(() => {
//     if (!loading && (!user || user.role !== "admin")) {
//       router.replace("/");
//     }
//   }, [user, loading]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] text-white">
//         Loading admin dashboard...
//       </div>
//     );
//   }

//   if (!user || user.role !== "admin") return null;

//   function StatCard({ title, value }: { title: string; value: string }) {
//     return (
//       <div
//         className="bg-[#11172C] rounded-xl p-5 
//                    border border-white/10 
//                    hover:border-indigo-500/40 transition"
//       >
//         <p className="text-xs uppercase tracking-wide text-slate-400">
//           {title}
//         </p>
//         <p className="text-3xl font-bold mt-2 text-white">
//           {value}
//         </p>
//       </div>
//     );
//   }

  
//   function ActionCard({ title }: { title: string }) {
//     return (
//       <button
//         className="bg-[#11172C] border border-white/10 
//                    rounded-xl p-5 text-left
//                    hover:border-indigo-500/50 
//                    hover:bg-indigo-500/10 transition"
//       >
//         <p className="font-semibold text-white">
//           {title}
//         </p>
//         <p className="text-xs text-slate-400 mt-1">
//           Add new {title.toLowerCase()}
//         </p>
//       </button>
//     );
//   }
  



//   return (
//     <div className="min-h-screen bg-[#0B0F1A] text-slate-200">
      
//       {/* ===== TOP BAR ===== */}
//       <header className="border-b border-white/10 bg-[#0F1629]">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//           <div>
//             <h1 className="text-xl font-bold tracking-wide">
//               Admin Dashboard
//             </h1>
//             <p className="text-xs text-slate-400">
//               Alpha Result • Control Panel
//             </p>
//           </div>

//           <button
//             onClick={logout}
//             className="text-sm px-4 py-2 rounded-md 
//                        bg-red-500/10 text-red-400 
//                        hover:bg-red-500/20 transition"
//           >
//             Logout
//           </button>
//         </div>
//       </header>

//       {/* ===== CONTENT ===== */}
//       <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">

//         {/* ===== STATS ===== */}
//         <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
//           <StatCard title="Semesters" value="04" />
//           <StatCard title="Branches" value="06" />
//           <StatCard title="Subjects" value="42" />
//           <StatCard title="Papers" value="128" />
//           <StatCard title="Questions" value="1,340" />
//         </section>

//         {/* ===== QUICK ACTIONS ===== */}
//         <section>
//           <h2 className="text-lg font-semibold mb-4">
//             Quick Actions
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             <ActionCard title="Create Semester" />
//             <ActionCard title="Create Branch" />
//             <ActionCard title="Create Subject" />
//             <ActionCard title="Create Paper" />
//           </div>
//         </section>

//       </main>
//     </div>
//   );
// }













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
