"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

const API_BASE =
  "https://beu-bih.ac.in/backend/v1/result/get-result";

const SEMESTERS = ["I","II","III","IV","V","VI","VII","VIII"];

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const YEARS = ["2023", "2024", "2025", "2026"];

export default function ResultPage() {
  const { user } = useAuth();

  const [regNo, setRegNo] = useState("");
  const [semester, setSemester] = useState("");
  const [examMonth, setExamMonth] = useState("");
  const [examYear, setExamYear] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  /* ---------- AUTO-FILL SEMESTER ---------- */
  useEffect(() => {
    if (user?.semester) {
      setSemester(user.semester);
    }
  }, [user]);

  async function fetchResult() {
    if (!regNo || !semester || !examMonth || !examYear) {
      setError("Please fill all fields");
      return;
    }
  
    setLoading(true);
    setError("");
    setResult(null);
  
    const examHeld = `${examMonth}/${examYear}`;
    const url = `${API_BASE}?year=${examYear}&redg_no=${regNo}&semester=${semester}&exam_held=${encodeURIComponent(
      examHeld
    )}`;
  
    const MAX_RETRIES = 16;
    const RETRY_DELAY_MS = 800; // 0.8s (safe for BEU server)
  
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const res = await fetch(url);
        const json = await res.json();
  
        if (json.status === 200 && json.data) {
          // ✅ SUCCESS → STOP RETRYING
          setResult(json.data);
          setLoading(false);
          return;
        }
  
        // If server responded but result not ready yet
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
        }
      } catch (err) {
        // Network / CORS / timeout error
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
        }
      }
    }
  
    // ❌ All retries failed
    setError(
      "Result server is not responding right now. Please try again after some time."
    );
    setLoading(false);
  }
  


  return (
  <div className="max-w-6xl mx-auto px-4 py-6">

    {/* PAGE TITLE (HIDDEN ON PRINT) */}
    <h1 className="text-xl font-semibold mb-4 print:hidden">
      BEU Examination Result
    </h1>

    {/* INPUT FORM (HIDDEN ON PRINT) */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow print:hidden">
      <input
        className="input"
        placeholder="Registration No"
        value={regNo}
        onChange={e => setRegNo(e.target.value)}
      />

      <select
        className="input"
        value={semester}
        onChange={e => setSemester(e.target.value)}
      >
        <option value="">Select Semester</option>
        {SEMESTERS.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select
        className="input"
        value={examMonth}
        onChange={e => setExamMonth(e.target.value)}
      >
        <option value="">Exam Month</option>
        {MONTHS.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <select
        className="input"
        value={examYear}
        onChange={e => setExamYear(e.target.value)}
      >
        <option value="">Exam Year</option>
        {YEARS.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      <button
        onClick={fetchResult}
        disabled={loading}
        className="btn-primary md:col-span-4"
      >
        {loading ? "Fetching Result…" : "Get Result"}
      </button>
    </div>

    {/* ERROR (HIDDEN ON PRINT) */}
    {error && (
      <div className="mt-4 bg-red-50 text-red-600 p-3 rounded print:hidden">
        {error}
      </div>
    )}

    {/* ================= RESULT SHEET ================= */}
    {result && (
      <>
        {/* PRINT BUTTON */}
        <div className="flex justify-end my-4 print:hidden">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-800 text-white rounded text-sm"
          >
            Print / Save PDF
          </button>
        </div>

        {/* RESULT CONTAINER (ONLY THIS PRINTS) */}
        <div className="bg-white border border-black p-6 print:p-0 print:border-0">

          {/* HEADER */}
          <div className="text-center border-b border-black pb-2 mb-3">
            <h2 className="font-bold text-lg">
              BIHAR ENGINEERING UNIVERSITY, PATNA
            </h2>
            <p className="text-sm font-medium text-red-600">
              B.Tech {result.semester} Semester Examination, {result.examYear}
            </p>
          </div>

          {/* BASIC INFO */}
          <table className="w-full text-sm border border-black mb-3">
            <tbody>
              <tr>
                <td className="border p-1 w-1/4">Semester:</td>
                <td className="border p-1">{result.semester}</td>
                <td className="border p-1 w-1/4">
                  Examination (Month/Year):
                </td>
                <td className="border p-1">{result.exam_held}</td>
              </tr>
              <tr>
                <td className="border p-1">Registration No:</td>
                <td className="border p-1" colSpan={3}>{result.redg_no}</td>
              </tr>
              <tr>
                <td className="border p-1">Student Name:</td>
                <td className="border p-1" colSpan={3}>{result.name}</td>
              </tr>
              <tr>
                <td className="border p-1">Father's Name:</td>
                <td className="border p-1">{result.father_name}</td>
                <td className="border p-1">Mother's Name:</td>
                <td className="border p-1">{result.mother_name}</td>
              </tr>
              <tr>
                <td className="border p-1">College Name:</td>
                <td className="border p-1" colSpan={3}>
                  {result.college_code} - {result.college_name}
                </td>
              </tr>
              <tr>
                <td className="border p-1">Course Name:</td>
                <td className="border p-1" colSpan={3}>
                  {result.course_code} - {result.course}
                </td>
              </tr>
            </tbody>
          </table>

          {/* THEORY */}
          <h3 className="font-semibold text-sm bg-slate-300 px-2 py-1 border border-black">
            THEORY
          </h3>
          <table className="w-full text-sm border border-black mb-3">
            <thead className="bg-slate-200">
              <tr>
                <th className="border p-1">Subject Code</th>
                <th className="border p-1">Subject Name</th>
                <th className="border p-1">ESE</th>
                <th className="border p-1">IA</th>
                <th className="border p-1">Total</th>
                <th className="border p-1">Grade</th>
                <th className="border p-1">Credit</th>
              </tr>
            </thead>
            <tbody>
              {result.theorySubjects.map((s: any, i: number) => (
                <tr key={i}>
                  <td className="border p-1">{s.code}</td>
                  <td className="border p-1">{s.name}</td>
                  <td className="border p-1 text-center">{s.ese}</td>
                  <td className="border p-1 text-center">{s.ia}</td>
                  <td className="border p-1 text-center">{s.total}</td>
                  <td className="border p-1 text-center">{s.grade}</td>
                  <td className="border p-1 text-center">{s.credit}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PRACTICAL */}
          <h3 className="font-semibold text-sm bg-slate-300 px-2 py-1 border border-black">
            PRACTICAL
          </h3>
          <table className="w-full text-sm border border-black mb-3">
            <thead className="bg-slate-200">
              <tr>
                <th className="border p-1">Subject Code</th>
                <th className="border p-1">Subject Name</th>
                <th className="border p-1">ESE</th>
                <th className="border p-1">IA</th>
                <th className="border p-1">Total</th>
                <th className="border p-1">Grade</th>
                <th className="border p-1">Credit</th>
              </tr>
            </thead>
            <tbody>
              {result.practicalSubjects.map((s: any, i: number) => (
                <tr key={i}>
                  <td className="border p-1">{s.code}</td>
                  <td className="border p-1">{s.name}</td>
                  <td className="border p-1 text-center">{s.ese}</td>
                  <td className="border p-1 text-center">{s.ia}</td>
                  <td className="border p-1 text-center">{s.total}</td>
                  <td className="border p-1 text-center">{s.grade}</td>
                  <td className="border p-1 text-center">{s.credit}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* SGPA / CGPA */}
          <table className="w-full text-sm border border-black mb-2">
            <tbody>
              <tr>
                <td className="border p-1 font-medium">SGPA</td>
                {result.sgpa.map((g: any, i: number) => (
                  <td key={i} className="border p-1 text-center">
                    {g ?? "-"}
                  </td>
                ))}
                <td className="border p-1 font-medium">CGPA</td>
                <td className="border p-1 text-center">{result.cgpa}</td>
              </tr>
            </tbody>
          </table>

          {/* REMARK */}
          <p className="text-sm font-medium">
            Remarks:{" "}
            <span className={result.fail_any ? "text-red-600" : "text-green-700"}>
              {result.fail_any || "PASS"}
            </span>
          </p>
        </div>
      </>
    )}
  </div>
);






  
}
