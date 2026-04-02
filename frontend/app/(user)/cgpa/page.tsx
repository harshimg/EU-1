"use client";

import AcademicSelector from "@/components/academic/AcademicSelector";
import { useAcademicSelection } from "@/lib/hooks/useAcademicSelection";
console.log(useAcademicSelection);
export default function CGPARoot() {
  const state = useAcademicSelection("/cgpa");

  return (
    <AcademicSelector
      {...state}
      title="Select Branch & Semester for CGPA"
    />
  );
}

