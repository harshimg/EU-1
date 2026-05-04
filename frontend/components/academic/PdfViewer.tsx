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


// "use client";

// import { useEffect, useRef, useState } from "react";
// import * as pdfjsLib from "pdfjs-dist";

// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// export default function PdfViewer({ url }: { url: string }) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [pdf, setPdf] = useState<any>(null);

//   // Load PDF
//   useEffect(() => {
//     const loadPdf = async () => {
//       const loadingTask = pdfjsLib.getDocument(url);
//       const pdfDoc = await loadingTask.promise;
//       setPdf(pdfDoc);
//     };

//     loadPdf();
//   }, [url]);

//   // Render ALL pages
//   useEffect(() => {
//     const renderPages = async () => {
//       if (!pdf || !containerRef.current) return;

//       const container = containerRef.current;
//       container.innerHTML = ""; // clear previous

//       for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i);
        

//         // const viewport = page.getViewport({ scale: 0.68 });
//         const containerWidth =
//   containerRef.current?.clientWidth || window.innerWidth;

// const viewport = page.getViewport({ scale: 1 });

// const scale = containerWidth / viewport.width;

// const scaledViewport = page.getViewport({ scale });


//         const canvas = document.createElement("canvas");
//         const context = canvas.getContext("2d");

//         // canvas.height = viewport.height;
//         // canvas.width = viewport.width;

//         canvas.className = "mb-4 mx-auto rounded shadow";

//         container.appendChild(canvas);

//         canvas.height = scaledViewport.height;
//         canvas.width = scaledViewport.width;

//             await page.render({
//             canvasContext: context!,
//             viewport: scaledViewport,
//             }).promise;


            
//       }
//     };

//     renderPages();
//   }, [pdf]);

//   return (
//     <div className="w-full h-[80vh] overflow-y-auto bg-black p-4 rounded">
//       <div ref={containerRef} className="flex flex-col items-center" />
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
  const [loading, setLoading] = useState(true);

  const [zoom, setZoom] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const renderIdRef = useRef(0);

  // 📥 Load PDF
  useEffect(() => {
    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url,
          withCredentials: false,
        });

        const pdfDoc = await loadingTask.promise;
        setPdf(pdfDoc);
        setLoading(false);
      } catch (err) {
        console.error("PDF load error:", err);
        setLoading(false);
      }
    };

    loadPdf();
  }, [url]);

  // 🎨 Render pages (HIGH QUALITY + RESPONSIVE)
  // useEffect(() => {
  //   const renderPages = async () => {
  //     if (!pdf || !containerRef.current) return;

  //     const container = containerRef.current;
  //     container.innerHTML = "";

  //   //   const containerWidth =container.clientWidth || window.innerWidth;
    
  //       const containerWidth =
  //           Math.min(
  //               containerRef.current?.clientWidth || window.innerWidth,
  //               800 // 🔥 max width for desktop
  //           );

  //     // ⚡ render only first few pages initially (faster load)
  //     const pagesToRender = Math.min(pdf.numPages, 3);

  //     for (let i = 1; i <= pagesToRender; i++) {
  //       const page = await pdf.getPage(i);

  //       const viewport = page.getViewport({ scale: 1 });

  //       const scale = containerWidth / viewport.width;

  //       // 🔥 HIGH QUALITY FIX
  //       const devicePixelRatio = window.devicePixelRatio || 1;
  //       const renderScale = scale * devicePixelRatio * 1.5;

  //       const scaledViewport = page.getViewport({ scale: renderScale });

  //       const canvas = document.createElement("canvas");
  //       const context = canvas.getContext("2d");

  //       // 🧠 internal resolution
  //       canvas.height = scaledViewport.height;
  //       canvas.width = scaledViewport.width;

  //       // 🖥 display size (important)
  //       canvas.style.width = `${containerWidth}px`;
  //       canvas.style.height = `${
  //         (scaledViewport.height / renderScale) * scale
  //       }px`;

  //       canvas.className = "mb-4 mx-auto rounded shadow";

  //       container.appendChild(canvas);

  //       await page.render({
  //         canvasContext: context!,
  //         viewport: scaledViewport,
  //       }).promise;
  //     }
  //   };

  //   renderPages();
  // }, [pdf]);

  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    const currentRenderId = ++renderIdRef.current;
  
    const renderPages = async () => {
      if (!pdf || !containerRef.current) return;
  
      const container = containerRef.current;


          // 🔥 cancel previous render
    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch {}
    }

  
      // 🔥 CLEAR OLD CONTENT
      container.innerHTML = "";
  
      const containerWidth =
        Math.min(
          containerRef.current?.clientWidth || window.innerWidth,
          800
        );
  
      const pagesToRender = Math.min(pdf.numPages, 10);
  
      for (let i = 1; i <= pagesToRender; i++) {
        
        // ❌ STOP if new render started
        if (currentRenderId !== renderIdRef.current) return;
  
        const page = await pdf.getPage(i);
  
        const viewport = page.getViewport({ scale: 1 });
        const scale = containerWidth / viewport.width;
  
        const devicePixelRatio = window.devicePixelRatio || 1;
        const renderScale = scale * devicePixelRatio * 1.5;
  
        const scaledViewport = page.getViewport({ scale: renderScale });
  
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
  
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;
  
        canvas.style.width = `${containerWidth}px`;
        canvas.style.height = `${
          (scaledViewport.height / renderScale) * scale
        }px`;
  
        canvas.className = "mb-4 mx-auto rounded shadow";
  
        container.appendChild(canvas);
  
        // await page.render({
        //   canvasContext: context!,
        //   viewport: scaledViewport,
        // }).promise;

        const renderTask = page.render({
          canvasContext: context!,
          viewport: scaledViewport,
        });
        
        // 🔥 store current render task
        renderTaskRef.current = renderTask;
        
        try {
          await renderTask.promise;
        } catch (err) {
          // 🔥 ignore cancelled render errors
        }

      }
    };
  
    renderPages();
  }, [pdf]);

// PINCH ZOOM
useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
  
    let pointers: any[] = [];
    let prevDistance = 0;
  
    const getDistance = (p1: any, p2: any) => {
      const dx = p1.clientX - p2.clientX;
      const dy = p1.clientY - p2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };
  
    const onPointerDown = (e: PointerEvent) => {
      pointers.push(e);
    };
  
    const onPointerMove = (e: PointerEvent) => {
      pointers = pointers.map(p => (p.pointerId === e.pointerId ? e : p));
  
      if (pointers.length === 2) {
        const distance = getDistance(pointers[0], pointers[1]);
        e.preventDefault(); // 🔥 only prevent during pinch
  
        if (prevDistance) {
          const delta = distance - prevDistance;
  
          setZoom(z => {
            const next = z + delta * 0.005;
            return Math.min(Math.max(next, 1), 3);
          });
        }
  
        prevDistance = distance;
      }
    };
  
    const onPointerUp = (e: PointerEvent) => {
      pointers = pointers.filter(p => p.pointerId !== e.pointerId);
      prevDistance = 0;
    };
  
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("pointerleave", onPointerUp);
  
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("pointerleave", onPointerUp);
    };
  }, []);

  return (
    // <div className="w-full h-[80vh] overflow-y-auto bg-black p-3 rounded">
      
    //   {/* 🔄 Loader */}
    //   {loading && (
    //     <div className="h-[300px] flex items-center justify-center text-slate-400">
    //       Loading PDF...
    //     </div>
    //   )}

    //   <div ref={containerRef} className="flex flex-col items-center" />
    // </div>


    <div ref={wrapperRef}
    // style={{ touchAction: "none" }}
    style={{ touchAction: "pan-y" }} // ✅ allows vertical scroll
    className="w-full h-[80vh] overflow-y-auto bg-black rounded">

  {/* 🔥 Sticky Toolbar */}
  {/* <div className="sticky top-0 z-10 bg-[#0B0F1A] border-b px-3 py-2 flex justify-between items-center"> */}
    
    {/* <span className="text-xs text-slate-400">
      Pinch or use buttons to zoom
    </span> */}

{/* <div className="flex items-center gap-3 justify-center"> */}

  {/* Zoom Out */}
  {/* <button
    onClick={() => setZoom(z => Math.max(z - 0.2, 1))}
    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
  >
    −
  </button> */}

  {/* Zoom % Indicator */}
  {/* <span className="text-xs text-slate-300 min-w-[50px] text-center">
    {Math.round(zoom * 100)}%
  </span> */}

  {/* Zoom In */}
  {/* <button
    onClick={() => setZoom(z => Math.min(z + 0.2, 3))}
    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
  >
    +
  </button> */}

  {/* Reset Zoom */}
  {/* <button
    onClick={() => setZoom(1)}
    className="px-2 py-1 text-xs text-indigo-400"
  >
    Reset
  </button> */}

{/* </div> */}


    
  {/* </div> */}

  {/* 🔥 ZOOM WRAPPER */}
  <div
    className="p-3 flex justify-center"
    style={{
      transform: `scale(${zoom})`,
      transformOrigin: "top center",
    }}
  >
    <div ref={containerRef} className="flex flex-col items-center" />
  </div>
</div>
  );
}