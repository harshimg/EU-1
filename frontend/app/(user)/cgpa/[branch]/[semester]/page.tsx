"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";
import { useAuth } from "@/lib/auth";

import { handleShare } from "@/components/handleShare/handleShare";
import { Share2, Share  } from "lucide-react";

import { SEMESTERS } from "@/lib/constants/academic";
import { BRANCHES } from "@/lib/constants/academic";

const semesters = SEMESTERS;
const branches = BRANCHES;


export default function SgpaPage() {
  const { user, loading, refreshUser } = useAuth();

  /* ---------------- CORE STATE ---------------- */
  const [semester, setSemester] = useState<string>("");
  const [branch, setBranch] = useState<string>("");

  const [subjects, setSubjects] = useState<any[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const theorySubjects = subjects.filter(s => s.subject_type === "Theory");
  const practicalSubjects = subjects.filter(s => s.subject_type === "Practical");


  const router = useRouter();
const params = useParams();

  /* ---------------- URL PARAMS ---------------- */
  const branchFromUrl = params?.branch as string | undefined;
  const semesterParam = params?.semester as string | undefined;

  const semesterFromUrl =
  typeof semesterParam === "string"
    ? semesterParam.replace("sem-", "")
    : "";


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
    // 1️⃣ URL has highest priority
    if (branchFromUrl && semesterFromUrl) {
      setBranch(branchFromUrl);
      setSemester(semesterFromUrl);
      return;
    }
  
    // 2️⃣ fallback to logged-in user
    if (user?.semester && user?.branch) {
      setSemester(user.semester);
      setBranch(user.branch);
    }
  
  }, [branchFromUrl, semesterFromUrl, user]);


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
    setMarks({});
    setSgpa(null);
  }, [semester, branch]);

  useEffect(() => {
    setMarks({});
  }, [subjects]);  


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
/* ---------------- UI ---------------- */
return (
  <div className="min-h-screen bg-slate-100 py-8 px-3">
    <div className="max-w-3xl mx-auto space-y-6">

      {/* PAGE HEADER */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800">
          SGPA Calculator
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Enter marks as per university evaluation scheme
        </p>
      </div>


      {/* INFO INTRO */}
      <div className="text-sm text-slate-600 text-center max-w-2xl mx-auto">
        <p>
          This SGPA calculator helps you estimate your semester performance based on your internal and external marks. 
          Simply enter your marks for each subject and get your SGPA instantly.
        </p>
      </div>


<div className="flex justify-end mb-2">
<button
  onClick={() =>
    handleShare({
      title: "SGPA Calculator - AlphaResult",
      text: "Calculate your SGPA easily on AlphaResult 🎓",
    })
  }
      className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
>
<Share size={28} />
  Share
</button>
</div>

      {/* SEMESTER / BRANCH */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            className="input"
            value={semester}
            // onChange={e => setSemester(e.target.value)}
            onChange={e => {
              const sem = e.target.value;
              localStorage.setItem("semester", sem);
              setSemester(sem);
            
              if (branch) {
                router.push(`/cgpa/${branch}/sem-${sem}`);
              }
            }}
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
            // onChange={e => setBranch(e.target.value)}
            onChange={e => {
              const b = e.target.value;
              localStorage.setItem("branch", b);
              setBranch(b);
            
              if (semester) {
                router.push(`/cgpa/${b}/sem-${semester}`);
              }
            }}
          >
            <option value="">Select Branch</option>
            {branches.map(b => (
              <option key={b.code} value={b.code}>
                {b.full_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LOADING */}
      {loadingSubjects && (
        <p className="text-center text-sm text-gray-500">
          Loading subjects…
        </p>
      )}


      {/* HOW IT WORKS */}
<div className="bg-white rounded-xl shadow-sm p-4 text-sm text-slate-600">
  <h3 className="font-semibold text-slate-800 mb-2">
    How SGPA is Calculated
  </h3>
  <p>
    SGPA (Semester Grade Point Average) is calculated based on your marks in each subject and their respective credits. 
    Higher marks result in better grade points, which contribute to your overall SGPA.
  </p>
</div>

      {/* THEORY SUBJECTS */}
      {!loadingSubjects && theorySubjects.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
          <h4 className="font-semibold text-indigo-700">
            Theory Subjects
          </h4>

          {/* HEADER */}
          {/* <div className="grid grid-cols-[1fr_72px_72px]
                          text-xs text-gray-500 border-b pb-2"> */}
          <div className="grid grid-cols-[1fr_110px_110px] text-xs text-gray-500 border-b pb-2">

            <span>Subject</span>
            <span className="text-center">Ext (End-Sem)</span>
            <span className="text-center">Int (Mid-Sem)</span>
          </div>
          
          {theorySubjects.map(sub => (
            // <div
            //   key={sub.code}
            //   className="grid grid-cols-[1fr_72px_72px]
            //              items-center gap-2 py-1"
            // >
 <div
              key={sub.code}
              className="grid grid-cols-[1fr_100px_100px]
                         items-center gap-2 py-1"
            >

              {/* SUBJECT */}
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {sub.short_name}
                </p>
                <p className="text-xs text-gray-500">
                  {sub.code}
                </p>
              </div>

              {/* EXTERNAL */}
              <input
                type="number"
                min={0}
                max={70}
                placeholder="Max 70"
                className="input h-9 w-24 sm:w-28 md:w-32 text-center"
                value={(marks[sub.code] as TheoryMarks)?.external ?? ""}
                onChange={e =>
                  setMarks(prev => ({
                    ...prev,
                    [sub.code]: {
                      ...(prev[sub.code] as any),
                      external:
                        e.target.value === ""
                          ? ""
                          : Number(e.target.value),
                    },
                  }))
                }
              />

              {/* INTERNAL */}
              <input
                type="number"min={0}
                max={30}
                placeholder="Max 30"
                className="input h-9 w-24 sm:w-28 md:w-32 text-center"
                value={(marks[sub.code] as TheoryMarks)?.internal ?? ""}
                onChange={e =>
                  setMarks(prev => ({
                    ...prev,
                    [sub.code]: {
                      ...(prev[sub.code] as any),
                      internal:
                        e.target.value === ""
                          ? ""
                          : Number(e.target.value),
                    },
                  }))
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* PRACTICAL SUBJECTS */}
      {!loadingSubjects && practicalSubjects.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
          <h4 className="font-semibold text-green-700">
            Practical Subjects
          </h4>

          <div className="grid grid-cols-[1fr_85px]
                          text-xs text-gray-500 border-b pb-2">
            <span>Subject</span>
            <span className="text-center">Total</span>
          </div>

          {practicalSubjects.map(sub => (
            <div
              key={sub.code}
              className="grid grid-cols-[1fr_100px]
                         items-center gap-2 py-1"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {sub.short_name}
                </p>
                <p className="text-xs text-gray-500">
                  {sub.code}
                </p>
              </div>

              <input
                type="number"
                min={0}
                max={sub.max_marks}
                placeholder={`Max ${sub.max_marks}`}
                className="input h-9  text-center"
                value={(marks[sub.code] as PracticalMarks)?.total ?? ""}
                onChange={e =>
                  setMarks(prev => ({
                    ...prev,
                    [sub.code]: {
                      total:
                        e.target.value === ""
                          ? ""
                          : Number(e.target.value),
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
        className={`w-full btn-primary py-3 rounded-lg font-semibold
          ${(!canCalculate || calculating)
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-[1.01]"
          }`}
      >
        {calculating ? "Calculating..." : "Calculate SGPA"}
      </button>

      {/* RESULT */}
      {sgpa !== null && (
        <div className="bg-green-50 border border-green-200
                        rounded-xl p-5 text-center">
          <p className="text-sm text-gray-600">
            Your SGPA
          </p>
          <p className="text-4xl font-bold text-green-600 mt-1">
            {sgpa}
          </p>
        </div>
      )}



      {/* NO SUBJECTS */}
      {!loadingSubjects && semester && branch && subjects.length === 0 && (
        <p className="text-center text-sm text-red-500">
          No subjects found for selected semester & branch.

          <p className="text-center text-sm text-slate-600">
            Subjects for this semester are currently not available. 
            We are continuously updating data, please check back soon.
          </p>
        </p>

      )}


            {/* ADDITIONAL INFO */}
<div className="text-xs text-slate-500 text-center max-w-2xl mx-auto pt-4">
  <p>
    Note: This calculator provides an estimated SGPA based on entered marks. 
    Actual SGPA may vary depending on your university’s grading system and credit structure.
  </p>
</div>

    </div>
  </div>
);






}





