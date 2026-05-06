"use client";

import { useEffect, useState } from "react";
import { Fragment } from "react";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { API_URL } from "@/lib/api";
import ReactSelect from "react-select";



/* =====================================================
   TYPES
===================================================== */

type TabType = "semester" | "branch" | "subject";

interface Semester {
  code: string;
  name: string;
}

interface Branch {
  code: string;
  short_name: string;
  full_name: string;
}


interface SyllabusUnit {
  unit: string;
  topics: string[];
}

interface Subject {
  code: string;
  short_name: string;
  full_name: string;
  semester_code: string;
  branch_code: string;
  subject_type: string;
  subject_credit: number;
  max_marks: number;
  all_paper_pdf: string;

  syllabus?: SyllabusUnit[]; // ✅ NEW
}

/* =====================================================
   PAGE
===================================================== */

export default function AdminStructurePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("semester");

  // 🔐 Guard
  useEffect(() => {
    if (!loading && (!user || (user.role !== "admin" && user.role !== "superalpha"))) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) return <Loader />;
  if (!user || (user.role !== "admin" && user.role !== "superalpha")) return null;

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200">
    {/* //  <div className="min-h-screen bg-[#0B0F1A] text-slate-200 -mx-8"> */}


      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* <main className="w-full px-8 py-8 space-y-8"> */}

        <Tabs active={activeTab} setActive={setActiveTab} />

        <div className="bg-[#11172C] border border-white/10 rounded-xl p-6">
          {activeTab === "semester" && <SemesterSection />}
          {activeTab === "branch" && <BranchSection />}
          {activeTab === "subject" && <SubjectSection />}
        </div>
      </main>
    </div>
  );
}

/* =====================================================
   SEMESTER
===================================================== */

function SemesterSection() {
  const [list, setList] = useState<Semester[]>([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Semester | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    // const res = await fetch(`${API_URL}/admin/ssb/semester`, authHeader());
    // setList(await res.json());
    const res = await fetch(`${API_URL}/admin/ssb/semester`, authHeader());
    const json = await res.json();
    setList(json.data || []);

  }

  // async function remove(code: string) {
  //   const backup = list;
  //   setList(list.filter(s => s.code !== code));

  //   try {
  //     await fetch(`${API_URL}/admin/ssb/semester/${code}`, {
  //       method: "DELETE",
  //       ...authHeader(),
  //     });
  //   } catch {
  //     setList(backup);
  //   }
  // }
  async function remove(code?: string) {
    if (!code) return; // 🚫 prevent blank delete

    if (!confirm("Delete this semester?")) return;
  
    const backup = list;
    setList(list.filter(s => s.code !== code));
  
    try {
      await fetch(`${API_URL}/admin/ssb/semester/${code}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch {
      setList(backup);
    }
  }

  return (
    <SectionLayout title="Semesters" onAdd={() => { setEdit(null); setOpen(true); }}>
      <Table headers={["Code", "Name", "Actions"]}>
        {list.map(s => (
          <tr key={s.code}>
            <Td>{s.code}</Td>
            <Td>{s.name}</Td>
            <Td>
              <ActionBtn onClick={() => { setEdit(s); setOpen(true); }}>Edit</ActionBtn>
              <ActionBtn danger onClick={() => remove(s.code)}>Delete</ActionBtn>
            </Td>
          </tr>
        ))}
      </Table>

      {open && (
        <SemesterModal
          data={edit}
          onClose={() => setOpen(false)}
          onSaved={fetchData}
        />
      )}
    </SectionLayout>
  );
}

/* =====================================================
   BRANCH
===================================================== */

function BranchSection() {
  const [list, setList] = useState<Branch[]>([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Branch | null>(null);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const res = await fetch(`${API_URL}/admin/ssb/branch`, authHeader());
    // setList(await res.json());
    const json = await res.json();
    setList(Array.isArray(json.data) ? json.data : []);

  }

  async function remove(code: string) {
    if (!code) return; // 🚫 prevent blank delete
    if (!confirm("Delete this branch?")) return;

    const backup = list;
    setList(list.filter(b => b.code !== code));

    try {
      await fetch(`${API_URL}/admin/ssb/branch/${code}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch {
      setList(backup);
    }
  }

  return (
    <SectionLayout title="Branches" onAdd={() => { setEdit(null); setOpen(true); }}>
      <Table headers={["Code", "Short", "Full Name", "Actions"]}>
        {list.map(b => (
          <tr key={b.code}>
            <Td>{b.code}</Td>
            <Td>{b.short_name}</Td>
            <Td>{b.full_name}</Td>
            <Td>
              <ActionBtn onClick={() => { setEdit(b); setOpen(true); }}>Edit</ActionBtn>
              <ActionBtn danger onClick={() => remove(b.code)}>Delete</ActionBtn>
            </Td>
          </tr>
        ))}
      </Table>

      {open && (
        <BranchModal
          data={edit}
          onClose={() => setOpen(false)}
          onSaved={fetchData}
        />
      )}
    </SectionLayout>
  );
}

/* =====================================================
   SUBJECT
===================================================== */

function SubjectSection() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  const [filterSem, setFilterSem] = useState("");
  const [filterBranch, setFilterBranch] = useState("");

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Subject | null>(null);

  // Syllabus
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const [loadingSubject, setLoadingSubject] = useState<string | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});

  useEffect(() => {
    loadBase();
  }, []);

  async function loadBase() {
    const [s, b] = await Promise.all([
      fetch(`${API_URL}/admin/ssb/semester`, authHeader()).then(r => r.json()),
      fetch(`${API_URL}/admin/ssb/branch`, authHeader()).then(r => r.json()),
    ]);
    // setSemesters(s);
    // setBranches(b);
    setSemesters(Array.isArray(s.data) ? s.data : []);
    setBranches(Array.isArray(b.data) ? b.data : []);
    fetchSubjects();
  }

  async function fetchSubjects() {
    const q = new URLSearchParams();
    if (filterSem) q.append("semester", filterSem);
    if (filterBranch) q.append("branch", filterBranch);

    const res = await fetch(`${API_URL}/admin/ssb/subject?${q}`, authHeader());
    // setSubjects(await res.json());
    const json = await res.json();
    setSubjects(Array.isArray(json.data) ? json.data : []);

  }

  useEffect(() => {
    fetchSubjects();
  }, [filterSem, filterBranch]);

  async function remove(code: string) {

    if (!confirm("Delete this subject?")) return;
    
    const backup = subjects;
    setSubjects(subjects.filter(s => s.code !== code));

    try {
      await fetch(`${API_URL}/admin/ssb/subject/${code}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch {
      setSubjects(backup);
    }
  }


  // To merge all papers of a subject
  const handleMerge = async (subjectCode: string) => {
    try {
      setLoadingSubject(subjectCode);
      setStatusMap(prev => ({
        ...prev,
        [subjectCode]: "Merging..."
      }));
  
      const res = await fetch(`${API_URL}/admin/merge-subject-pdfs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ subject_code: subjectCode }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.detail || "Merge failed");
      }
  
      // ✅ SUCCESS MESSAGE
      setStatusMap(prev => ({
        ...prev,
        [subjectCode]: `✔ ${data.total_papers} papers merged (${data.papers.map(p => p.year).join(", ")} years)`
      }));
  
      // 🔥 UPDATE ONLY THIS SUBJECT (NO RELOAD)
      setSubjects(prev =>
        prev.map(s =>
          s.code === subjectCode
            ? { ...s, all_paper_pdf: data.url }
            : s
        )
      );
  
    } catch (err: any) {
      setStatusMap(prev => ({
        ...prev,
        [subjectCode]: `Error: ${err.message}`
      }));
    } finally {
      setLoadingSubject(null);
    }
  };




  return (
    <SectionLayout title="Subjects" onAdd={() => { setEdit(null); setOpen(true); }}>
      <div className="flex gap-4 mb-4">
        <Select value={filterSem} onChange={setFilterSem} options={semesters} />
        <Select value={filterBranch} onChange={setFilterBranch} options={branches} />
      </div>

      <Table headers={["Code", "Short", "Full Name", "Semester", "Branch", "Type", "Credit", "max_marks", "Papers ", "Actions"]}>
        {subjects.map(s => (
          <Fragment  key={s.code}>
            <tr>
            <Td>{s.code}</Td>
            <Td>{s.short_name}</Td>
            <Td>{s.full_name}</Td>
            <Td>{s.semester_code}</Td>
            {/* <Td>{s.branch_code}</Td> */}
            <Td>
  <div className="flex flex-wrap gap-1">
    {Array.isArray(s.branch_code)
      ? s.branch_code.map((b: string) => (
          <span
            key={b}
            className="px-2 py-0.5 text-xs rounded bg-slate-200 text-slate-700"
          >
            {b}
          </span>
        ))
      : (
        <span className="px-2 py-0.5 text-xs rounded bg-slate-200 text-slate-700">
          {s.branch_code}
        </span>
      )}
  </div>
</Td>
            <Td>{s.subject_type}</Td>
            <Td>{s.subject_credit}</Td>
            <Td>{s.max_marks}</Td>
            {/* <Td>{s.all_paper_pdf || "Na"}</Td> */}

                <Td>
        <div className="flex flex-col items-start gap-1">

          <div className="flex items-center gap-3">
            
            {/* VIEW */}
            {s.all_paper_pdf ? (
              <a
                href={s.all_paper_pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500 hover:underline text-sm"
              >
                View
              </a>
            ) : (
              <span className="text-gray-400 text-xs">NA</span>
            )}

            {/* MERGE */}
            <button
              onClick={() => handleMerge(s.code)}
              disabled={loadingSubject === s.code}
              className={`text-xs px-2 py-1 rounded-md border transition
                ${
                  loadingSubject === s.code
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                }`}
            >
              {loadingSubject === s.code ? "Merging..." : "Merge"}
            </button>
          </div>

          {/* ✅ INLINE MESSAGE */}
          {statusMap[s.code] && (
            <span
              className={`text-xs ${
                statusMap[s.code].startsWith("Error")
                  ? "text-red-500"
                  : "text-green-600"
              }`}
            >
              {statusMap[s.code]}
            </span>
          )}

        </div>
      </Td>
        

            <Td>
              <ActionBtn onClick={() => { setEdit(s); setOpen(true); }}>Edit</ActionBtn>
              <ActionBtn danger onClick={() => remove(s.code)}>Delete</ActionBtn>
              <ActionBtn
                            onClick={() => {
                              setSelectedSubject(prev =>
                                prev?.code === s.code ? null : s
                              );
                            }}
                          >
                            {selectedSubject?.code === s.code ? "Close" : "Syllabus"}
                          </ActionBtn>
          </Td>
          </tr>
            {selectedSubject?.code === s.code && (
          <tr>
            
            <td colSpan={10}>
              <InlineSyllabusEditor
                subject={s}
                onSaved={() => {
                  fetchSubjects();
                  setSelectedSubject(null); // CLOSE AFTER SAVE
                }}
              />
            </td>

          </tr>
        )}
          </Fragment >
        ))}
      </Table>

      {open && (
        <SubjectModal
          data={edit}
          semesters={semesters}
          branches={branches}
          onClose={() => setOpen(false)}
          onSaved={fetchSubjects}
        />
      )}

        

    </SectionLayout>
  );
}

/* =====================================================
   HELPERS / UI
===================================================== */

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A]">
    Loading...
  </div>
);

const Header = () => (
  <header className="border-b border-white/10 bg-[#0F1629]">
    {/* <div className=" mx-auto px-6 py-4"> */}
    <div className="w-full px-8 py-4">

      <h1 className="text-xl font-bold text-white">Academic Structure without access</h1>
      <p className="text-xs text-slate-400">Semester • Branch • Subject</p>
    </div>
  </header>
);

function Tabs({ active, setActive }: any) {
  return (
    <div className="flex gap-3">
      {["semester", "branch", "subject"].map(t => (
        <button
          key={t}
          onClick={() => setActive(t)}
          className={`px-4 py-2 rounded-md text-sm ${
            active === t
              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
              : "border border-white/10 text-slate-400"
          }`}
        >
          {t.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

const SectionLayout = ({ title, onAdd, children }: any) => (
  <div className="space-y-6">
    <div className="flex justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      <button onClick={onAdd} className="btn-primary">Add</button>
    </div>
    {children}
  </div>
);

const Table = ({ headers, children }: any) => (
  <div className="overflow-x-auto border border-white/10 rounded-lg">
    <table className="w-full text-sm">
      <thead className="bg-[#0F1629]">
        <tr>{headers.map((h: string) => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

const Td = ({ children }: any) => (
  <td className="px-4 py-3 border-t border-white/5">{children}</td>
);

const ActionBtn = ({ children, danger, ...p }: any) => (
  <button
    {...p}
    className={`mr-2 text-xs ${danger ? "text-red-400" : "text-indigo-400"}`}
  >
    {children}
  </button>
);

const Select = ({ options, value, onChange }: any) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    className="bg-[#0F1629] border border-white/10 px-4 py-2 rounded"
  >
    <option value="">All</option>
    {/* {options.map((o: any) => ( */}
      {Array.isArray(options) && options.map(o => (
      <option key={o.code} value={o.code}>{o.code}</option>
    ))}
  </select>
);

/* =====================================================
   MODALS (simple, clean)
===================================================== */

// SemesterModal, BranchModal, SubjectModal
// 👉 For brevity, they follow same pattern:

function Modal({ children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#0F1629] w-[420px] rounded-xl border border-white/10 p-6">
        {children}
        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="text-sm text-slate-400 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


//SemesterModal
function SemesterModal({ data, onClose, onSaved }: any) {
  const [code, setCode] = useState(data?.code || "");
  const [name, setName] = useState(data?.name || "");

  async function submit() {
    const method = data ? "PUT" : "POST";
    const url = data
      ? `${API_URL}/admin/ssb/semester/${data.code}`
      : `${API_URL}/admin/ssb/semester`;

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ code, name }),
    });

    onSaved();
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="text-lg font-semibold mb-4 text-white">
        {data ? "Edit Semester" : "Add Semester"}
      </h3>

      <input
        className="input mb-3"
        placeholder="Code"
        value={code}
        disabled={!!data}
        onChange={e => setCode(e.target.value)}
      />

      <input
        className="input"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <button  disabled={!code || !name}
          onClick={submit} className="btn-primary w-full mt-4 disabled:opacity-40">
        Save
      </button>
    </Modal>
  );
}



//🟣 BranchModal
function BranchModal({ data, onClose, onSaved }: any) {
  const [code, setCode] = useState(data?.code || "");
  const [shortName, setShortName] = useState(data?.short_name || "");
  const [fullName, setFullName] = useState(data?.full_name || "");

  async function submit() {
    const method = data ? "PUT" : "POST";
    const url = data
      ? `${API_URL}/admin/ssb/branch/${data.code}`
      : `${API_URL}/admin/ssb/branch`;

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        code,
        short_name: shortName,
        full_name: fullName,
      }),
    });

    onSaved();
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="text-lg font-semibold mb-4 text-white">
        {data ? "Edit Branch" : "Add Branch"}
      </h3>

      <input
        className="input mb-3"
        placeholder="Code"
        value={code}
        disabled={!!data}
        onChange={e => setCode(e.target.value)}
      />

      <input
        className="input mb-3"
        placeholder="Short Name"
        value={shortName}
        onChange={e => setShortName(e.target.value)}
      />

      <input
        className="input"
        placeholder="Full Name"
        value={fullName}
        onChange={e => setFullName(e.target.value)}
      />

      <button  disabled={!code || !shortName || !fullName}
          onClick={submit} className="btn-primary w-full mt-4 disabled:opacity-40">
        Save
      </button>
    </Modal>
  );
}



// //🟣 SubjectModal

function SubjectModal({ data, semesters, branches, onClose, onSaved }: any) {
  const [code, setCode] = useState(data?.code || "");
  const [shortName, setShortName] = useState(data?.short_name || "");
  const [fullName, setFullName] = useState(data?.full_name || "");
  const [semester, setSemester] = useState(data?.semester_code || "");

  const [branchCodes, setBranchCodes] = useState<string[]>(
    Array.isArray(data?.branch_code) ? data.branch_code : data?.branch_code ? [data.branch_code] : []
  );

  const [subject_type, setsubject_type] = useState(data?.subject_type || "");
  const [subject_credit, setsubject_credit] = useState(data?.subject_credit || "");
  const [max_marks, setmax_marks] = useState(data?.max_marks || "");
  const [all_paper_pdf, setall_paper_pdf] = useState(data?.all_paper_pdf || "")


  const branchOptions = branches.map((b: any) => ({
    value: b.code,
    label: `${b.code} – ${b.short_name}`,
  }));
  

  async function submit() {
    if (
      !code ||
      !shortName ||
      !fullName ||
      !semester ||
      branchCodes.length === 0 ||
      !subject_type ||
      !max_marks
    ) {
      alert("All fields are required");
      return;
    }

    const method = data ? "PUT" : "POST";
    const url = data
      ? `${API_URL}/admin/ssb/subject/${data.code}`
      : `${API_URL}/admin/ssb/subject`;

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        code,
        short_name: shortName,
        full_name: fullName,
        semester_code: semester,
        branch_code: branchCodes, 
        subject_type,
        subject_credit,
        max_marks,
        all_paper_pdf,
      }),
    });

    onSaved();
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <div className="max-h-[85vh] overflow-y-auto pr-1">
      <h3 className="text-lg font-semibold mb-4 text-white">
        {data ? "Edit Subject" : "Add Subject"}
      </h3>

      <input className="input mb-3" placeholder="Code"
        value={code} disabled={!!data}
        onChange={e => setCode(e.target.value)}
      />

      <input className="input mb-3" placeholder="Short Name"
        value={shortName}
        onChange={e => setShortName(e.target.value)}
      />

      <input className="input mb-3" placeholder="Full Name"
        value={fullName}
        onChange={e => setFullName(e.target.value)}
      />

      
       {/* 🔥 MULTI BRANCH SELECT */}
       <div className="mb-3">
          <label className="block text-sm text-gray-300 mb-1">
            Branch(es)
          </label>

          <ReactSelect
            isMulti
            options={branchOptions}
            value={branchOptions.filter(opt =>
              branchCodes.includes(opt.value)
            )}
            onChange={(selected: any) =>
              setBranchCodes(selected.map((s: any) => s.value))
            }
            placeholder="Select or search one or more branches"
            className="text-black"
            classNamePrefix="react-select"
          />
        </div>

      <div className="grid grid-cols-2 gap-3">
        <select className="input" value={semester}
          onChange={e => setSemester(e.target.value)}>
          <option value="">Select Semester</option>
          {semesters.map((s: any) => (
            <option key={s.code} value={s.code}>{s.code}</option>
          ))}
        </select>

        <select className="input" value={subject_type}
          onChange={e => setsubject_type(e.target.value)}>
          <option value="">Subject type</option>
          <option>Theory</option>
          <option>Practical</option>
        </select>
      </div>



      <div className="grid grid-cols-2 gap-3">
        <select className="input" value={max_marks}
          onChange={e => setmax_marks(e.target.value)}>
          <option value="">Max Marks</option>
          <option>100</option>
          <option>50</option>
        </select>

        <input className="input" placeholder="Subject Credit"
        type="number"
        value={subject_credit}
        onChange={e => setsubject_credit(e.target.value)}
        />
      </div>

      <div>
        <input className="input" placeholder="All paper pdf link"
        type="string" value={all_paper_pdf}
        onChange={e => setall_paper_pdf(e.target.value)} />
      </div>

      <button
        onClick={submit}
        className="btn-primary w-full mt-4"
      >
        Save
      </button>
    </div>
  </Modal>
  );
}




function InlineSyllabusEditor({ subject, onSaved }: any) {

  const [units, setUnits] = useState<SyllabusUnit[]>(
    subject?.syllabus?.length
      ? subject.syllabus
      : [{ unit: "", topics: [""] }]
  );

  function addUnit() {
    setUnits([...units, { unit: "", topics: [""] }]);
  }

  function removeUnit(index: number) {
    setUnits(units.filter((_, i) => i !== index));
  }

  function updateUnit(index: number, value: string) {
    const updated = [...units];
    updated[index].unit = value;
    setUnits(updated);
  }

  function updateTopic(uIndex: number, tIndex: number, value: string) {
    const updated = [...units];
    updated[uIndex].topics[tIndex] = value;
    setUnits(updated);
  }

  function addTopic(uIndex: number) {
    const updated = [...units];
    updated[uIndex].topics.push("");
    setUnits(updated);
  }

  function removeTopic(uIndex: number, tIndex: number) {
    const updated = [...units];
    updated[uIndex].topics =
      updated[uIndex].topics.filter((_, i) => i !== tIndex);
    setUnits(updated);
  }

  async function submit() {
    await fetch(`${API_URL}/admin/ssb/subject/${subject.code}/syllabus`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ syllabus: units }),
    });

    onSaved();
    alert("Syllabus saved");
  }

  return (
    <div className="bg-[#0F1629] border border-indigo-500/20 rounded-lg p-4 space-y-4">

      <h4 className="text-indigo-300 font-semibold">
        Syllabus — {subject.short_name}
      </h4>

      {units.map((u, ui) => (
  <div
    key={ui}
    className="border border-white/10 p-4 rounded-lg bg-[#0B1225]"
  >

    {/* MODULE HEADER */}
    <div className="flex items-center gap-2 mb-3">

      <span className="text-xs text-indigo-400 font-semibold">
        MODULE {ui + 1}
      </span>

      <input
        className="flex-1 bg-transparent border-b border-indigo-500/40 
                   text-lg font-semibold text-white px-2 py-1 
                   focus:outline-none focus:border-indigo-400"
        placeholder="Module Name"
        value={u.unit}
        onChange={(e) => updateUnit(ui, e.target.value)}
      />

      <button
        onClick={() => removeUnit(ui)}
        className="text-red-400 text-sm hover:text-red-300"
      >
        ✕
      </button>

    </div>

    {/* TOPICS */}
    <div className="pl-6 space-y-2">

      {u.topics.map((t, ti) => (
        <div key={ti} className="flex gap-2 items-start">

          {/* bullet */}
          <span className="mt-2 text-gray-400">•</span>

          <textarea
            className="flex-1 bg-[#11172C] border border-white/10 rounded 
                       px-3 py-2 text-sm text-white 
                       focus:outline-none focus:border-indigo-400
                       resize-none"
            rows={2}
            placeholder="Topic"
            value={t}
            onChange={(e) =>
              updateTopic(ui, ti, e.target.value)
            }
          />

          <button
            onClick={() => removeTopic(ui, ti)}
            className="text-red-400 text-xs mt-2"
          >
            ✕
          </button>

        </div>
      ))}

      <button
        onClick={() => addTopic(ui)}
        className="text-indigo-400 text-xs hover:text-indigo-300"
      >
        + Add Topic
      </button>

    </div>

  </div>
))}

      <div className="flex justify-between">
        <button
          onClick={addUnit}
          className="text-indigo-400 text-sm"
        >
          + Add Module
        </button>

        <button
          onClick={submit}
          className="btn-primary"
        >
          Save
        </button>
      </div>

    </div>
  );
}