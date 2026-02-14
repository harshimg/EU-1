"use client";

import { useEffect, useRef } from "react";

interface Props {
  papers: any[];
  activePaper: any;
  onSelect: (p: any) => void;
}

export default function PaperSelector({
  papers,
  activePaper,
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
}, [activePaper]); // change dependency accordingly


  return (
    <div 
    ref={containerRef}
    className="md:hidden flex overflow-x-auto no-scrollbar gap-2 px-3 py-2 bg-slate-50"
    >
      {papers.map(p => (
        <button
          key={p._id}
          onClick={() => onSelect(p)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap
            ${
              activePaper?._id === p._id
              ? "bg-indigo-600 text-white active-item"
              : "bg-white border text-slate-600"
            }`}
        >
          {p.year}
        </button>
      ))}
    </div>
  );
}
