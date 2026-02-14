"use client";

import { useEffect, useRef } from "react";

interface Props {
  paper: any;
  activeQ: any;
  onSelect: (value: any) => void;
}

export default function QuestionSelector({
  paper,
  activeQ,
  onSelect,
}: Props) {
  if (!paper) return null;

  const mainRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);

  /* ---------- Auto-center main question ---------- */
  useEffect(() => {
    const active = mainRef.current?.querySelector(".active-main");
    active?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeQ?.q?.q_no]);

  /* ---------- Auto-center sub question ---------- */
  useEffect(() => {
    const active = subRef.current?.querySelector(".active-sub");
    active?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeQ?.sq?.sq_no]);

  return (
    <div className="md:hidden bg-slate-50 border-t border-slate-200">

      {/* ================= MAIN QUESTIONS ================= */}
      <div
        ref={mainRef}
        className="flex overflow-x-auto no-scrollbar gap-2 px-3 py-3"
      >
        {paper.questions.map((q: any) => {
          const isActive = activeQ?.q?.q_no === q.q_no;

          return (
            <button
              key={q.q_no}
              onClick={() => {
                if (q.sub_questions?.length) {
                  onSelect({ q, sq: q.sub_questions[0] });
                } else {
                  onSelect({ q });
                }
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm active-main"
                    : "bg-white border text-slate-600 hover:bg-slate-100"
                }`}
            >
              Q{q.q_no}
            </button>
          );
        })}
      </div>

      {/* ================= SUB QUESTIONS ================= */}
      {activeQ?.q?.sub_questions?.length > 0 && (
        <div
          ref={subRef}
          className="flex overflow-x-auto no-scrollbar gap-2 px-6 pb-3"
        >
          {activeQ.q.sub_questions.map((sq: any) => {
            const isActive = activeQ?.sq?.sq_no === sq.sq_no;

            return (
              <button
                key={sq.sq_no}
                onClick={() => onSelect({ q: activeQ.q, sq })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm active-sub"
                      : "bg-white border text-slate-600 hover:bg-slate-100"
                  }`}
              >
                ({sq.sq_no})
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
