// "use client";

// import { Document, Page } from "react-pdf";
// import { pdfjs } from "react-pdf";
// import { useState } from "react";

// // pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
// pdfjs.GlobalWorkerOptions.workerSrc =
//   `/pdf.worker.min.js`;

// export default function PdfViewer({ url }: { url: string }) {
//   const [numPages, setNumPages] = useState<number>(0);
//   const [pageNumber, setPageNumber] = useState(1);

//   function onLoadSuccess({ numPages }: { numPages: number }) {
//     setNumPages(numPages);
//   }

//   return (
//     <div className="flex flex-col items-center gap-3">

//       {/* CONTROLS */}
//       <div className="flex gap-3 items-center">
//         <button
//           onClick={() => setPageNumber(p => Math.max(p - 1, 1))}
//           className="px-2 py-1 bg-gray-700 rounded"
//         >
//           Prev
//         </button>

//         <span className="text-sm">
//           Page {pageNumber} / {numPages}
//         </span>

//         <button
//           onClick={() => setPageNumber(p => Math.min(p + 1, numPages))}
//           className="px-2 py-1 bg-gray-700 rounded"
//         >
//           Next
//         </button>
//       </div>

//       {/* PDF */}
//       <Document file={url} onLoadSuccess={onLoadSuccess}>
//         <Page pageNumber={pageNumber} width={600} />
//       </Document>
//     </div>
//   );
// }

// "use client";

// import { Document, Page, pdfjs } from "react-pdf";
// import { useState } from "react";

// pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

// export default function PdfViewer({ url }: { url: string }) {
//   const [numPages, setNumPages] = useState<number>(0);

//   return (
//     <div className="flex flex-col items-center gap-4">

//       <Document
//         file={url}
//         onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//         loading={<p>Loading PDF...</p>}
//         error={<p>Failed to load PDF</p>}
//       >
//         {Array.from(new Array(numPages), (_, i) => (
//           <Page
//             key={i}
//             pageNumber={i + 1}
//             width={600}
//           />
//         ))}
//       </Document>

//     </div>
//   );
// }


// "use client";

// import { useEffect, useRef, useState } from "react";
// import * as pdfjsLib from "pdfjs-dist";

// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// export default function PdfViewer({ url }: { url: string }) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [pdf, setPdf] = useState<any>(null);
//   const [pageNum, setPageNum] = useState(1);
//   const [numPages, setNumPages] = useState(0);

//   // Load PDF
//   useEffect(() => {
//     const loadPdf = async () => {
//       const loadingTask = pdfjsLib.getDocument(url);
//       const pdfDoc = await loadingTask.promise;
//       setPdf(pdfDoc);
//       setNumPages(pdfDoc.numPages);
//     };

//     loadPdf();
//   }, [url]);

//   // Render Page
//   useEffect(() => {
//     const renderPage = async () => {
//       if (!pdf) return;

//       const page = await pdf.getPage(pageNum);
//       const viewport = page.getViewport({ scale: 0.8 });

//       const canvas = canvasRef.current;
//       if (!canvas) return;

//       const context = canvas.getContext("2d");
//       canvas.height = viewport.height;
//       canvas.width = viewport.width;

//       await page.render({
//         canvasContext: context!,
//         viewport,
//       }).promise;
//     };

//     renderPage();
//   }, [pdf, pageNum]);

//   return (
//     <div className="flex flex-col items-center gap-3">

//       {/* Controls */}
//       <div className="flex gap-3 items-center">
//         <button
//           onClick={() => setPageNum(p => Math.max(p - 1, 1))}
//           className="px-3 py-1 bg-gray-700 rounded"
//         >
//           Prev
//         </button>

//         <span className="text-sm">
//           Page {pageNum} / {numPages}
//         </span>

//         <button
//           onClick={() => setPageNum(p => Math.min(p + 1, numPages))}
//           className="px-3 py-1 bg-gray-700 rounded"
//         >
//           Next
//         </button>
//       </div>

//       {/* Canvas */}
//       <canvas ref={canvasRef} className="border rounded" />
//     </div>
//   );
// }


"use client";

import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

export default function PdfViewer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdf, setPdf] = useState<any>(null);

  // Load PDF
  useEffect(() => {
    const loadPdf = async () => {
      const loadingTask = pdfjsLib.getDocument(url);
      const pdfDoc = await loadingTask.promise;
      setPdf(pdfDoc);
    };

    loadPdf();
  }, [url]);

  // Render ALL pages
  useEffect(() => {
    const renderPages = async () => {
      if (!pdf || !containerRef.current) return;

      const container = containerRef.current;
      container.innerHTML = ""; // clear previous

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);

        const viewport = page.getViewport({ scale: 0.68 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        canvas.className = "mb-4 mx-auto rounded shadow";

        container.appendChild(canvas);

        await page.render({
          canvasContext: context!,
          viewport,
        }).promise;
      }
    };

    renderPages();
  }, [pdf]);

  return (
    <div className="w-full h-[80vh] overflow-y-auto bg-black p-4 rounded">
      <div ref={containerRef} className="flex flex-col items-center" />
    </div>
  );
}