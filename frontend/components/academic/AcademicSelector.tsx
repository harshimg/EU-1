"use client";

import { SEMESTERS, BRANCHES } from "@/lib/constants/academic";
import Link from "next/link";

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
      <div className="max-w-1xl mx-auto space-y-6">
  
        {/* 🔝 TITLE */}
        <div className="text-center space-y-2">
       
          {/* <h1 className="text-2xl font-semibold text-slate-800"> */}
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          <p className="text-sm text-slate-500">
            BEU Study Platform • PYQs • Solutions • Tools
          </p>
            {title}
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Select your branch and semester to access relevant study materials, 
            previous year questions, and tools tailored for your course.
          </p>
        </div>
  
        {/* 📦 CARD */}
        {/* <div className="bg-white rounded-xl shadow-sm p-5 space-y-6"> */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-md border border-slate-200 p-6">
  
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
                    // className="px-4 py-2 rounded-lg border text-sm 
                    //            bg-white hover:bg-indigo-50 
                    //            hover:border-indigo-300 transition"
                    className="px-4 py-2 rounded-lg border text-sm font-medium
bg-white hover:bg-indigo-50 hover:border-indigo-400
transition-all duration-200 hover:scale-[1.03] active:scale-95"
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


{/* 📊 STRUCTURED SEMESTER GRID (TRANSPOSED) */}
<div className="mt-12 bg-white rounded-xl shadow-sm p-5">
  <h2 className="text-lg font-semibold text-slate-800 text-center mb-6">
    Explore by Semester & Branch
  </h2>

  <div className="space-y-10">

    {SEMESTERS.map((sem) => (
      <div key={sem.code} className="space-y-4">

        {/* Semester Title */}
        <div className="flex justify-center">
          <h3 className="px-4 py-1.5 rounded-full 
                        bg-slate-100 text-slate-700 border border-slate-200
                        bg-slate-800 text-white
                        text-sm font-semibold tracking-wide
                        border border-indigo-200
                        shadow-sm">
            {sem.name}
          </h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            
            {/* Header */}
            <thead className="bg-slate-50 text-center">
              <tr>
                <th className="py-2 px-3 text-left">Branch</th>
                <th className="py-2 px-3">PYQ</th>
                <th className="py-2 px-3">Solution</th>
                <th className="py-2 px-3">Calculate CGPA</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y">

              {BRANCHES.map((b) => (
                <tr key={b.code} className="text-center">

                  {/* Branch Name */}
                  <td className="py-2 px-3 text-left font-medium text-slate-700">
                    {b.full_name}
                  </td>

                  {/* PYQ */}
                  <td>
                    <Link
                      href={`/pyq/download/${b.code}/sem-${sem.code}`}
                      className="text-indigo-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>

                  {/* Solution */}
                  <td>
                    <Link
                      href={`/pyq/${b.code}/sem-${sem.code}`}
                      className="text-green-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>

                  {/* CGPA */}
                  <td>
                    <Link
                      href={`/cgpa/${b.code}/sem-${sem.code}`}
                      className="text-blue-600 hover:underline"
                    >
                      Open
                    </Link>
                  </td>

                </tr>
              ))}

            </tbody>
          </table>
        </div>

      </div>
    ))}

  </div>
</div>





    
        <div className="mt-6 text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
  <p>
    Previous year question papers (PYQs) are one of the most effective ways to prepare for exams. 
    By selecting your branch and semester, you can access subject-wise papers that help you understand 
    exam patterns, important topics, and frequently asked questions.
  </p>

  <p className="mt-3">
    Practicing these papers regularly improves confidence, time management, and overall performance in exams. 
    You can also explore solutions and syllabus to strengthen your preparation.
  </p>
</div>
  
      </div>
    </div>
  );
}