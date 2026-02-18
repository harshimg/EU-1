"use client";

import { useEffect, useRef } from "react";

interface Props {
  subjects: any[];
  activeSubject: any;
  onSelect: (s: any) => void;
}

export default function SubjectSelector({
  subjects,
  activeSubject,
  onSelect,
}: Props) {

const containerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const active = containerRef.current?.querySelector(".active-item");
  active?.scrollIntoView({
    behavior: "smooth",
    inline: "center",
    block: "nearest",
  });
}, [activeSubject]); // change dependency accordingly


  return (
    <div 
    ref={containerRef}
    className="md:hidden flex overflow-x-auto no-scrollbar gap-2 px-3 py-2 bg-slate-50"
    >
      {subjects
       .filter((s: any) => s.subject_type === "Theory")
      .map(s => (
        <button
          key={s.code}
          onClick={() => onSelect(s)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap
            ${
              activeSubject?.code === s.code
                ? "bg-indigo-600 text-white active-item"
                : "bg-white border text-slate-600"
            }`}
        >
          {s.short_name}
        </button>
      ))}
    </div>
  );
}
