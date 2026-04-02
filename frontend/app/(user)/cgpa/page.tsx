// "use client";

// import AcademicSelector from "@/components/academic/AcademicSelector";
// import { useAcademicSelection } from "@/lib/hooks/useAcademicSelection";

// export default function CGPARoot() {
//   const state = useAcademicSelection("/cgpa");

//   return (
//     <AcademicSelector
//       {...state}
//       title="Select Branch & Semester for CGPA"
//     />
//   );
// }




// ❌ NO "use client" here

import ClientCGPA from "./ClientCGPA";

export const metadata = {
  title: "BEU SGPA Calculator - AlphaResult",
  description:
    "Calculate your SGPA easily for BEU semester exams using AlphaResult’s free calculator.",
};

export default function CGPARoot() {
  return <ClientCGPA />;
}






