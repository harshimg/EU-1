"use client";

import { useState, useMemo } from "react";
import { FixedSizeList } from "react-window";

export default function BatchResultTable({ students, semester }: any) {

  const [sortBy, setSortBy] = useState("cgpa");
  const [search, setSearch] = useState("");

  function romanToIndex(r: string) {
    const map:any = {
      I:1, II:2, III:3, IV:4, V:5, VI:6, VII:7, VIII:8
    };
    return map[r] || 1;
  }

  const semIndex = romanToIndex(semester);

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


  const subjectHeaders = students[0]?.subjects || [];



  const Row = ({ index, style }: any) => {

    const s = sorted[index];
    const rank = index + 1;

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


  return (

<div className="mt-10">

{/* HEADER */}
<div className="mb-4">
  <h2 className="text-xl font-semibold">
    Batch Result — Semester {semester}
  </h2>
  <p className="text-gray-600 text-sm">
    Students Found: {sorted.length}
  </p>
</div>

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


{/* TABLE */}
<div className="overflow-x-auto border rounded-lg">

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

return(

<tr
key={s.reg}
className={`border-b hover:bg-blue-50
${rank===1?"bg-yellow-50":""}
${rank===2?"bg-gray-100":""}
${rank===3?"bg-orange-50":""}
`}
>

<td className="px-3 py-2 font-semibold text-center">{rank}</td>

<td className="px-3 py-2">{s.reg}</td>

<td className="px-3 py-2 whitespace-nowrap">{s.name}</td>

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

</tbody>

</table>

</div>

</div>

  );
}