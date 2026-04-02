"use client";

import { useEffect, useState } from "react";

const API = "https://beu-bih.ac.in/backend/v1/result/sem-get";

function numberToRoman(num: number) {
  const map: any = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
    8: "VIII",
  };
  return map[num] || num;
}

export default function ResultListPage() {

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [regInputs, setRegInputs] = useState<any>({});

  const latestExam = courses
  .flatMap(c => c.exams)
  .sort(
    (a,b)=> new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  )[0]

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(API);
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Failed to load exams", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function handleInputChange(examId: number, value: string) {
    setRegInputs((prev: any) => ({
      ...prev,
      [examId]: value
    }));
  }

  function goToResult(exam: any) {

    const regNo = regInputs[exam.id];

    if (!regNo) {
      alert("Enter Registration Number");
      return;
    }

    const semRoman = numberToRoman(exam.semId);

    window.location.href =
      `/result?regNo=${regNo}&semester=${semRoman}&examHeld=${encodeURIComponent(exam.examHeld)}`;
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600">
        Loading results...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

{latestExam && (
  <div className="bg-green-100 border border-green-300 p-3 mb-6 rounded text-green-800 text-sm">
    🎉 Latest Result Released: <b>{latestExam.examName} (Exam Held:- {latestExam.examHeld})</b>
  </div>
)}

      <h1 className="text-center text-blue-700 font-semibold mb-6 text-lg">
        Examination Results
        <span className="text-gray-600 text-sm ml-1">
          (Enter registration number to access result)
        </span>
      </h1>

      {/* INTRO */}
<div className="text-sm text-slate-600 max-w-3xl mx-auto mb-5 text-center">
  <p>
    View the latest Bihar Engineering University (BEU) examination results by entering your registration number. This page provides quick access to published results across semesters.
  </p>
</div>

{/* HOW TO USE */}
<div className="bg-white border rounded-lg shadow-sm p-4 mb-4 text-sm text-slate-600">
  <h3 className="font-semibold text-slate-800 mb-2">
    How to Check Your Result
  </h3>
  <ul className="list-disc list-inside space-y-1">
    <li>Find your exam from the list below.</li>
    <li>Enter your registration number in the input field.</li>
    <li>Click on “View Result” or press Enter.</li>
    <li>Your detailed result will open instantly.</li>
  </ul>
</div>

      <div className="overflow-x-auto border rounded-lg shadow-sm">

        <table className="min-w-full text-sm">

          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Examinations Name</th>
              <th className="px-4 py-2 text-left">Batch / Session</th>
              <th className="px-4 py-2 text-left">Exam Held</th>
              <th className="px-4 py-2 text-left">Published Date</th>
              <th className="px-4 py-2 text-left">Registration No</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>

            {courses.map((course) => (

              <>

                {/* Course Header */}
                <tr key={course.courseid}>
                  <td
                    colSpan={6}
                    className="bg-gray-200 font-semibold px-4 py-2 text-gray-800"
                  >
                    {course.courseName}
                  </td>
                </tr>

                {[...course.exams]
                  .sort(
                    (a, b) =>
                      new Date(b.publishDate).getTime() -
                      new Date(a.publishDate).getTime()
                  )
                  .map((exam: any) => (

                    <tr key={exam.id} className="border-t hover:bg-gray-50">

                      <td className="px-4 py-2 text-blue-600">
                        {exam.examName}
                      </td>

                      <td className="px-4 py-2">
                        {exam.session}
                      </td>

                      <td className="px-4 py-2">
                        {exam.examHeld}
                      </td>

                      <td className="px-4 py-2">
                        {new Date(exam.publishDate).toLocaleDateString()}
                      </td>

                      {/* Registration Input */}
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          placeholder="Reg No"
                          value={regInputs[exam.id] || ""}
                          onChange={(e) =>
                            handleInputChange(exam.id, e.target.value)
                          }
                          onKeyDown={(e)=>{
                            if(e.key==="Enter") goToResult(exam)
                           }}
                          className="border rounded px-2 py-1 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>

                      {/* Button */}
                      <td className="px-4 py-2">
                        <button
                          onClick={() => goToResult(exam)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                        >
                          View Result
                        </button>
                      </td>

                    </tr>

                  ))}

              </>
            ))}

          </tbody>
        </table>
      </div>

{/* NOTE */}
<div className="text-xs text-slate-500 text-center mt-6 max-w-3xl mx-auto">
  <p>
    Note: Results displayed here are for quick reference. 
    Please verify with official university records for final confirmation.
  </p>
</div>


    </div>
  );
}