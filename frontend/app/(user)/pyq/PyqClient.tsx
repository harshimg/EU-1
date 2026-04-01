"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { SEMESTERS, BRANCHES } from "@/lib/constants/academic";

export default function PyqSelectorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  const [selectedSem, setSelectedSem] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  // Read from URL
  useEffect(() => {
    const sem = searchParams.get("sem");
    const branch = searchParams.get("branch");

    setSelectedSem(sem);
    setSelectedBranch(branch);
  }, [searchParams]);

  // Auto redirect if saved
  useEffect(() => {
    if (selectedSem && selectedBranch) {
      localStorage.setItem("semester", selectedSem);
      localStorage.setItem("branch", selectedBranch);

      router.replace(`/pyq/${selectedBranch}/sem-${selectedSem}`);
    }
  }, [selectedSem, selectedBranch]);

  // Load from localStorage (first time)
  useEffect(() => {
    const of_logged_in_savedSem = user?.semester;
    const of_logged_in_savedBranch = user?.branch;

    const savedSem = localStorage.getItem("user.semester") || of_logged_in_savedSem;
    const savedBranch = localStorage.getItem("user.branch") || of_logged_in_savedBranch;
    
    if (!searchParams.get("sem") && !searchParams.get("branch")) {
      if (savedSem && savedBranch) {
        router.replace(`/pyq/${savedBranch}/sem-${savedSem}`);
      }
    }
  }, []);

  // -------- HANDLERS --------

  const selectSemester = (sem: string) => {
    if (selectedBranch) {
      localStorage.setItem("semester", sem);
      router.push(`/pyq/${selectedBranch}/sem-${sem}`);
    } else {
      router.push(`/pyq?sem=${sem}`);
    }
  };

  const selectBranch = (branch: string) => {
    if (selectedSem) {
      localStorage.setItem("branch", branch);
      router.push(`/pyq/${branch}/sem-${selectedSem}`);
    } else {
      router.push(`/pyq?branch=${branch}`);
    }
  };

  // -------- UI --------

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      
      <h1 className="text-2xl font-bold text-center">
        Select Branch & Semester
      </h1>

      {/* CASE (i): Nothing selected */}
      {!selectedSem && !selectedBranch && (
        <>
          {/* SEMESTERS */}
          <div>
            <h2 className="font-semibold mb-3">Select Semester</h2>
            <div className="flex flex-wrap gap-3">
              {SEMESTERS.map((s) => (
                <button
                  key={s.code}
                  onClick={() => selectSemester(s.code)}
                  className="px-4 py-2 rounded-lg border hover:bg-indigo-50"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* BRANCHES */}
          <div>
            <h2 className="font-semibold mb-3">Select Branch</h2>
            <div className="flex flex-wrap gap-3">
              {BRANCHES.map((b) => (
                <button
                  key={b.code}
                  onClick={() => selectBranch(b.code)}
                  className="px-4 py-2 rounded-lg border hover:bg-indigo-50"
                >
                  {b.short_name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* CASE (ii): Only Semester */}
      {selectedSem && !selectedBranch && (
        <div>
          <h2 className="font-semibold mb-3">
            Select Branch (Semester {selectedSem})
          </h2>

          <div className="flex flex-wrap gap-3">
            {BRANCHES.map((b) => (
              <button
                key={b.code}
                onClick={() => selectBranch(b.code)}
                className="px-4 py-2 rounded-lg border hover:bg-indigo-50"
              >
                {b.short_name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CASE (iii): Only Branch */}
      {!selectedSem && selectedBranch && (
        <div>
          <h2 className="font-semibold mb-3">
            Select Semester ({selectedBranch.toUpperCase()})
          </h2>

          <div className="flex flex-wrap gap-3">
            {SEMESTERS.map((s) => (
              <button
                key={s.code}
                onClick={() => selectSemester(s.code)}
                className="px-4 py-2 rounded-lg border hover:bg-indigo-50"
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


