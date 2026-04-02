import { Suspense } from "react";
import PyqClient from "./PyqClient";

export const metadata = {
  title: "BEU Previous Year Questions (PYQ) - AlphaResult",
  description:
    "Access previous year question papers with solutions for BEU students by semester and branch.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <PyqClient />
    </Suspense>
  );
}

// "use client";

// import AcademicSelector from "@/components/academic/AcademicSelector";
// import { useAcademicSelection } from "@/lib/hooks/useAcademicSelection";

// export default function PYQRoot() {
//   const state = useAcademicSelection("/pyq");

//   return (
//     <AcademicSelector
//       {...state}
//       title="Select Branch & Semester for PYQs"
//     />
//   );
// }