"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ResultPageClient from "./ResultPageClient";

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading result...</div>}>
      <ResultPageClient />
    </Suspense>
  );
}