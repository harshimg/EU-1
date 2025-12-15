"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { useAuth } from "@/lib/auth";

/* =====================================================
   USER → PYQ PAGE
===================================================== */

export default function PYQPage() {
  /* ---------------- AUTH ---------------- */
  const { user, loading } = useAuth();

  /* ---------------- USER CONTEXT ---------------- */
  const semesterCode = user?.semester; // "4"
  const branchCode = user?.branch;     // "105"

  /* ---------------- STATE ---------------- */
  const [subjects, setSubjects] = useState<any[]>([]);
  const [papers, setPapers] = useState<any[]>([]);
  const [paper, setPaper] = useState<any | null>(null);

  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [activeQNo, setActiveQNo] = useState<number | null>(null);

  /* =====================================================
     LOAD SUBJECTS
  ===================================================== */
  useEffect(() => {
    if (!user || !semesterCode || !branchCode) return;

    async function loadSubjects() {
      const res = await fetch(
        `${API_URL}/user/subjects?semester_code=${semesterCode}&branch_code=${branchCode}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const json = await res.json();
      setSubjects(json.data || []);

      if (json.data?.length) {
        setSelectedSubject(json.data[0]);
      }
    }

    loadSubjects();
  }, [user, semesterCode, branchCode]);

  /* =====================================================
     LOAD PAPERS (BY SUBJECT)
  ===================================================== */
  useEffect(() => {
    if (!selectedSubject) return;

    async function loadPapers() {
      const res = await fetch(
        `${API_URL}/user/papers?subject_code=${selectedSubject.code}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const json = await res.json();
      setPapers(json.data || []);

      if (json.data?.length) {
        setSelectedPaperId(json.data[0]._id);
      }
    }

    loadPapers();
  }, [selectedSubject]);

  /* =====================================================
     LOAD FULL PAPER
  ===================================================== */
  useEffect(() => {
    if (!selectedPaperId) return;

    async function loadPaper() {
      const res = await fetch(
        `${API_URL}/user/paper/${selectedPaperId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const json = await res.json();
      setPaper(json.data || null);

      if (json.data?.questions?.length) {
        setActiveQNo(json.data.questions[0].q_no);
      }
    }

    loadPaper();
  }, [selectedPaperId]);

  /* =====================================================
     GUARDS
  ===================================================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Please login to view PYQs
      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* LEFT PANEL */}
      <aside className="w-full md:w-72 bg-white border-b md:border-r border-slate-200 p-4 space-y-6">
        {/* SUBJECTS */}
        <div>
          <h3 className="text-xs font-semibold uppercase text-slate-500 mb-2">
            Subjects
          </h3>

          {subjects.map(s => (
            <button
              key={s._id}
              onClick={() => setSelectedSubject(s)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${
                selectedSubject?._id === s._id
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-slate-100"
              }`}
            >
              {s.short_name} — {s.full_name}
            </button>
          ))}
        </div>

        {/* PAPERS */}
        <div>
          <h3 className="text-xs font-semibold uppercase text-slate-500 mb-2">
            Papers
          </h3>

          {papers.map(p => (
            <button
              key={p._id}
              onClick={() => setSelectedPaperId(p._id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${
                selectedPaperId === p._id
                  ? "bg-emerald-600 text-white"
                  : "hover:bg-slate-100"
              }`}
            >
              {p.year} • {p.type}
            </button>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {!paper && (
          <div className="text-center text-slate-400">
            Select a paper
          </div>
        )}

        {paper && (
          <>
            <h1 className="text-xl font-bold mb-6">
              {paper.name}
            </h1>

            {paper.questions.map((q: any) => (
              <div
                key={q.q_no}
                onClick={() => setActiveQNo(q.q_no)}
                className={`mb-6 p-4 rounded-xl border cursor-pointer ${
                  activeQNo === q.q_no
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <h3 className="font-semibold mb-2">
                  Q{q.q_no} ({q.marks} marks)
                </h3>

                {q.heading && (
                  <p className="text-sm text-slate-600 mb-2">
                    {q.heading}
                  </p>
                )}

                {q.sub_questions?.map((sq: any) => (
                  <div key={sq.sq_no} className="ml-4 mt-3 text-sm">
                    <strong>({sq.sq_no})</strong>{" "}
                    {sq.question_md}

                    {sq.solution_md && (
                      <div className="mt-2 text-green-700">
                        {sq.solution_md}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
