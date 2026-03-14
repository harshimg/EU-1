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

