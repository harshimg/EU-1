"use client";

export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

import BatchResultTable from "@/components/result/BatchResultTable";
import { fetchBatchResults } from "@/lib/result/fetchBatchResults";

const API_BASE =
  "https://beu-bih.ac.in/backend/v1/result/get-result";

const exam_held_months = ["December/2025", "November/2025", "July/2025", "May/2025" ]

export default function ResultPage() {
  const { user } = useAuth();

  const [regNo, setRegNo] = useState("");
  const [semester, setSemester] = useState("");
  const [examHeld, setExam_held] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  // Batch result 
  const [batchResults,setBatchResults] = useState(null)

  const [resultMode, setResultMode] = useState<"single" | "batch">("single");

  // params
  const searchParams = useSearchParams();

  useEffect(()=>{

    if(resultMode === "single"){
      setBatchResults(null);
      setSemester(null);
    }
    
    if(resultMode === "batch"){
      setResult(null);
      setSemester(null);
    }
    
    },[resultMode]);



  // async function fetchResult() {
  //   if (!regNo || !semester || !examHeld) {
  //       setError("Please fill all fields");
  //       return;
  //     }

  //   setLoading(true);
  //   setError("");
  //   setResult(null);
  
  //   const examYear = examHeld.split("/")[1] 
  //   const url = `${API_BASE}?year=${examYear}&redg_no=${regNo}&semester=${semester}&exam_held=${encodeURIComponent(examHeld)}`;
  
  //   const MAX_RETRIES = 16;
  //   const RETRY_DELAY_MS = 800; // 0.8s (safe for BEU server)
  
  //   for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
  //     try {
  //       const res = await fetch(url);
  //       const json = await res.json();
  
  //       if (json.status === 200 && json.data) {
  //         // ✅ SUCCESS → STOP RETRYING
  //         setResult(json.data);
  //         setLoading(false);
  //         return;
  //       }
  
  //       // If server responded but result not ready yet
  //       if (attempt < MAX_RETRIES) {
  //         await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
  //       }
  //     } catch (err) {
  //       // Network / CORS / timeout error
  //       if (attempt < MAX_RETRIES) {
  //         await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
  //       }
  //     }
  //   }
  
  //   // ❌ All retries failed
  //   setError(
  //     "Result server is not responding right now. Please try again after some time."
  //   );
  //   setLoading(false);
    
  // }

  async function fetchResult(exam_Held?:string, regist?: string, sem?: string) {
    
    const register = regist || regNo;
    const semesterValue = sem || semester;
    const examinationHeld = exam_Held || examHeld

    if(!examinationHeld){
      alert("Please select exam held");
      return;
    }

    if(!register){
      alert("Please enter Registration No.");
      return;
    }

    if(!semesterValue){
      alert("Please select semester");
      return;
    }
    
    if (!register || !semesterValue || !examinationHeld) {
      setError("Please fill all fields");
      return;
    }
  
    setLoading(true);
    setError("");
    setResult(null);
  
    const parts = examinationHeld.split("/");
    const examYear = parts.length === 2 ? parts[1] : "";
  
    if (!examYear) {
      setError("Invalid exam session");
      setLoading(false);
      return;
    }
  
    const url = `${API_BASE}?year=${examYear}&redg_no=${register}&semester=${semesterValue}&exam_held=${encodeURIComponent(
      examinationHeld
    )}`;
  
    const MAX_RETRIES = 16;
    const RETRY_DELAY_MS = 800;
  
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
  
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
  
        const res = await fetch(url, {
          signal: controller.signal,
        });
  
        clearTimeout(timeout);
  
        if (!res.ok) {
          throw new Error(`Server error ${res.status}`);
        }
  
        const json = await res.json();
  
        if (json?.status === 200 && json?.data) {
          setResult(json.data);
          setLoading(false);
          return;
        }
  
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
        }
  
      } catch (err) {
  
        if (attempt === MAX_RETRIES) break;
  
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
      }
    }
  
    setError(
      "Check Examination (Month/Year) and valid Registration No. or Result server is busy right now. Please try again after some time."
    );
  
    setLoading(false);
  }


  // when comes from /result/new set exam_held using params
  useEffect(() => {

    const examHeldParam = searchParams.get("examHeld");
    const registrationParam = searchParams.get("regNo");
    const semesterParam = searchParams.get("semester");


  
    if (examHeldParam) {
      setExam_held(decodeURIComponent(examHeldParam));
    }
  
    if (registrationParam) {
      setRegNo(registrationParam);
    }

    if (semesterParam) {
      setSemester(semesterParam);
    }

    if (examHeldParam && registrationParam && semesterParam) {
  
      fetchResult(examHeldParam, registrationParam, semesterParam);
  
    }
  
  }, [searchParams]);


  // Batch Result
async function loadBatch(semester?: string){

  try {

    if(!examHeld){
      alert("Please select exam held");
      return;
    }
    

    const examYear = examHeld.split("/")[1]

    setLoading(true);

    const data = await fetchBatchResults(
      regNo,
      semester,
      examHeld,
      examYear
    )

    setBatchResults(data.students)
    setLoading(false);

  } catch (err:any) {

    console.error("Batch fetch error:-----",err.message)

  }

}
  
  
  return (
  <div className="max-w-6xl mx-auto px-4 py-6">

    {/* PAGE TITLE (HIDDEN ON PRINT) */}
    <h1 className="text-xl font-semibold mb-4 print:hidden">
      BEU Examination Result
    </h1>

   {/* INPUT FORM */}
<div className="bg-white p-5 rounded-xl shadow space-y-5 print:hidden">

{/* ROW 1 — EXAM HELD */}
<div>
  <label className="text-sm font-medium text-gray-600">
    Exam Held
  </label>

  <select
    className="input mt-1 w-full"
    value={examHeld}
    onChange={e => setExam_held(e.target.value)}
  >
    <option value="">Month/Year</option>
    {exam_held_months.map(eh => (
      <option key={eh} value={eh}>{eh}</option>
    ))}
  </select>
</div>



{/* tooglle */}
{/* <div className="flex justify-center mt-4 mb-6">
  <div className="inline-flex rounded-xl bg-gray-100 p-1 shadow-inner">
    <button
      onClick={() => setResultMode("single")}
      className={`px-5 py-2 text-sm font-semibold rounded-lg transition
        ${
          resultMode === "single"
            ? "bg-white text-blue-600 shadow"
            : "text-gray-600 hover:text-gray-800"
        }`}
    >
      Single Result
    </button>

    <button
      onClick={() => setResultMode("batch")}
      className={`px-5 py-2 text-sm font-semibold rounded-lg transition
        ${
          resultMode === "batch"
            ? "bg-white text-blue-600 shadow"
            : "text-gray-600 hover:text-gray-800"
        }`}
    >
      Batch Result
    </button>
  </div>
</div> */}

  <div className="flex items-center justify-center gap-4 mt-4 mb-6">
    <span className="text-sm font-medium text-gray-700">
      Single Result
    </span>
    <button
      onClick={() =>
        setResultMode(resultMode === "single" ? "batch" : "single")
      }
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition
        ${resultMode === "batch" ? "bg-green-500" : "bg-gray-300"}
      `}
    >
    <span
      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition
      ${resultMode === "batch" ? "translate-x-7" : "translate-x-1"}
      `}
    />
      </button>
        <span className="text-sm font-medium text-gray-700">
          Batch Result
        </span>
  </div>

{/* <p className="text-xs text-gray-500 text-center -mt-3 mb-4">
Mode: {resultMode === "single" ? "Single Student Result" : "Batch Result"}
</p> */}


{/* ROW 2 — REGISTRATION INPUT */}
<div className="flex items-center gap-3">

  {/* DECREMENT */}
  <button
    type="button"
    onClick={() => {
      if (!regNo) return;
      const num = Number(regNo);
      if (!isNaN(num) && num > 1) {
        const newReg = String(num - 1);
        setRegNo(newReg);
        fetchResult(undefined, newReg, undefined);
      }
    }}
    className="h-14 w-14 rounded-lg
               bg-purple-600 hover:bg-purple-700
               text-white text-xl font-bold
               flex items-center justify-center
               shadow-md transition active:scale-95"
  >
    −
  </button>


  {/* INPUT */}
  <input
    type="number"
    className="input h-14 text-center text-lg font-semibold flex-1"
    placeholder="Registration Number"
    value={regNo}
    onChange={e => {
      const value = e.target.value;
      if (/^\d*$/.test(value)) {
        setRegNo(value);
      }
    }}
  />


  {/* INCREMENT */}
  <button
    type="button"
    onClick={() => {
      if (!regNo) return;
      const num = Number(regNo);
      if (!isNaN(num)) {
        const newReg = String(num + 1);
        setRegNo(newReg);
        fetchResult(undefined, newReg, undefined);
      }
    }}
    className="h-14 w-14 rounded-lg
               bg-purple-600 hover:bg-purple-700
               text-white text-xl font-bold
               flex items-center justify-center
               shadow-md transition active:scale-95"
  >
    +
  </button>

</div>


{/* ROW 3 — SEMESTER BUTTONS */}
<div>
  <p className="text-sm font-medium text-gray-600 mb-2">
    Select Semester
  </p>

  <div className="grid grid-cols-4 gap-2">

    {[
      {label:"SEM 1", val:"I"},
      {label:"SEM 2", val:"II"},
      {label:"SEM 3", val:"III"},
      {label:"SEM 4", val:"IV"},
      {label:"SEM 5", val:"V"},
      {label:"SEM 6", val:"VI"},
      {label:"SEM 7", val:"VII"},
      {label:"SEM 8", val:"VIII"},
    ].map(sem => (

      <button
        key={sem.val}
        onClick={() => {
          setSemester(sem.val);
          if (resultMode === "single") {
            fetchResult(undefined, undefined, sem.val);
          } else {
            loadBatch(sem.val);
          }
        }}
        className={`h-11 rounded-lg text-sm font-semibold transition
          ${semester === sem.val
            ? "bg-blue-600 text-white shadow-md"
            : "bg-gray-100 hover:bg-blue-50"}
        `}
      >
        {sem.label}
      </button>

    ))}

  </div>

</div>

</div>


        {/* ERROR (HIDDEN ON PRINT) */}
        {error && (
          <div className="mt-4 bg-red-50 text-red-600 p-3 rounded print:hidden">
            {error}
          </div>
        )}

        {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="flex items-center gap-2 text-blue-600 font-medium">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            </svg>
            Fetching result...
          </div>
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


  {batchResults && (
    <BatchResultTable
      students={batchResults}
      semester={semester}
    />
  )}

  </div>
);






  
}
