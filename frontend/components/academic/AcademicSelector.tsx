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
  
        {/* 🔝 TITLE */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-slate-800">
            {title}
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Select your branch and semester to access relevant study materials, 
            previous year questions, and tools tailored for your course.
          </p>
        </div>
  
        {/* 📦 CARD */}
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-6">
  
          {/* SEMESTERS */}
          {!semester && (
            <div>
              <h3 className="text-sm font-medium text-slate-600 mb-3 text-center">
                Choose Semester
              </h3>
  
              <div className="flex flex-wrap gap-3 justify-center">
                {SEMESTERS.map(s => (
                  <button
                    key={s.code}
                    onClick={() => selectSemester(s.code)}
                    className="px-4 py-2 rounded-lg border text-sm 
                               bg-white hover:bg-indigo-50 
                               hover:border-indigo-300 transition"
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
              <h3 className="text-sm font-medium text-slate-600 mb-3 text-center">
                Choose Branch
              </h3>
  
              <div className="flex flex-wrap gap-3 justify-center">
                {BRANCHES.map(b => (
                  <button
                    key={b.code}
                    onClick={() => selectBranch(b.code)}
                    className="px-4 py-2 rounded-lg border text-sm 
                               bg-white hover:bg-indigo-50 
                               hover:border-indigo-300 transition"
                  >
                    {b.short_name}
                  </button>
                ))}
              </div>
            </div>
          )}
  
        </div>
  
        {/* 📘 INFO SECTION (VERY IMPORTANT FOR ADSENSE) */}
        <div className="text-sm text-slate-600 text-center max-w-2xl mx-auto">
          <p>
            AlphaResult provides semester-wise study resources including previous year question papers, 
            detailed solutions, syllabus, and academic tools like SGPA calculator. 
            Selecting the correct branch and semester ensures accurate and relevant content.
          </p>
        </div>
  
      </div>
    </div>
  );
}