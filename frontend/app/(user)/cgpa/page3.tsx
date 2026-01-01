"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function SgpaPage() {
  const { user, loading } = useAuth();

  /* ---------------- CORE STATE ---------------- */
  const [semester, setSemester] = useState<string>("");
  const [branch, setBranch] = useState<string>("");

  const [subjects, setSubjects] = useState<any[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const theorySubjects = subjects.filter(s => s.subject_type === "Theory");
  const practicalSubjects = subjects.filter(s => s.subject_type === "Practical");


  /* Dropdown data (guest users only) */
  const [semesters, setSemesters] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);

  // Marks
// const [marks, setMarks] = useState<Record<string, number | "">>({});

type TheoryMarks = { external: number | ""; internal: number | "" };
type PracticalMarks = { total: number | "" };
const [marks, setMarks] = useState<
  Record<string, TheoryMarks | PracticalMarks>
>({});

const [calculating, setCalculating] = useState(false);
const [sgpa, setSgpa] = useState<number | null>(null);

const canCalculate =
  subjects.length > 0 &&
  subjects.every(sub => {
    const m = marks[sub.code];

    if (sub.subject_type === "Theory") {
        const tm = m as TheoryMarks;
      return tm && tm.external !== "" && tm.internal !== "";
    }

    if (sub.subject_type === "Practical") {
        const pm = m as PracticalMarks;
      return pm && pm.total !== "";
    }

    return false;
  });




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


  useEffect(() => {
    setSgpa(null);
  }, [semester, branch, marks]);
  

// Calcultion of Sgpa
  async function handleCalculate() {
    // basic validation
    for (const sub of subjects) {
        const m = marks[sub.code];
      
        if (sub.subject_type === "Theory") {
            const tm = m as TheoryMarks;

          if (!tm || tm.external === "" || tm.internal === "") {
            alert(`Enter both marks for ${sub.short_name}`);
            return;
          }
        }
      
        if (sub.subject_type === "Practical") {
            const pm = m as PracticalMarks;

          if (!pm || pm.total === "") {
            alert(`Enter marks for ${sub.short_name}`);
            return;
          }
        }
      }
      


 
  
    setCalculating(true);
  
    try {
      const payload = {
        semester,
        branch,
        marks, // { "105403": 78, "105404": 66 }
      };
  
      const res = await apiPost("/api/public/sgpa/calculate", payload);
      setSgpa(res.sgpa);
    } catch (e: any) {
      alert(e.message || "Calculation failed");
    } finally {
      setCalculating(false);
    }
  }
  

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold">SGPA Calculator</h2>

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


{!loadingSubjects && theorySubjects.length > 0 && (
  <div className="space-y-3">
    <h4 className="font-semibold text-indigo-700">Theory Subjects</h4>

    {theorySubjects.map(sub => (
      <div key={sub.code} className="flex items-center gap-4">
        <div className="flex-1">
          <p className="font-medium">{sub.short_name}</p>
          <p className="text-xs text-gray-500">{sub.code}</p>
        </div>

        {/* External */}
        <input
          type="number"
          placeholder="External"
          className="w-20 input"
          value={(marks[sub.code] as TheoryMarks)?.external ?? ""}
          onChange={e =>
            setMarks(prev => ({
              ...prev,
              [sub.code]: {
                ...(prev[sub.code] as any),
                external: e.target.value === ""
                  ? ""
                  : Number(e.target.value),
              },
            }))
          }
          
        />

        {/* Internal */}
        <input
          type="number"
          placeholder="Internal"
          className="w-20 input"
          value={(marks[sub.code] as TheoryMarks)?.internal ?? ""}
        //   value={(marks[sub.code] as any)?.internal ?? ""}
          onChange={e =>
            setMarks(prev => ({
              ...prev,
              [sub.code]: {
                ...(prev[sub.code] as any),
                // internal: Number(e.target.value) || "",
                internal: e.target.value === "" ? "" : Number(e.target.value)
              },
            }))
                }
                />
            </div>
            ))}
        </div>
        )}


{!loadingSubjects && practicalSubjects.length > 0 && (
  <div className="space-y-3 mt-6">
    <h4 className="font-semibold text-green-700">Practical Subjects</h4>

    {practicalSubjects.map(sub => (
      <div key={sub.code} className="flex items-center gap-4">
        <div className="flex-1">
          <p className="font-medium">{sub.short_name}</p>
          <p className="text-xs text-gray-500">{sub.code}</p>
        </div>

        <input
          type="number"
          placeholder="Total"
          className="w-24 input"
          value={(marks[sub.code] as PracticalMarks)?.total ?? ""}
        //   value={(marks[sub.code] as any)?.total ?? ""}
          onChange={e =>
            setMarks(prev => ({
              ...prev,
              [sub.code]: {
                // total: Number(e.target.value) || "",
                total: e.target.value === "" ? "" : Number(e.target.value)
              },
            }))
          }
        />
      </div>
    ))}
  </div>
)}






    {/* ACTION */}
    <button
  disabled={!canCalculate || calculating}
  onClick={handleCalculate}
  className={`w-full mt-4 btn-primary transition
    ${(!canCalculate || calculating)
      ? "opacity-50 cursor-not-allowed"
      : "hover:scale-[1.01]"
    }`}
>
  {calculating ? "Calculating..." : "Calculate SGPA"}
</button>


    {/* RESULT */}
    {sgpa !== null && (
      <div className="mt-4 text-center bg-green-50
                      border border-green-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">Your SGPA</p>
        <p className="text-3xl font-bold text-green-600">{sgpa}</p>
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
