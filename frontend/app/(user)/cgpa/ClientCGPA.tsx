"use client";

import AcademicSelector from "@/components/academic/AcademicSelector";
import { useAcademicSelection } from "@/lib/hooks/useAcademicSelection";

export default function ClientCGPA() {
  const state = useAcademicSelection("/cgpa");

  return (
    <AcademicSelector
      {...state}
      title="Select Branch & Semester for CGPA"
    />
  );
}