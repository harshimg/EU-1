import { Suspense } from "react";
import PyqClient from "./PyqClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <PyqClient />
    </Suspense>
  );
}