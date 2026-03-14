"use client";

import { useState, useMemo } from "react";
import { FixedSizeList } from "react-window";

// import html2pdf from "html2pdf.js";

let html2pdf: any;

if (typeof window !== "undefined") {
  html2pdf = require("html2pdf.js");
}

// export default function BatchResultTable({ students, semester }: any) {
  export default function BatchResultTable({ students, semester, regNo }: any) {

  const [sortBy, setSortBy] = useState("cgpa");
  const [search, setSearch] = useState("");
  


  function romanToIndex(r: string) {
    const map:any = {
      I:1, II:2, III:3, IV:4, V:5, VI:6, VII:7, VIII:8
    };
    return map[r] || 1;
  }

  const semIndex = romanToIndex(semester);
  const subjectHeaders = students[0]?.subjects || [];

  const filtered = useMemo(()=>{
    return students.filter((s:any)=>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      String(s.reg).includes(search)
    );
  },[students,search]);


  const sorted = useMemo(()=>{

    const arr = [...filtered];

    arr.sort((a:any,b:any)=>{

      if(sortBy === "cgpa")
        return b.cgpa - a.cgpa;

      if(sortBy === "reg")
        return a.reg - b.reg;

      if(sortBy.startsWith("sgpa")){
        const idx = Number(sortBy.split("-")[1]);
        return (Number(b.sgpa[idx]) || 0) - (Number(a.sgpa[idx]) || 0);
      }

      return 0;
    });

    return arr;

  },[filtered,sortBy]);






  const Row = ({ index, style }: any) => {

    const s = sorted[index];
    const rank = index + 1;
    const isCurrentUser = s.reg == regNo

    return (

<div
style={style}
className={`grid grid-cols-[80px_140px_200px_repeat(${semIndex},80px)_80px_repeat(${subjectHeaders.length},90px)]
border-b text-sm items-center
${rank === 1 ? "bg-yellow-50" : ""}
${rank === 2 ? "bg-gray-100" : ""}
${rank === 3 ? "bg-orange-50" : ""}
`}
>

<div className="px-2 font-semibold">{rank}</div>

<div>{s.reg}</div>

<div className="truncate">{s.name}</div>

{Array.from({length:semIndex}).map((_,i)=>(
<div key={i} className="text-center">
{s.sgpa[i] || "-"}
</div>
))}

<div className="font-semibold text-center">{s.cgpa}</div>

{s.subjects.map((sub:any,i:number)=>(
<div key={i} className="text-center">
{sub.marks}
</div>
))}

</div>

    );
  };

  // To find average
  const sgpaAvg = Array.from({ length: semIndex }).map((_, i) => {

    const vals = students
      .map(s => Number(s.sgpa[i]))
      .filter(Boolean)
  
    if (!vals.length) return "-"
  
    return (
      vals.reduce((a,b)=>a+b,0) / vals.length
    ).toFixed(2)
  
  })

  const avgCGPA =
  students.reduce((sum, s) => sum + (s.cgpa || 0), 0) /
  students.length


  const subjectAvg = subjectHeaders.map((_,i)=>{

    const vals = students
      .map(s=>Number(s.subjects[i]?.marks))
      .filter(Boolean)
   
    if(!vals.length) return "-"
   
    return (
      vals.reduce((a,b)=>a+b,0) / vals.length
    ).toFixed(1)
   
   })





  const generatePDFLayout = () => {

    let html = `
    <div style="font-family: Arial; padding:20px;">
    <h2 style="margin-bottom:6px;">Batch Result — Semester ${semester}</h2>
    <p style="font-size:12px;margin-bottom:16px;">
    Students Found: ${sorted.length}
    </p>
    
    <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;width:100%;font-size:12px;">
    <tr>
    <th>Rank</th>
    <th>Reg</th>
    <th>Name</th>
    `
    
    for(let i=0;i<semIndex;i++){
    html += `<th>Sem ${i+1}</th>`
    }
    
    html += `<th>CGPA</th>`
    
    subjectHeaders.forEach((s:any)=>{
    html += `<th>${s.name}</th>`
    })
    
    html += `</tr>`

    sorted.forEach((s:any,index:number)=>{

        html += `<tr>
        <td>${index+1}</td>
        <td>${s.reg}</td>
        <td>${s.name}</td>
        `
        
        for(let i=0;i<semIndex;i++){
        html += `<td>${s.sgpa[i] || "-"}</td>`
        }
        
        html += `<td>${s.cgpa}</td>`
        
        s.subjects.forEach((sub:any)=>{
        html += `<td>${sub.marks}</td>`
        })
        
        html += `</tr>`
        
        })

        html += `<tr>
<td colspan="3"><b>Average</b></td>
`

sgpaAvg.forEach((v:any)=>{
html += `<td>${v}</td>`
})

html += `<td>${avgCGPA.toFixed(2)}</td>`

subjectAvg.forEach((v:any)=>{
html += `<td>${v}</td>`
})

html += `</tr>`

html += `
</table>

<p style="margin-top:20px;font-size:11px;color:#555;">
Generated from AlphaResult.in
</p>

</div>
`

return html
}






  const downloadBatchPDF = async () => {

    if (typeof window === "undefined") return;

    const html2pdf = (await import("html2pdf.js")).default
    
    const container = document.createElement("div")
    
    container.innerHTML = generatePDFLayout()
    
    const opt = {
      margin: 10,
      filename: `Batch_Result_Sem_${semester}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2, letterRendering: true },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "landscape" as const
      }
    };
    
    html2pdf().set(opt).from(container).save()
    
    }
  

  return (

<div className="mt-10">


{/* TOOLBAR */}
<div className="flex flex-wrap gap-4 mb-6">

<select
className="input w-56"
value={sortBy}
onChange={(e)=>setSortBy(e.target.value)}
>
<option value="cgpa">Sort by CGPA</option>
<option value="reg">Sort by Registration</option>

{Array.from({length:semIndex}).map((_,i)=>(
<option key={i} value={`sgpa-${i}`}>
Sort by Sem {i+1} SGPA
</option>
))}
</select>

<input
type="text"
placeholder="Search name / registration"
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="input w-72"
/>

</div>


{/* Download & print button */}
<div className="flex gap-3 mb-4">

  <button
    onClick={downloadBatchPDF}
    className="flex items-center gap-2 px-4 py-2 text-sm
    bg-green-600 text-white rounded-md hover:bg-green-700 transition"
    >
    ⬇ Download PDF
  </button>

  <button
    onClick={()=>window.print()}
    className="flex items-center gap-2 px-4 py-2 text-sm
    bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
    >
    🖨 Print
  </button>

</div>

{/* TABLE */}
{/* <div id="batch-result-print" className="overflow-x-auto border rounded-lg"> */}
<div id="batch-result-print" className="bg-white p-4">

  {/* HEADER */}
<div className="mb-4">
  <h2 className="text-xl font-semibold">
    Batch Result — Semester {semester}
  </h2>
  <p className="text-gray-600 text-sm">
    Students Found: {sorted.length}
  </p>
</div>

<table className="min-w-max text-sm">

<thead className="bg-gray-100 text-xs uppercase text-gray-700">

<tr>

<th className="px-3 py-2">Rank</th>
<th className="px-3 py-2">Reg</th>
<th className="px-3 py-2">Name</th>

{Array.from({length:semIndex}).map((_,i)=>(
<th key={i} className="px-3 py-2 text-center">
Sem {i+1}
</th>
))}

<th className="px-3 py-2 text-center">CGPA</th>

{subjectHeaders.map((s:any,i:number)=>(
<th
key={i}
title={s.name}
className="px-3 py-2 text-center max-w-[160px] truncate"
>
{s.name}
</th>
))}

</tr>

</thead>


<tbody>

{sorted.map((s:any,index:number)=>{

const rank = index + 1
const isCurrentUser = String(s.reg) === String(regNo)

return(

<tr
key={s.reg}
// className={`border-b hover:bg-blue-50
// ${rank===1?"bg-yellow-300":""}
// ${rank===2?"bg-yellow-200":""}
// ${rank===3?"bg-yellow-100":""}
// `}
className={`border-b hover:bg-blue-50
  ${rank===1?"bg-yellow-300":""}
  ${rank===2?"bg-yellow-200":""}
  ${rank===3?"bg-yellow-100":""}
  ${isCurrentUser ? "bg-blue-100 ring-2 ring-blue-400 font-semibold" : ""}
  ${isCurrentUser ? "bg-blue-100 border-l-4 border-blue-600 font-semibold" : ""}
  `}


>

{/* <td className="px-3 py-2 font-semibold text-center">{rank}</td> */}
<td className="px-3 py-2 font-semibold text-center">

{isCurrentUser ? "⭐ " : ""}
{rank}

</td>

<td className="px-3 py-2">{s.reg}</td>

{/* <td className="px-3 py-2 whitespace-nowrap">{s.name}</td> */}
<td className="px-3 py-2 whitespace-nowrap flex items-center gap-2">

{s.name}

{isCurrentUser && (
<span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
You
</span>
)}

</td>

{Array.from({length:semIndex}).map((_,i)=>(
<td key={i} className="px-3 py-2 text-center">
{s.sgpa[i] || "-"}
</td>
))}

<td className="px-3 py-2 font-semibold text-center">
{s.cgpa}
</td>

{s.subjects.map((sub:any,i:number)=>(
<td key={i} className="px-3 py-2 text-center">
{sub.marks}
</td>
))}

</tr>

)

})}

{/* Average */}
<tr className="bg-yellow-50 font-semibold border-t">

<td colSpan={3}>Average</td>

{sgpaAvg.map((v:any,i:number)=>(
<td key={i} className="text-center">{v}</td>
))}

<td className="text-center">{avgCGPA.toFixed(2)}</td>

{subjectAvg.map((v:any,i:number)=>(
<td key={i} className="text-center">{v}</td>
))}

</tr>


</tbody>



</table>

</div>

</div>

  );
}
