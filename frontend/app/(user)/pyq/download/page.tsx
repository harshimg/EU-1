"use client";

import AcademicSelector from "@/components/academic/AcademicSelector";
import { useAcademicSelection } from "@/lib/hooks/useAcademicSelection";
console.log(useAcademicSelection);
export default function PYQDOWNLOADRoot() {
  const state = useAcademicSelection("/pyq/download");

  return (
    <AcademicSelector
      {...state}
      title="Download PYQs"
    />
  );
}