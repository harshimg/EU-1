"use client";

import AcademicSelector from "@/components/academic/AcademicSelector";
import { useAcademicSelection } from "@/lib/hooks/useAcademicSelection";
// console.log(useAcademicSelection);
export default function PYQRoot() {
  const state = useAcademicSelection("/pyq");

  return (
    <AcademicSelector
      {...state}
      title="Select Branch & Semester for PYQs"
    />
  );
}
