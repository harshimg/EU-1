"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { API_URL, apiGet, apiPost } from "@/lib/api";
import { useAuthModal } from "@/components/auth/AuthModal";



export default function PYQPage() {
  const { user, loading } = useAuth();
  const { showLogin  } = useAuthModal();


  const [subjects, setSubjects] = useState<any[]>([]);
  const [papers, setPapers] = useState<any[]>([]);
  const [paper, setPaper] = useState<any | null>(null);
  const QUESTION_LABEL = paper?.type === "NPTEL" ? "Week" : "Q";


  const [viewMode, setViewMode] = useState<"solution" | "all">("solution");


  const [activeSubject, setActiveSubject] = useState<any | null>(null);
  const [activePaper, setActivePaper] = useState<any | null>(null);
  const [activeQ, setActiveQ] = useState<{ q: any; sq?: any } | null>(null);

  /* Desktop panel sizes (CHANGE DEFAULTS HERE) */
  const [leftW, setLeftW] = useState(150);
  const [rightW, setRightW] = useState(100);

  /* Mobile drawers */
  const [showLeftMobile, setShowLeftMobile] = useState(false);
  const [showRightMobile, setShowRightMobile] = useState(false);

  const resizing = useRef<"left" | "right" | null>(null);

  const flatQuestions = (() => {
    if (!paper) return [];
  
    const list: { q: any; sq?: any }[] = [];
  
    paper.questions.forEach((q: any) => {
      if (q.sub_questions?.length) {
        q.sub_questions.forEach((sq: any) => {
          list.push({ q, sq });
        });
      } else {
        list.push({ q });
      }
    });
  
    return list;
  })();
  
  const currentIndex = activeQ
  ? flatQuestions.findIndex(item =>
      item.q.q_no === activeQ.q.q_no &&
      (item.sq?.sq_no ?? null) === (activeQ.sq?.sq_no ?? null)
    )
  : -1;


  function goPrev() {
    if (currentIndex > 0) {
      setActiveQ(flatQuestions[currentIndex - 1]);
    }
  }
  
  function goNext() {
    if (currentIndex < flatQuestions.length - 1) {
      setActiveQ(flatQuestions[currentIndex + 1]);
    }
  }
  
  


  useEffect(() => {
    if (!loading && !user) {
      showLogin();
    }
  }, [user, loading]);

  // {!user && !loading && (
  //   <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm">
  //     <div className="bg-white rounded-xl p-6 shadow-xl text-center">
  //       <p className="text-slate-700 mb-3">Please sign in to view PYQs</p>
  //       <button
  //         onClick={showLogin}
  //         className="btn-primary"
  //       >
  //         Sign In
  //       </button>
  //     </div>
  //   </div>
  // )}
  



  /* ---------------- FETCH SUBJECTS ---------------- */
  useEffect(() => {
    if (!user) return;

  //   fetch(
  //     `${API_URL}/user/subjects?semester_code=${user.semester}&branch_code=${user.branch}`,
  //     { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  //   )

    


  //     .then(res => res.json())
  //     .then(json => {
  //       setSubjects(json.data || []);
  //       if (json.data?.length) setActiveSubject(json.data[0]);
  //     });
  // }, [user]);



  apiGet(
    `/user/subjects?semester_code=${user.semester}&branch_code=${user.branch}`
  )
    .then(json => {
      setSubjects(json.data || []);
      if (json.data?.length) setActiveSubject(json.data[0]);
    })
    .catch(err => {
      console.error(err.message);
    });
}, [user]);


  /* ---------------- FETCH PAPERS ---------------- */
  // useEffect(() => {
  //   if (!activeSubject) return;

  //   fetch(
  //     `${API_URL}/user/papers?subject_code=${activeSubject.code}`,
  //     { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  //   )
  //     .then(res => res.json())
  //     .then(json => {
  //       setPapers(json.data || []);
  //       if (json.data?.length) setActivePaper(json.data[0]);
  //     });
  // }, [activeSubject]);

/* ---------------- FETCH PAPERS ---------------- */
useEffect(() => {
  if (!activeSubject) return;

  apiGet(`/user/papers?subject_code=${activeSubject.code}`)
    .then(json => {
      setPapers(json.data || []);
      if (json.data?.length) setActivePaper(json.data[0]);
    })
    .catch(err => console.error(err.message));
}, [activeSubject]);


  /* ---------------- FETCH PAPER ---------------- */
  // useEffect(() => {
  //   if (!activePaper) return;

  //   fetch(`${API_URL}/user/paper/${activePaper._id}`, {
  //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //   })
  //     .then(res => res.json())
  //     .then(json => {
  //       setPaper(json.data);
  //       const q = json.data?.questions?.[0];
  //       if (q) {
  //         setActiveQ(
  //           q.sub_questions?.length
  //             ? { q, sq: q.sub_questions[0] }
  //             : { q }
  //         );
  //       }
  //     });
  // }, [activePaper]);

  /* ---------------- FETCH PAPER ---------------- */
useEffect(() => {
  if (!activePaper) return;

  apiGet(`/user/paper/${activePaper._id}`)
    .then(json => {
      setPaper(json.data);

      const q = json.data?.questions?.[0];
      if (q) {
        setActiveQ(
          q.sub_questions?.length
            ? { q, sq: q.sub_questions[0] }
            : { q }
        );
      }
    })
    .catch(err => console.error(err.message));
}, [activePaper]);


  /* ---------------- DESKTOP RESIZE ---------------- */
  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (resizing.current === "left") {
        setLeftW(Math.min(300, Math.max(180, e.clientX)));
      }
      if (resizing.current === "right") {
        const newW = window.innerWidth - e.clientX;
        setRightW(Math.min(260, Math.max(180, newW)));
      }
    }
    function onUp() {
      resizing.current = null;
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);


  const current = activeQ?.sq ?? activeQ?.q;

  return (
    <div className="h-screen overflow-hidden bg-slate-100 flex flex-col md:flex-row">
      {!user && !loading && (
  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div className="bg-white rounded-xl p-6 shadow-xl text-center">
      <p className="text-slate-700 mb-3">Please sign in to view PYQs & Solution</p>
      <button
        onClick={showLogin}
        className="btn-primary"
      >
        Sign In
      </button>
    </div>
  </div>
)}


      {/* MOBILE TOP BAR */}
      <div className="md:hidden sticky top-0 z-30 flex justify-between items-center gap-3 px-3 py-3 
                      bg-gradient-to-r from-indigo-600 to-blue-600 border-b border-black/10 shadow-md">
        <button
          onClick={() => setShowLeftMobile(true)}
          className="flex-1 text-center py-2 rounded-lg text-sm font-medium 
                     bg-white/90 text-indigo-700 shadow"
        >
          Subjects / Papers
        </button>

        <button
          onClick={() => setShowRightMobile(true)}
          className="flex-1 text-center py-2 rounded-lg text-sm font-medium 
                     bg-white/90 text-blue-700 shadow"
        >
          Questions
        </button>
      </div>

      {/* LEFT PANEL (DESKTOP) */}
      <aside
        className="hidden md:block h-full overflow-y-auto border-r bg-white"
        style={{ width: leftW }}
      >
        <PanelLeft
          subjects={subjects}
          papers={papers}
          activeSubject={activeSubject}
          activePaper={activePaper}
          onSubject={setActiveSubject}
          onPaper={setActivePaper}
        />
      </aside>

      {/* LEFT RESIZER */}
      <div
        className="hidden md:block w-[4px] cursor-col-resize"
        onMouseDown={() => (resizing.current = "left")}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 min-h-0 h-full overflow-y-auto p-4 md:p-6">
        {paper && (
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold">{paper.name}</h2>
            <p className="text-slate-500 text-sm">
              {paper.subject_code} • {paper.type} • {paper.year}
            </p>
            <p className="text-slate-600 mt-1 text-sm">{paper.description}</p>
          </div>
        )}


  
{/* VIEW TOGGLE
<div className="flex justify-center mb-4">
  <div className="flex bg-slate-100 rounded-lg p-1">
    <button
      onClick={() => setViewMode("solution")}
      className={`px-4 py-1.5 rounded-md text-sm font-medium transition
        ${viewMode === "solution"
          ? "bg-white shadow text-indigo-600"
          : "text-slate-600 hover:text-slate-800"}`}
    >
      Solution
    </button>

    <button
      onClick={() => setViewMode("all")}
      className={`px-4 py-1.5 rounded-md text-sm font-medium transition
        ${viewMode === "all"
          ? "bg-white shadow text-indigo-600"
          : "text-slate-600 hover:text-slate-800"}`}
    >
      All Questions
    </button>

    {paper?.paper_pdf && (
  <a
    href={paper.paper_pdf}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block mt-3 px-4 py-2 rounded-lg text-sm font-medium
               bg-blue-600 text-white hover:bg-green-700"
  >
    Download PDF
  </a>
)}

  </div>
</div> */}


{/* VIEW TOGGLE + DOWNLOAD */}
<div className="flex items-center justify-between mb-4">

  {/* LEFT SPACER (keeps toggle centered) */}
  <div className="w-24" />

  {/* CENTER TOGGLE */}
  <div className="flex bg-slate-100 rounded-lg p-1">
    <button
      onClick={() => setViewMode("solution")}
      className={`px-4 py-1.5 rounded-md text-sm font-medium transition
        ${viewMode === "solution"
          ? "bg-white shadow text-indigo-600"
          : "text-slate-600 hover:text-slate-800"}`}
    >
      Solution
    </button>

    <button
      onClick={() => setViewMode("all")}
      className={`px-4 py-1.5 rounded-md text-sm font-medium transition
        ${viewMode === "all"
          ? "bg-white shadow text-indigo-600"
          : "text-slate-600 hover:text-slate-800"}`}
    >
      All Questions
    </button>
  </div>

  {/* RIGHT DOWNLOAD BUTTON */}
  {paper?.paper_pdf ? (
    <a
      href={paper.paper_pdf} // recommended backend route
      target="_blank"
      rel="noopener noreferrer"
      className="px-4 py-1.5 rounded-lg text-sm font-medium
                 bg-gradient-to-r from-indigo-600 to-blue-600
                 text-white shadow hover:opacity-90 transition"
    >
      Download PDF
    </a>
  ) : (
    <div className="w-24" />
  )}

</div>




        {viewMode === "solution" && current && (
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 space-y-6">

            {/* Next & and Previous button */}
            <div className="flex justify-between items-center pt-6 mt-6">
              <button
                onClick={goPrev}
                disabled={currentIndex <= 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                          bg-white text-slate-700 border border-slate-300
                          hover:bg-slate-100
                          disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              
              <button
                onClick={goNext}
                disabled={currentIndex >= flatQuestions.length - 1}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium
                          bg-indigo-600 text-white shadow-sm
                          hover:bg-indigo-700
                          disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>

            <h3 className="text-xl font-semibold">
              {QUESTION_LABEL}-{activeQ?.q.q_no}
              {activeQ?.sq && ` (${activeQ.sq.sq_no})`}

              {/* MAIN QUESTION HEADING (for multi) */}
            {activeQ?.q?.heading && (
            <div className="text-slate-700 font-medium bg-slate-50 border-l-4 border-slate-300 px-4 py-2 rounded">
                {activeQ.q.heading}
            </div>
            )}

            </h3>

            <p className="whitespace-pre-wrap">{current.question_md}</p>

            {/* ✅ OBJECTIVE OPTIONS */}
            {Array.isArray(current.options) && (
              <div className="space-y-2">
                {current.options.map((op: string, i: number) => {
                  const isCorrect = current.correct_index === i;
                  return (
                    <div
                      key={i}
                      className={`p-3 rounded border ${
                        isCorrect
                          ? "bg-green-50 border-green-400 text-green-800"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <strong>{String.fromCharCode(65 + i)}.</strong> {op}
                      {isCorrect && (
                        <span className="ml-2 text-xs font-semibold">
                          ✓ Correct
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* SOLUTION */}
            {current.solution_md && (
              <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded">
                <strong className="block mb-1">Solution</strong>
                {/* <div className="whitespace-pre-wrap"> */}
                <div className="mt-2 text-sm-400 whitespace-pre-wrap">
                {/* <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-200 
                px-4 py-3 text-emerald-900 text-sm leading-relaxed 
                whitespace-pre-wrap"> */}
                  {current.solution_md}
                </div>
              </div>
            )}

                  {/* Next & and Previous button */}
                  <div className="flex justify-between items-center pt-6 mt-6">
                    <button
                      onClick={goPrev}
                      disabled={currentIndex <= 0}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                                bg-white text-slate-700 border border-slate-300
                                hover:bg-slate-100
                                disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>

                    <button
                      onClick={goNext}
                      disabled={currentIndex >= flatQuestions.length - 1}
                      className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium
                                bg-indigo-600 text-white shadow-sm
                                hover:bg-indigo-700
                                disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
            
          </div>
        )}


{viewMode === "all" && paper && (
  <div className="bg-white rounded-xl shadow-md p-4 md:p-6
                  max-h-[70vh] overflow-y-auto space-y-4">

    <h3 className="text-lg font-semibold text-slate-700">
      All Questions
    </h3>

    {paper.questions.map((q: any) => (
      <div
        key={q.q_no}
        className="pb-4 bg-slate-50/50 rounded-lg px-3 space-y-2"
      >
        {/* MAIN QUESTION */}
        <button
          onClick={() => {
            if (q.sub_questions?.length) {
              setActiveQ({ q, sq: q.sub_questions[0] });
            } else {
              setActiveQ({ q });
            }
            setViewMode("solution");
          }}
          className="block w-full text-left font-medium text-slate-800
                     hover:text-indigo-600"
        >
          {QUESTION_LABEL}-{q.q_no}. {q.question_md}
        </button>

        {/* MAIN QUESTION OPTIONS (OBJECTIVE) */}
        {Array.isArray(q.options) && (
          <div className="ml-4 space-y-1 text-sm text-slate-600">
            {q.options.map((op: string, i: number) => (
              <div key={i}>
                {String.fromCharCode(65 + i)}. {op}
              </div>
            ))}
          </div>
        )}

        {/* SUB QUESTIONS */}
        {q.sub_questions?.map((sq: any) => (
          <div key={sq.sq_no} className="ml-4 space-y-1">
            <button
              onClick={() => {
                setActiveQ({ q, sq });
                setViewMode("solution");
              }}
              className="block w-full text-left mt-2
                         text-sm text-slate-700 hover:text-blue-600"
            >
              ({sq.sq_no}) {sq.question_md}
            </button>

            {/* SUB QUESTION OPTIONS (OBJECTIVE) */}
            {Array.isArray(sq.options) && (
              <div className="ml-4 space-y-1 text-xs text-slate-500">
                {sq.options.map((op: string, i: number) => (
                  <div key={i}>
                    {String.fromCharCode(65 + i)}. {op}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    ))}
  </div>
)}




      </main>

      {/* RIGHT RESIZER */}
      <div
        className="hidden md:block w-[4px] cursor-col-resize"
        onMouseDown={() => (resizing.current = "right")}
      />

      {/* RIGHT PANEL */}
      {paper && (
        <aside
          className="hidden md:block h-full overflow-y-auto border-l bg-white"
          style={{ width: rightW }}
        >
          <PanelRight paper={paper} activeQ={activeQ} onSelect={setActiveQ} />
        </aside>
      )}

      {/* MOBILE LEFT */}
      {showLeftMobile && (
        <MobileDrawer onClose={() => setShowLeftMobile(false)}>
          <PanelLeft
            subjects={subjects}
            papers={papers}
            activeSubject={activeSubject}
            activePaper={activePaper}
            onSubject={(s: any) => {
              setActiveSubject(s);
              setShowLeftMobile(false);
            }}
            onPaper={(p: any) => {
              setActivePaper(p);
              setShowLeftMobile(false);
            }}
          />
        </MobileDrawer>
      )}

      {/* MOBILE RIGHT */}
      {showRightMobile && paper && (
        <MobileDrawer onClose={() => setShowRightMobile(false)}>
          <PanelRight
            paper={paper}
            activeQ={activeQ}
            onSelect={(v: any) => {
              setActiveQ(v);
              setShowRightMobile(false);
            }}
          />
        </MobileDrawer>
      )}
    </div>



  );   //return
}

/* ---------------- MOBILE DRAWER ---------------- */
function MobileDrawer({ children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40">
      <div className="absolute inset-y-0 left-0 w-full bg-white p-4 overflow-y-auto">
        <button onClick={onClose} className="mb-4 text-sm text-slate-500">
          ← Back
        </button>
        {children}
      </div>
    </div>
  );
}

/* ---------------- LEFT PANEL ---------------- */
function PanelLeft({ subjects, papers, activeSubject, activePaper, onSubject, onPaper }: any) {
  return (
    <div className="p-4 space-y-4 text-sm">
      <h3 className="font-semibold">Subjects</h3>

      {subjects
  .filter((s: any) => s.subject_type === "Theory")
  .map((s: any) => {
    const isActive = activeSubject?.code === s.code;

    return (
      <div
        key={s._id}
        className={`flex items-center justify-between px-3 py-2 rounded
          ${isActive
            ? "bg-indigo-100"
            : "hover:bg-slate-100"
          }`}
      >
        {/* SUBJECT BUTTON */}
        <button
          onClick={() => onSubject(s)}
          className={`text-left font-medium
            ${isActive
              ? "text-indigo-700"
              : "text-slate-700"
            }`}
        >
          {s.short_name}
        </button>

        {/* SHOW Download PDF ONLY FOR ACTIVE SUBJECT */}
        {isActive && s?.all_paper_pdf && (
          <a
            href={s.all_paper_pdf}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs px-3 py-1 rounded-md
                       bg-indigo-600 text-white
                       hover:bg-indigo-700 transition"
          >
           Download PDF
          </a>
        )}
      </div>
    );
  })}

      <h3 className="font-semibold mt-4">Papers</h3>
      {papers.map((p: any) => (
        <button
          key={p._id}
          onClick={() => onPaper(p)}
          className={`block w-full text-left px-3 py-2 rounded ${
            activePaper?._id === p._id
              ? "bg-blue-100 text-blue-700"
              : "hover:bg-slate-100"
          }`}
        >
          {p.year} {p.name}
        </button>
      ))}
    </div>
  );
}

/* ---------------- RIGHT PANEL ---------------- */
function duplicatePanelRight({ paper, activeQ, onSelect }: any) {
  return (
    <div className="p-4 text-sm">
      <h3 className="font-semibold mb-3">Questions</h3>
      {paper.questions.map((q: any) => (
        <div key={q.q_no} className="mb-2">
          <button
            onClick={() => onSelect({ q })}
            className={`block w-full text-left px-2 py-1 rounded ${
              activeQ?.q.q_no === q.q_no && !activeQ?.sq
                ? "bg-indigo-100 text-indigo-700"
                : "hover:bg-slate-100"
            }`}
          >
            Q{q.q_no}
          </button>

          {q.sub_questions?.map((sq: any) => {
            const isActive =
              activeQ?.q.q_no === q.q_no &&
              activeQ?.sq?.sq_no === sq.sq_no;

            return (
              <button
                key={sq.sq_no}
                onClick={() => onSelect({ q, sq })}
                className={`block w-full text-left ml-4 px-2 py-1 rounded ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-slate-100 text-slate-600"
                }`}
              >
                ({sq.sq_no})
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}


/* ---------------- RIGHT PANEL ---------------- */
function PanelRight({ paper, activeQ, onSelect }: any) {
  return (
    <div className="p-4 text-sm">
      <h3 className="font-semibold mb-3">
        {paper?.type === "NPTEL" ? "Week" : "Questions"}
      </h3>

      {paper.questions.map((q: any) => {
        const isMainActive = activeQ?.q.q_no === q.q_no;

        return (
          <div key={q.q_no} className="mb-2">
            {/* MAIN QUESTION */}
            <button
              // onClick={() => onSelect({ q })}
              onClick={() => {
                if (q.sub_questions?.length) {
                  onSelect({ q, sq: q.sub_questions[0] });
                } else {
                  onSelect({ q });
                }
              }}
              className={`block w-full text-left px-2 py-1 rounded font-medium ${
                isMainActive && !activeQ?.sq
                  ? "bg-indigo-100 text-indigo-700"
                  : "hover:bg-slate-100"
              }`}
            >
              Q{q.q_no}
            </button>

            {/* SUB-QUESTIONS → ONLY FOR ACTIVE MAIN QUESTION */}
            {isMainActive &&
              q.sub_questions?.map((sq: any) => {
                const isSubActive =
                  activeQ?.q.q_no === q.q_no &&
                  activeQ?.sq?.sq_no === sq.sq_no;

                return (
                  <button
                    key={sq.sq_no}
                    onClick={() => onSelect({ q, sq })}
                    className={`block w-full text-left ml-4 px-2 py-1 rounded ${
                      isSubActive
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-slate-100 text-slate-600"
                    }`}
                  >
                    ({sq.sq_no})
                  </button>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}


