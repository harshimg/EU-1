"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function CgpaPage() {
  const { user, loading } = useAuth();

  /* ---------------- CORE STATE ---------------- */
  const [semester, setSemester] = useState<string>("");
  const [branch, setBranch] = useState<string>("");

  const [subjects, setSubjects] = useState<any[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  /* Dropdown data (guest users only) */
  const [semesters, setSemesters] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);

  const isLoggedIn = !!user;

  /* ---------------- INIT FROM USER (ONCE) ---------------- */
  useEffect(() => {
    if (user?.semester && user?.branch) {
      setSemester(user.semester);
      setBranch(user.branch);

    }

  }, [user]);

  /* ---------------- FETCH DROPDOWNS (GUEST ONLY) ---------------- */
  useEffect(() => {
    // if (isLoggedIn) return;
    if (semester  && branch) return;

    apiGet("/api/public/semester")
      .then(res => setSemesters(res.data || []))
      .catch(() => {});

    apiGet("/api/public/branch")
      .then(res => setBranches(res.data || []))
      .catch(() => {});
  }, [isLoggedIn]);

  /* ---------------- FETCH SUBJECTS ---------------- */
  useEffect(() => {
    if (!semester || !branch) return;

    setLoadingSubjects(true);

    apiGet(`/api/public/subjects?semester_code=${semester}&branch_code=${branch}`)
      .then(res => setSubjects(res.data || []))
      .catch(() => setSubjects([]))
      .finally(() => setLoadingSubjects(false));
  }, [semester, branch]);

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold">CGPA Calculator</h2>

      {/* GUEST DROPDOWNS */}
      {/* {!isLoggedIn && ( */}
      {    (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl shadow">
          <select
            className="input"
            value={semester}
            onChange={e => setSemester(e.target.value)}
          >
            <option value="">Select Semester</option>
            {semesters.map(s => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            className="input"
            value={branch}
            onChange={e => setBranch(e.target.value)}
          >
            <option value="">Select Branch</option>
            {branches.map(b => (
              <option key={b.code} value={b.code}>
                {b.full_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* SUBJECTS */}
      {loadingSubjects && (
        <p className="text-sm text-gray-500">Loading subjects…</p>
      )}

      {!loadingSubjects && subjects.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow space-y-3">
          <h3 className="font-semibold">Subjects</h3>

          {subjects.map(sub => (
            <div
              key={sub.code}
              className="flex justify-between py-2 border-b last:border-0"
            >
              <span>{sub.short_name}</span>
              <span className="text-gray-500">{sub.code}</span>
              <input
              className="input mb-0"
              placeholder="Enter MArks"
         
              //onChange={e => setCode(e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      {!loadingSubjects && semester && branch && subjects.length === 0 && (
        <p className="text-sm text-red-500">
          No subjects found for selected semester & branch.
        </p>
      )}
    </div>
  );
}
