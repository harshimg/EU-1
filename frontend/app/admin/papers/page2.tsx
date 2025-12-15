"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

/* =====================================================
   ADMIN PAPERS PAGE
===================================================== */

export default function AdminPapersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Filters
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [subject, setSubject] = useState("");

  // 🔐 Guard
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] text-slate-300 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200">

      {/* HEADER */}
      <header className="border-b border-white/10 bg-[#0F1629]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-xl font-bold text-white">
            Papers Management
          </h1>
          <p className="text-xs text-slate-400">
            Semester → Branch → Subject → Papers
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* FILTERS */}
        <div className="bg-[#11172C] border border-white/10 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <Select
              label="Semester"
              value={semester}
              onChange={setSemester}
            />

            <Select
              label="Branch"
              value={branch}
              onChange={setBranch}
            />

            <Select
              label="Subject"
              value={subject}
              onChange={setSubject}
            />

            <div className="flex items-end">
              <button
                className="w-full px-4 py-2 rounded-md bg-indigo-500 
                           text-white font-medium hover:bg-indigo-600 transition"
              >
                Add Paper
              </button>
            </div>

          </div>
        </div>

        {/* PAPERS TABLE */}
        <div className="bg-[#11172C] border border-white/10 rounded-xl p-6">

          <h2 className="text-lg font-semibold text-white mb-4">
            Papers
          </h2>

          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-[#0F1629] text-slate-400">
                <tr>
                  <th className="px-4 py-3 text-left">Code</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Year</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t border-white/5">
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    Select semester, branch and subject to view papers
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

      </main>
    </div>
  );
}

/* =====================================================
   REUSABLE SELECT
===================================================== */

function Select({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-slate-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#0F1629] border border-white/10 
                   rounded-md px-4 py-2 text-sm text-slate-300"
      >
        <option value="">Select {label}</option>
      </select>
    </div>
  );
}
