"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAcademicSelection(basePath: string) {
  const router = useRouter();

  const [semester, setSemester] = useState<string | null>(null);
  const [branch, setBranch] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    const savedSem = localStorage.getItem("semester");
    const savedBranch = localStorage.getItem("branch");

    // 1️⃣ localStorage
    if (savedSem && savedBranch) {
      router.replace(`${basePath}/${savedBranch}/sem-${savedSem}`);
      return;
    }

    // 2️⃣ user fallback
    const userStr = localStorage.getItem("user");

    if (userStr) {
      try {
        const user = JSON.parse(userStr);

        if (user?.semester && user?.branch) {
          localStorage.setItem("semester", user.semester);
          localStorage.setItem("branch", user.branch);

          router.replace(`${basePath}/${user.branch}/sem-${user.semester}`);
          return;
        }
      } catch {}
    }

    setChecked(true);
  }, [basePath, router]);

  /* ---------------- SELECT ---------------- */

  const selectSemester = (sem: string) => {
    setSemester(sem);
    localStorage.setItem("semester", sem);

    if (branch) {
      router.push(`${basePath}/${branch}/sem-${sem}`);
    }
  };

  const selectBranch = (b: string) => {
    setBranch(b);
    localStorage.setItem("branch", b);

    if (semester) {
      router.push(`${basePath}/${b}/sem-${semester}`);
    }
  };

  return {
    semester,
    branch,
    checked,
    selectSemester,
    selectBranch,
  };
}