"use client";

import { SEMESTERS, BRANCHES } from "@/lib/constants/academic";

type Props = {
  semester: string | null;
  branch: string | null;
  checked: boolean;
  selectSemester: (sem: string) => void;
  selectBranch: (b: string) => void;
  title?: string;
};

export default function AcademicSelector({
  semester,
  branch,
  checked,
  selectSemester,
  selectBranch,
  title = "Select Branch & Semester",
}: Props) {
  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-3">
      <div className="max-w-3xl mx-auto space-y-6">

        <h2 className="text-2xl font-semibold text-center">
          {title}
        </h2>

        {/* SEMESTERS */}
        {!semester && (
          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-2 text-center">
              Choose Semester
            </h3>

            <div className="flex flex-wrap gap-3 justify-center">
              {SEMESTERS.map(s => (
                <button
                  key={s.code}
                  onClick={() => selectSemester(s.code)}
                  className="px-4 py-2 border rounded hover:bg-indigo-50 text-sm"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* BRANCHES */}
        {!branch && (
          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-2 text-center">
              Choose Branch
            </h3>

            <div className="flex flex-wrap gap-3 justify-center">
              {BRANCHES.map(b => (
                <button
                  key={b.code}
                  onClick={() => selectBranch(b.code)}
                  className="px-4 py-2 border rounded hover:bg-indigo-50 text-sm"
                >
                  {b.short_name}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}