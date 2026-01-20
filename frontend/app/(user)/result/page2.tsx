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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-xl font-semibold">BEU Examination Result</h1>

      {/* INPUT FORM */}
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
          {loading ? "Fetching Result..." : "Get Result"}
        </button>
      </div>

      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded print:hidden">
          {error}
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="space-y-6">
          {/* HEADER */}
          <div className="bg-indigo-600 text-white rounded-xl p-5 shadow">
            <h2 className="text-xl font-semibold">
              Semester {result.semester} Result
            </h2>
            <p className="text-sm opacity-90 mt-1">
              {result.exam_held} • {result.examYear}
            </p>
          </div>

          {/* PRINT BUTTON */}
          <div className="flex justify-end print:hidden">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg text-sm font-medium
                         bg-slate-800 text-white hover:bg-slate-900"
            >
              Print / Save PDF
            </button>
          </div>

          {/* STUDENT INFO */}
          <div className="bg-white rounded-xl shadow p-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <Info label="Name" value={result.name} />
            <Info label="Registration No" value={result.redg_no} />
            <Info label="Father's Name" value={result.father_name} />
            <Info label="Mother's Name" value={result.mother_name} />
            <Info label="College" value={result.college_name} />
            <Info label="College Code" value={result.college_code} />
            <Info label="Course" value={result.course} />
            <Info label="Course Code" value={result.course_code} />
          </div>

          <SubjectTable title="Theory Subjects" data={result.theorySubjects} />
          <SubjectTable title="Practical Subjects" data={result.practicalSubjects} />

          {/* SGPA */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold mb-3">SGPA (Semester-wise)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {result.sgpa.map((g: any, i: number) => (
                <div
                  key={i}
                  className="rounded-lg border px-3 py-2 bg-slate-50 flex justify-between"
                >
                  <span className="text-slate-500">Sem {i + 1}</span>
                  <span className="font-medium">{g ?? "-"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CGPA + STATUS */}
          <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
            <div className="text-lg font-semibold">
              CGPA: <span className="text-indigo-600">{result.cgpa}</span>
            </div>
            <div
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                result.fail_any
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {result.fail_any ? result.fail_any : "PASS"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- HELPERS ---------- */

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <span className="text-slate-500">{label}:</span>{" "}
      <span className="font-medium">{value || "-"}</span>
    </div>
  );
}

function SubjectTable({ title, data }: { title: string; data: any[] }) {
  if (!data?.length) return null;

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <h3 className="px-4 py-3 font-semibold">{title}</h3>
      <table className="w-full text-sm border-t">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-2 text-left">Code</th>
            <th className="p-2 text-left">Subject</th>
            <th className="p-2">ESE</th>
            <th className="p-2">IA</th>
            <th className="p-2">Total</th>
            <th className="p-2">Grade</th>
            <th className="p-2">Credit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((s, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{s.code}</td>
              <td className="p-2">{s.name}</td>
              <td className="p-2 text-center">{s.ese}</td>
              <td className="p-2 text-center">{s.ia}</td>
              <td className="p-2 text-center">{s.total}</td>
              <td
                className={`p-2 text-center font-semibold ${
                  s.grade === "F"
                    ? "text-red-600"
                    : "text-slate-700"
                }`}
              >
                {s.grade}
              </td>
              <td className="p-2 text-center">{s.credit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );





  
}
