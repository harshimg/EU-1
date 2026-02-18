"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

export default function PyqDownloadPage() {
  const { user } = useAuth();

  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");

  const [subjects, setSubjects] = useState<any[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  const [semesters, setSemesters] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);

  /* ---------------- AUTO FILL ---------------- */
  useEffect(() => {
    if (user?.semester && user?.branch) {
      setSemester(user.semester);
      setBranch(user.branch);
    }
  }, [user]);

  /* ---------------- FETCH DROPDOWNS ---------------- */
  useEffect(() => {
    apiGet("/api/public/semester")
      .then(res => setSemesters(res.data || []))
      .catch(() => {});

    apiGet("/api/public/branch")
      .then(res => setBranches(res.data || []))
      .catch(() => {});
  }, []);

  /* ---------------- FETCH SUBJECTS ---------------- */
  useEffect(() => {
    if (!semester || !branch) return;

    setLoadingSubjects(true);

    apiGet(
      `/api/public/subjects?semester_code=${semester}&branch_code=${branch}`
    )
      .then(res => {
        const theoryOnly = (res.data || []).filter(
          (s: any) => s.subject_type === "Theory"
        );
        setSubjects(theoryOnly);
      })
      .catch(() => setSubjects([]))
      .finally(() => setLoadingSubjects(false));
  }, [semester, branch]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Download Previous Year Question Papers
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Access subject-wise question papers instantly.
        </p>
      </div>

      {/* FILTER CARD */}
      <div className="bg-white rounded-2xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

        <select
          className="input w-full"
          value={semester}
          onChange={e => setSemester(e.target.value)}
        >
          <option value="">Select Semester</option>
          {semesters.map((s: any) => (
            <option key={s.code} value={s.code}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          className="input w-full"
          value={branch}
          onChange={e => setBranch(e.target.value)}
        >
          <option value="">Select Branch</option>
          {branches.map((b: any) => (
            <option key={b.code} value={b.code}>
              {b.short_name}({b.code})
            </option>
          ))}
        </select>
      </div>

      {/* SEMESTER BADGE */}
      {semester && branch && (
        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 rounded-full text-sm font-medium
                           bg-indigo-100 text-indigo-700">
            Semester {semester}
          </span>
          <span className="px-4 py-1.5 rounded-full text-sm font-medium
                           bg-slate-200 text-slate-700">
            Branch {branch}
          </span>
        </div>
      )}

      {/* LOADING SKELETON */}
      {loadingSubjects && (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white p-5 rounded-xl shadow-sm flex justify-between"
            >
              <div className="space-y-2 w-1/2">
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                <div className="h-3 bg-slate-200 rounded w-1/3"></div>
              </div>
              <div className="h-8 w-24 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* SUBJECT LIST (CARD STYLE TABLE) */}
      {!loadingSubjects && subjects.length > 0 && (
        <div className="space-y-4">

          {subjects.map((s: any) => (
            <div
              key={s.code}
              className="bg-white rounded-xl shadow-sm p-5
                         hover:shadow-md transition
                         flex flex-col md:flex-row
                         md:items-center md:justify-between
                         gap-4"
            >

              {/* LEFT INFO */}
              <div>
                <h3 className="font-semibold text-slate-800">
                  {s.full_name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Subject Code: {s.code}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 flex-wrap">

                {s.all_paper_pdf ? (
                  <a
                    href={s.all_paper_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg text-sm font-medium
                               bg-indigo-600 text-white
                               hover:bg-indigo-700 transition"
                  >
                    Download Question
                  </a>
                ) : (
                  <span className="px-4 py-2 rounded-lg text-sm
                                   bg-slate-100 text-slate-400">

                    Available Soon
                    {/* Not Available */}
                  </span>
                )}

                <Link
                  href={`/pyq?subject=${s.code}`}
                  className="px-4 py-2 rounded-lg text-sm font-medium
                             bg-slate-200 text-slate-700
                             hover:bg-slate-300 transition"
                >
                  View Solution
                </Link>

              </div>

            </div>
          ))}

        </div>
      )}

      {!loadingSubjects && semester && branch && subjects.length === 0 && (
        <div className="text-slate-500">
            Available Soon
          {/* No theory subjects found. */}
        </div>
      )}

    </div>
  );
}
