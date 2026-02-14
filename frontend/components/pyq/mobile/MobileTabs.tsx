"use client";

interface Props {
  activeTab: "subjects" | "papers" | "questions";
  setActiveTab: (tab: "subjects" | "papers" | "questions") => void;
}

export default function MobileTabs({ activeTab, setActiveTab }: Props) {
  const tabs = [
    { key: "subjects", label: "Subjects" },
    { key: "papers", label: "Papers" },
    { key: "questions", label: "Questions" },
  ];

  return (
    <div className="md:hidden sticky top-0 z-30 bg-white border-b">
        
<div className="relative flex overflow-x-auto no-scrollbar border-b">

{tabs.map(tab => (
  <button
    key={tab.key}
    onClick={() => setActiveTab(tab.key as any)}
    className="relative flex-shrink-0 px-5 py-3 text-sm font-medium whitespace-nowrap"
  >
    <span
      className={
        activeTab === tab.key
          ? "text-indigo-600"
          : "text-slate-500"
      }
    >
      {tab.label}
    </span>

    {activeTab === tab.key && (
      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-600 transition-all duration-300" />
    )}
  </button>
))}

</div>




      {/* <div className="flex overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap
              ${
                activeTab === tab.key
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div> */}
    </div>
  );
}
