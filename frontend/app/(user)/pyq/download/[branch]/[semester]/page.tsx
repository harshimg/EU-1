"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { useRef } from "react";
import Image from "next/image";

import { handleShare } from "@/components/handleShare/handleShare";
import { Share2, Share, Maximize2  } from "lucide-react";

import { SEMESTERS } from "@/lib/constants/academic";
import { BRANCHES } from "@/lib/constants/academic";

import { getPosterPath } from "@/lib/posters";

// import { PdfViewer } from "@/components/academic/PdfViewer"
import dynamic from "next/dynamic";

const PdfViewer = dynamic(
  () => import("@/components/academic/PdfViewer"),
  { ssr: false }
);

const semesters = SEMESTERS;
const branches = BRANCHES;

export default function PyqDownloadPage() {
  const { user } = useAuth();

  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");

  const [subjects, setSubjects] = useState<any[]>([]);
  const [AllSubjects, setAllSubjects] = useState<any[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  const [openSyllabus, setOpenSyllabus] = useState<string | null>(null);
  const [syllabusMap, setSyllabusMap] = useState<any>({});

  const router = useRouter();
  const params = useParams();
  
    /* ---------------- URL PARAMS ---------------- */
    const branchFromUrl = params?.branch as string | undefined;
    const semesterParam = params?.semester as string | undefined;
  
    const semesterFromUrl =
    typeof semesterParam === "string"
      ? semesterParam.replace("sem-", "")
      : "";

      const posterSrc = getPosterPath(semesterFromUrl, branchFromUrl);

    // All papers pdf link of one subject

    const [activeSubject, setActiveSubject] = useState<string | null>(null);
    const [activeSubjectCode, setActiveSubjectCode] = useState<string | null>(null);
    const [papers, setPapers] = useState<any[]>([]);
    const [loadingPapers, setLoadingPapers] = useState(false);
    const [activePaperIndex, setActivePaperIndex] = useState(-1);

    const handleViewPapers = async (subject: any) => {
      // 🔁 TOGGLE CLOSE
      if (activeSubjectCode === subject.code) {
        setActiveSubjectCode(null);
        setPapers([]);
        return;
      }
    
      setActiveSubjectCode(subject.code);
      setLoadingPapers(true);
      setActivePaperIndex(-1); // ✅ RESET
    
      try {
        const res = await apiGet(`/api/public/papers/${subject.code}`);
        setPapers(res.data || []);
      } catch {
        setPapers([]);
      } finally {
        setLoadingPapers(false);
      }

       // ✅ SCROLL AFTER OPEN
  // setTimeout(() => {
  //   document
  //     .getElementById(`subject-${subject.code}`)
  //     ?.scrollIntoView({ behavior: "smooth", block: "start" });
  // }, 100);
    };


    const viewerRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const toggleFullscreen = (id: string) => {
      const el = viewerRefs.current[id];
    
      if (!document.fullscreenElement) {
        el?.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    };


  // Download paper
  // const getDownloadLink = (url: string) => {
  //   const match = url.match(/\/d\/(.*?)\//);
  //   return match
  //     ? `https://drive.google.com/uc?export=download&id=${match[1]}`
  //     : url;
  // };

  const getDownloadLink = (url: string, filename: string) => {
    if (!url) return "";
  
    // Google Drive
    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/(.*?)\//);
      return match
        ? `https://drive.google.com/uc?export=download&id=${match[1]}`
        : url;
    }
  
    // 🔥 Cloudinary RAW fix
    if (url.includes("res.cloudinary.com")) {
      const parts = url.split("/upload/");
      // console.log("aaaaaaaaaaa")
      // return `${url}?dl=${encodeURIComponent(filename)}.pdf`;
      return `${url}?dl=1`;
    }
  
    return url;
  };

  /* ---------------- AUTO FILL ---------------- */
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

//   useEffect(() => {
//     if (user?.semester && user?.branch) {
//       setSemester(user.semester);
//       setBranch(user.branch);
//     }
//   }, [user]);

  /* ---------------- FETCH SUBJECTS ---------------- */
  useEffect(() => {
    if (!semester || !branch) return;

    setLoadingSubjects(true);

    apiGet(
      `/api/public/subjects?semester_code=${semester}&branch_code=${branch}`
    )
      .then(res => {
        const theoryOnly = (res.data || []).filter(
          (s: any) => s.subject_type === "Theory"
        );
        setSubjects(theoryOnly);
        setAllSubjects(res.data)
        handleViewPapers(theoryOnly[0])
        
        // setLoadingPapers(false);
      })
      .catch(() => setSubjects([]))
      .finally(() => setLoadingSubjects(false));
  }, [semester, branch]);



// ----------------------FETCH SYYALBUS-----------------
  async function loadSyllabus(subjectCode: string) {
    if (syllabusMap[subjectCode]) {
      setOpenSyllabus(subjectCode);
      return;
    }
  
    try {
      const res = await apiGet(`/api/public/subject/${subjectCode}`);
      setSyllabusMap((prev: any) => ({
        ...prev,
        [subjectCode]: res.data?.syllabus || [],
      }));
  
      setOpenSyllabus(subjectCode);
    } catch {
      setSyllabusMap((prev: any) => ({
        ...prev,
        [subjectCode]: [],
      }));
    }
  }



  function SyllabusAccordion({ syllabus }: any) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
  
    return (
      <div className="space-y-2">
  
        {syllabus?.map((unit: any, i: number) => (
          <div key={i} className="border rounded-lg overflow-hidden">
  
            {/* HEADER */}
            <button
              onClick={() =>
                setOpenIndex(openIndex === i ? null : i)
              }
              className="w-full flex justify-between items-center
                         px-4 py-3 text-left
                         bg-indigo-100 hover:bg-indigo-200"
            >
              <span className="font-semibold text-indigo-800">
                {unit.unit}
              </span>
  
              <span>{openIndex === i ? "−" : "+"}</span>
            </button>
  
            {/* BODY */}
            {openIndex === i && (
              <div className="px-5 py-3 bg-white">
  
                <ul className="space-y-2 text-sm text-slate-700">
                  {unit.topics.map((t: string, j: number) => (
                    <li key={j} className="flex gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
  
              </div>
            )}
  
          </div>
        ))}
  
      </div>
    );
  }


// To convert a link into drive link
  function getPreviewLink(url: string) {
    if (!url) return "";
  
    // 🔹 Google Drive link
    if (url.includes("drive.google.com")) {
      return url.replace("/view", "/preview");
    }
  
    // 🔹 Cloudinary or any external PDF
    return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;
  }


// To view g-drive link as preview & cloudnari as direct
function getPdfSourceType(url: string) {
  if (!url) return "unknown";

  if (url.includes("drive.google.com")) return "gdrive";
  if (url.includes("res.cloudinary.com")) return "cloudinary";

  return "other";
}




  /*--------------------UI-------------------------*/
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">

      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800">
          Download Previous Year Question Papers
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Access subject-wise question papers instantly.
        </p>
      </div>



      {/* INTRO */}
      <div className="text-sm text-slate-600 text-center max-w-2xl mx-auto">
        <p>
          Access previous year question papers for your selected branch and semester. 
          These papers help you understand exam patterns, important topics, and frequently asked questions.
        </p>
      </div>


<div className="flex justify-end mb-2">
<button
  onClick={() =>
    handleShare({
      title: "Download PYQs and syllabus - AlphaResult",
      text: "Download previous year questions papers and complete syllabus from AlphaResult",
    })
  }
      className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
>
<Share size={28} />
  Share
</button>
</div>

      {/* FILTER CARD  SELECT SEMETER AND BRANCH */  }
      <div className="bg-white rounded-2xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

        <select
          className="input w-full"
          value={semester}
        //   onChange={e => setSemester(e.target.value)}
        onChange={e => {
            const sem = e.target.value;
            localStorage.setItem("semester", sem);
            setSemester(sem);
          
            if (branch) {
              router.push(`/pyq/download/${branch}/sem-${sem}`);
            }
          }}
        >
          <option value="">Select Semester</option>
          {semesters.map((s: any) => (
            <option key={s.code} value={s.code}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          className="input w-full"
          value={branch}
        //   onChange={e => setBranch(e.target.value)}
        onChange={e => {
            const b = e.target.value;
            localStorage.setItem("branch", b);
            setBranch(b);
          
            if (semester) {
              router.push(`/pyq/download/${b}/sem-${semester}`);
            }
          }}
        >
          <option value="">Select Branch</option>
          {branches.map((b: any) => (
            <option key={b.code} value={b.code}>
              {b.short_name}({b.code})
            </option>
          ))}
        </select>
      </div>

      {/* SEMESTER BADGE */}
      {semester && branch && (
        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 rounded-full text-sm font-medium
                           bg-indigo-100 text-indigo-700">
            Semester {semester}
          </span>
          <span className="px-4 py-1.5 rounded-full text-sm font-medium
                           bg-slate-200 text-slate-700">
            Branch {branch}
          </span>
        </div>
      )}



      
<div className="space-y-6">

{/* 🔥 SINGLE POSTER */}
<div
  className="w-full max-w-3xl mx-auto cursor-pointer rounded-xl overflow-hidden shadow hover:scale-[1.02] transition"
>
  <Image
    src={posterSrc}
    alt={`BEU Semester ${semesterFromUrl} PYQ Download`}
    width={12000}
    height={600}
    className="w-full h-auto"
    priority
  />
</div>

{/* 👉 Your existing download table stays below */}

</div>



{/* HOW TO USE */}
<div className="bg-white rounded-xl shadow-sm p-4 text-sm text-slate-600">
  <h3 className="font-semibold text-slate-800 mb-2">
    How to Use These Papers
  </h3>
  <p>
    Select your branch and semester to view available subjects. 
    You can download question papers, view detailed solutions, or explore the syllabus for each subject to prepare effectively.
  </p>
</div>


{/* 🔥 SECTION HEADER */}
<div className="mb-6 text-center">
  <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
    Credits & Marks Overview
  </h2>

  <p className="text-sm text-slate-500 mt-1">
    Subject-wise credit distribution and maximum marks for your semester
  </p>

  {/* OPTIONAL DIVIDER */}
  <div className="mt-3 w-16 h-1 mx-auto bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full" />
</div>




{/* 📊 PREMIUM CREDIT TABLE */}
<div className="mt-12 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-md p-6">

  {AllSubjects.length === 0 ? (
    <p className="text-center text-sm text-slate-500">
      No subjects available
    </p>
  ) : (
    <>
      {/* 🔹 GROUP FUNCTION */}
   

<div className="mt-12 rounded-2xl bg-gradient-to-br from-[#0a1f44] via-[#0d2b63] to-[#081633] p-5 shadow-xl text-white">

  {/* HEADER */}
  <h2 className="text-lg font-semibold text-cyan-400 mb-5 text-center tracking-wide">
    Credits Table
  </h2>



  <div className="grid grid-cols-12 items-center py-2 border-b border-white/50 text-[11px] uppercase tracking-wide text-blue-200/70">

  <div className="col-span-2 font-semibold">
    Code
  </div>

  <div className="col-span-6">
    <div className="font-semibold">Name</div>
    <div className="text-[10px] text-blue-300/50">
      Full Name
    </div>
  </div>

  <div className="col-span-2 text-center font-semibold">
    Credit
  </div>

  <div className="col-span-2 text-center font-semibold">
    Total Marks
  </div>

</div>



  {/* THEORY */}
  <div >
    {AllSubjects.filter(s => s.subject_type === "Theory").map((s) => (
      <div
        key={s.code}
        className="grid grid-cols-12 items-center py-3 border-b border-white/5 hover:bg-white/5 transition"
      >
        <div className="col-span-2 text-[11px] text-blue-300 font-medium">
          {s.code}
        </div>

        <div className="col-span-6">
          <div className="text-sm text-white font-medium leading-tight">
            {s.short_name}
          </div>
          <div className="text-[11px] text-blue-200/70 truncate">
            {s.full_name}
          </div>
        </div>

        <div className="col-span-2 text-center">
          <span className="px-2 py-1 text-[11px] rounded-full bg-blue-500/10 text-blue-300 font-semibold">
            {s.subject_credit}
          </span>
        </div>

        <div className="col-span-2 text-center">
          <span className="px-2 py-1 text-[11px] rounded-full bg-cyan-400/10 text-cyan-300 font-semibold">
            {s.max_marks}
          </span>
        </div>
      </div>
    ))}
  </div>

  {/* PRACTICAL */}
  <div>
    {AllSubjects.filter(s => s.subject_type === "Practical").map((s) => (
      <div
        key={s.code}
        className="grid grid-cols-12 items-center py-3 border-b border-white/5 hover:bg-white/5 transition"
      >
        <div className="col-span-2 text-[10px] text-cyan-300 font-medium">
          {s.code}
        </div>

        <div className="col-span-6">
          <div className="text-sm text-white font-medium leading-tight">
            {s.short_name}
          </div>
          <div className="text-[11px] text-cyan-200/70 truncate">
            {s.full_name}
          </div>
        </div>

        <div className="col-span-2 text-center">
          <span className="px-2 py-1 text-[11px] rounded-full bg-blue-500/10 text-blue-300 font-semibold">
            {s.subject_credit}
          </span>
        </div>

        <div className="col-span-2 text-center">
          <span className="px-2 py-1 text-[11px] rounded-full bg-cyan-400/10 text-cyan-300 font-semibold">
            {s.max_marks}
          </span>
        </div>
      </div>
    ))}
  </div>

  {/* TOTAL */}
  <div className="flex justify-between mt-6 text-sm font-semibold border-t border-blue-400/20 pt-4">
    <span className="text-gray-300">TOTAL CREDIT</span>
    <span className="text-cyan-400">
      {AllSubjects.reduce(
        (sum, s) => sum + Number(s.subject_credit || 0),
        0
      )}
    </span>
  </div>

</div>


    </>
  )}

</div>




      {/* LOADING SKELETON */}
      {loadingSubjects && (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white p-5 rounded-xl shadow-sm flex justify-between"
            >
              <div className="space-y-2 w-1/2">
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                <div className="h-3 bg-slate-200 rounded w-1/3"></div>
              </div>
              <div className="h-8 w-24 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* SUBJECT LIST (CARD STYLE TABLE) */}
      {!loadingSubjects && subjects.length > 0 && (
        <div className="space-y-4">

          {subjects.map((s: any) => (
            <div
              key={s.code}
              className="space-y-2"
            >

            <div
                  className="bg-white rounded-xl shadow-sm p-5
                            hover:shadow-md transition
                            flex flex-col md:flex-row
                            md:items-center md:justify-between
                            gap-4"
                >

              {/* LEFT INFO */}
              <div>
                <h3 className="font-semibold text-slate-800">
                  {s.full_name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Subject Code: {s.code}
                </p>
              </div>





              {/* ----------------------ACTIONS----------------------- */}
              <div className="flex gap-3 flex-wrap">

                {/* {s.all_paper_pdf ? (
                  <a
                    href={s.all_paper_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg text-sm font-medium
                               bg-indigo-600 text-white
                               hover:bg-indigo-700 transition"
                  >
                    Download Question
                  </a>
                ) : (
                  <span className="px-4 py-2 rounded-lg text-sm
                                   bg-slate-100 text-slate-400">

                    Available Soon
                  </span>
                )} */}


                {/* SUBJECT LIST */}
                <button
                  onClick={() => handleViewPapers(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition
                    ${
                      activeSubjectCode === s.code
                        ? "bg-red-100 text-red-600"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                >
                  {activeSubjectCode === s.code ? "Hide Papers" : "View Questions Papers"}
                </button>


                {/* <button
  onClick={() => {
    window.open(
      getDownloadLink(papers[activePaperIndex]?.pdf),
      "_blank"
    );
  }}
  className="text-sm text-indigo-600"
>
  Download
</button> */}



                <Link
                  // href={`/pyq?subject=${s.code}`}
                  // branch && semester
                  //   ? `/pyq/${branch}/sem-${semester}/${s.code}`
                  //   : "/pyq"
                  href={`/pyq/${branch}/sem-${semester}/${s.code}`}
                  className="px-4 py-2 rounded-lg text-sm font-medium
                             bg-slate-200 text-slate-700
                             hover:bg-slate-300 transition"
                >
                  View Solution
                </Link>

                <button
                  onClick={() =>
                    openSyllabus === s.code
                      ? setOpenSyllabus(null)
                      : loadSyllabus(s.code)
                  }
                  className="px-4 py-2 rounded-lg text-sm font-medium
                            bg-indigo-100 text-indigo-700
                            hover:bg-indigo-200 transition"
                >
                  {openSyllabus === s.code ? "Hide Syllabus" : "View Syllabus"}
                </button>

              </div>


            


{/* Viewer of syylabus */}
                {/* SYLLABUS */}
                {openSyllabus === s.code && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mt-3">

                  {syllabusMap[s.code]?.length ? (

                    syllabusMap[s.code].map((unit: any, i: number) => (
                      <div key={i} className="mb-4">

                        {/* MODULE */}
                        <h4 className="font-semibold text-indigo-800">
                          {unit.unit}
                        </h4>

                        {/* TOPICS */}
                        <ul className="list-disc ml-6 mt-1 text-sm text-slate-700 space-y-1">
                          {unit.topics.map((t: string, j: number) => (
                            <li key={j}>{t}</li>
                          ))}
                        </ul>

                      </div>
                    ))

                  ) : (
                    <p className="text-sm text-slate-600">
                      Syllabus for this subject is currently not available. 
                      It will be added soon for better understanding of topics.
                    </p>
                    
                  )}

                </div>
              )}


                {/* ✅ SYLLABUS (OUTSIDE CARD, FULL WIDTH) */}
    {/* {openSyllabus === s.code && (
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">

        <SyllabusAccordion syllabus={syllabusMap[s.code]} />

      </div>
    )} */}


            </div>

       {/* View ALL PDF Quetions */}
        {/* 🔥 VIEW PAPERS (FULL WIDTH BELOW SUBJECT) */}

            {activeSubjectCode === s.code && (
              <div id={`subject-${s.code}`}   className="mt-4 bg-white border rounded-xl shadow-sm p-4 space-y-4">

                <h3 className="font-semibold text-slate-800">
                  Question Papers
                </h3>

                <div className="flex gap-2 flex-wrap mb-4">
 {/* ALL YEARS BUTTON */}
 {s.all_paper_pdf && (
    <button
      onClick={() => setActivePaperIndex(-1)}
      className={`px-3 py-1.5 rounded-md text-sm border transition
        ${
          activePaperIndex === -1
            ? "bg-indigo-600 text-white"
            : "bg-white text-slate-600 hover:bg-indigo-50"
        }`}
    >
      All Years
    </button>
  )}
  {papers.map((p, i) => (
    <button
      key={p.id}
      onClick={() => setActivePaperIndex(i)}
      className={`px-3 py-1.5 rounded-md text-sm border transition
        ${
          i === activePaperIndex
            ? "bg-indigo-600 text-white border-indigo-600"
            : "bg-white text-slate-600 hover:bg-indigo-50"
        }`}
    >
      {p.year}
    </button>
  ))}
</div>








                {loadingPapers ? (
                  <p className="text-sm text-slate-500">Loading papers...</p>
                ) : 
                // !papers || papers.length === 0 ? (
                  (!papers || papers.length === 0) && !s?.all_paper_pdf ? (
                    
                  <div className="text-center py-6">
                    <p className="text-sm text-slate-500">
                      No question papers available for this subject yet.
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Papers will be updated soon.
                    </p>
                  </div>
                  
                ) : 
                (
               

                  (activePaperIndex === -1 && s.all_paper_pdf
                    ? [{ id: "merged", pdf: s.all_paper_pdf, paper_pdf: s.all_paper_pdf, year: "All", name: "All Papers" }]
                    : papers
                  )
                  .filter((_, i) =>
                    activePaperIndex === -1 ? i === 0 : i === activePaperIndex
                  )
                  .map((p, i) => {

                    // (activePaperIndex === -1
                    //   ? [{ id: "merged", pdf: s.all_paper_pdf, year: "All", name: "All Papers" }]
                    //   : papers.filter((_, i) => i === activePaperIndex)
                    // ).map((p, i) => {
                    
                    
                    // const previewLink = p.pdf.replace("/view", "/preview");
                    const previewLink = getPreviewLink(p.pdf);
                    const type = getPdfSourceType(p.pdf);

                    return (
                  <div
                          key={p.id}
                          // key={`${p.pdf}`}
                          ref={(el) => {
                            if (el) viewerRefs.current[p.id] = el;
                          }}
                          className="border rounded-lg overflow-hidden relative"
                        >

                  {/* HEADER */}
                  <div className="px-3 py-2 bg-slate-50 flex justify-between text-sm items-center">

                        <span>{p.year} – {p.name}</span>
                        
                        {/* --------------------Dowload button for one paper ------------------ */}
                        <button
                          onClick={async () => {
                            try {

                              // g-drive download
                              if (type=='gdrive'){
                                  window.open(
                                    getDownloadLink(p?.pdf, `${p.name}_${p.year}`),
                                    "_blank"
                                  );
                                  return;
                                }
                            
                                // cloudnari download
                              const res = await fetch(getDownloadLink(p?.pdf, `${p.name}_${p.year}`));
                              const blob = await res.blob();

                              const url = window.URL.createObjectURL(blob);

                              const link = document.createElement("a");
                              link.href = url;
                              link.download = `alpha_result_${p.name}_${p.year}.pdf`;

                              document.body.appendChild(link);
                              link.click();

                              link.remove();
                              window.URL.revokeObjectURL(url);
                            } catch (err) {
                              console.error("Download failed", err);
                              alert("Download failed");
                            }
                          }}
                          className="text-sm text-indigo-600"
                        >
                          Download
                        </button>

                    <div className="flex items-center gap-2">

                      {/* FULLSCREEN BUTTON */}
                      <button
                        onClick={() => toggleFullscreen(p.id)}
                        className="text-xs bg-white border px-2 py-1 rounded hover:bg-slate-100"
                      >
                          <Maximize2 size={14} />
                          {/* ⛶ */}
                      </button>

                    </div>
                  </div>

                  {/* PDF */}
                  {/* <iframe
                    src={previewLink}
                    className="w-full h-[800px]"
                    loading="lazy"
                  /> */}


                                  {/* <iframe
                                  src={previewLink}
                                  className="w-full h-[800px] rounded"
                                  loading="lazy"
                                />

                                <PdfViewer url={p.pdf} /> */}

                
          
{/* To view the paper */}
                {type === "gdrive" ? (
  <iframe
    src={previewLink}
    className="w-full h-[800px] max-w-[1500px] rounded"
    loading="lazy"
  />
) : type === "cloudinary" ? (
  // <PdfViewer key={p.pdf} url={p.pdf} />
  <iframe
  key={p.pdf}
  // src={p.pdf}
  src={`https://docs.google.com/gview?url=${encodeURIComponent(p.pdf)}&embedded=true`}
  className="w-full h-[800px] rounded"
  loading="lazy"
/>
) : (
  <div  className="text-center p-4 border rounded">
    <p className="text-slate-400 text-sm">
      Preview not supported
    </p>
    <a
      href={p.paper_pdf}
      target="_blank"
      className="text-indigo-400 underline"
    >
      Open PDF
    </a>
  </div>
)}


                                    




                </div>
                    );
                  })
                )
                
                }





                

              </div>
            )}


    </div>

          
    ))}




        </div>
      )}

      {!loadingSubjects && semester && branch && subjects.length === 0 && (
        // <div className="text-slate-500">
        //     Available Soon
        //   {/* No theory subjects found. */}
        // </div>

        <div className="text-sm text-slate-600 text-center">
          Question papers for this selection are not available yet. 
          We are continuously updating our database, please check back soon.
        </div>
        
      )}



<div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
  <p className="text-sm text-indigo-700">
    Not sure how to use these papers?{" "}
    <a
      href="/help/using-pyq-effectively"
      className="underline font-medium text-indigo-900"
    >
      Learn how to use PYQs effectively
    </a>
  </p>
</div>
      


{/* NOTE */}
<div className="text-xs text-slate-500 text-center max-w-3xl mx-auto pt-6">
  <p>
    Note: These question papers are collected for educational purposes to help students prepare better. 
    Content may vary depending on university updates.
  </p>
</div>


    </div>
  );
}
