"use client";

import { useState } from "react";

const API_BASE =
  "https://beu-bih.ac.in/backend/v1/result/get-result";

export default function ResultPage() {
  const [regNo, setRegNo] = useState("");
  const [semester, setSemester] = useState("");
  const [examHeld, setExamHeld] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function fetchResult() {
    if (!regNo || !semester || !examHeld || !year) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const url = `${API_BASE}?year=${year}&redg_no=${regNo}&semester=${semester}&exam_held=${encodeURIComponent(
        examHeld
      )}`;

      const res = await fetch(url);
      const json = await res.json();

      if (json.status !== 200) {
        throw new Error(json.message || "Failed to fetch result");
      }

      setResult(json.data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-xl font-semibold">BEU Examination Result</h1>

      {/* INPUT FORM */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow">
        <input
          className="input"
          placeholder="Registration No"
          value={regNo}
          onChange={e => setRegNo(e.target.value)}
        />
        <input
          className="input"
          placeholder="Semester (e.g. VI)"
          value={semester}
          onChange={e => setSemester(e.target.value)}
        />
        <input
          className="input"
          placeholder="Exam Held (e.g. November/2025)"
          value={examHeld}
          onChange={e => setExamHeld(e.target.value)}
        />
        <input
          className="input"
          placeholder="Year"
          value={year}
          onChange={e => setYear(e.target.value)}
        />

        <button
          onClick={fetchResult}
          disabled={loading}
          className="btn-primary md:col-span-4"
        >
          {loading ? "Fetching Result..." : "Get Result"}
        </button>
      </div>

      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="space-y-6">
          {/* RESULT HEADER */}
          <div className="bg-indigo-600 text-white rounded-xl p-5 shadow">
            <h2 className="text-xl font-semibold">
              Semester {result.semester} Result
            </h2>
            <p className="text-sm opacity-90 mt-1">
              {result.exam_held} • {result.examYear}
            </p>
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

          {/* THEORY SUBJECTS */}
          <SubjectTable
            title="Theory Subjects"
            data={result.theorySubjects}
          />

          {/* PRACTICAL SUBJECTS */}
          <SubjectTable
            title="Practical Subjects"
            data={result.practicalSubjects}
          />

          {/* SGPA */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold mb-3">
              SGPA (Semester-wise)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {result.sgpa.map((g: any, i: number) => (
                <div
                  key={i}
                  className="rounded-lg border px-3 py-2 bg-slate-50 flex justify-between"
                >
                  <span className="text-slate-500">
                    Sem {i + 1}
                  </span>
                  <span className="font-medium">
                    {g ?? "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CGPA + STATUS */}
          <div className="bg-white rounded-xl shadow p-5 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-lg font-semibold">
              CGPA:{" "}
              <span className="text-indigo-600">
                {result.cgpa}
              </span>
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

/* ---------- HELPER COMPONENTS ---------- */

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <span className="text-slate-500">{label}:</span>{" "}
      <span className="font-medium">{value || "-"}</span>
    </div>
  );
}

function SubjectTable({
  title,
  data,
}: {
  title: string;
  data: any[];
}) {
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
