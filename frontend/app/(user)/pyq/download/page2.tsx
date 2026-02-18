"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

export default function PyqDownloadPage() {
  const { user } = useAuth();

  /* ---------------- STATE ---------------- */
  const [semester, setSemester] = useState<string>("");
  const [branch, setBranch] = useState<string>("");

  const [subjects, setSubjects] = useState<any[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  const [semesters, setSemesters] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);

  /* ---------------- AUTO-FILL FROM USER ---------------- */
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

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">

      {/* PAGE TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Download Previous Year Question Papers
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Select semester & branch to download subject-wise PDFs.
        </p>
      </div>

      {/* ---------------- FILTER SECTION ---------------- */}
      <div className="bg-white rounded-2xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm text-slate-600 mb-1">
            Semester
          </label>
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
        </div>

        <div>
          {/* <label className="block text-sm text-slate-600 mb-1"> */}
          <label className="block text-sm text-slate-600 mb-1">
            Branch
          </label>
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

      </div>

      {/* ---------------- SUBJECT TABLE ---------------- */}
      {loadingSubjects && (
        <div className="text-slate-500">Loading subjects...</div>
      )}

      {!loadingSubjects && semester && branch && subjects.length > 0 && (
        <div className="bg-white rounded-2xl shadow overflow-x-auto">

          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-3 text-left">Subject Code</th>
                <th className="p-3 text-left">Subject Name</th>
                <th className="p-3 text-center">Download</th>
                <th className="p-3 text-center">Solutions</th>
              </tr>
            </thead>

            <tbody>
              {subjects.map((s: any) => (
                <tr key={s.code} className="border-t hover:bg-slate-50 transition">

                  <td className="p-3 font-medium text-slate-700">
                    {s.code}
                  </td>

                  <td className="p-3 text-slate-600">
                    {s.short_name}
                  </td>

                  <td className="p-3 text-center">
                    {s.all_paper_pdf ? (
                      <a
                        href={s.all_paper_pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-md text-xs font-medium
                                   bg-indigo-600 text-white
                                   hover:bg-indigo-700 transition"
                      >
                        Download PDF
                      </a>
                    ) : (
                      <span className="text-slate-400 text-xs">
                        Not Available
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-center">
                    <Link
                      href={`/pyq?subject=${s.code}`}
                      className="px-3 py-1.5 rounded-md text-xs font-medium
                                 bg-slate-200 text-slate-700
                                 hover:bg-slate-300 transition"
                    >
                      View Solution
                    </Link>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}

      {!loadingSubjects && semester && branch && subjects.length === 0 && (
        <div className="text-slate-500">
          No theory subjects found for selected semester & branch.
        </div>
      )}
    </div>
  );
}
