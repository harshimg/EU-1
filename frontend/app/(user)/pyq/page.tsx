// import { Suspense } from "react";
// import PyqClient from "./PyqClient";

// export default function Page() {
//   return (
//     <Suspense fallback={<div className="p-6">Loading...</div>}>
//       <PyqClient />
//     </Suspense>
//   );
// }

"use client";

import AcademicSelector from "@/components/academic/AcademicSelector";
import { useAcademicSelection } from "@/lib/hooks/useAcademicSelection";

export default function PYQRoot() {
  const state = useAcademicSelection("/pyq");

  return (
    <AcademicSelector
      {...state}
      title="Select Branch & Semester for PYQs"
    />
  );
}