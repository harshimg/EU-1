"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { API_URL } from "@/lib/api";

/* ================= TYPES ================= */

interface Semester {
  code: string;
  name: string;
}

interface Branch {
  code: string;
  short_name: string;
  full_name: string;
}

interface Subject {
  code: string;
  short_name: string;
  full_name: string;
}

interface Paper {
  _id: string;
  name: string;
  type: string;
  year: number;
  description?: string;
  paper_pdf?: string;
}

/* ================= PAGE ================= */

export default function AdminPapersPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);

  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [subject, setSubject] = useState("");

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Paper | null>(null);

  const [fileMap, setFileMap] = useState<{ [key: string]: File | null }>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [examTypeMap, setExamTypeMap] = useState<{ [key: string]: string }>({});

  const [previewMap, setPreviewMap] = useState<{ [key: string]: string }>({});


    // 🔐 HARD GUARD (client-side)
    useEffect(() => {
      if (!loading && (!user || (user.role !== "admin" && user.role !== "superalpha"))) {
        router.replace("/");
      }
    }, [user, loading, router]);

    


  /* ---------- Load Semester & Branch ---------- */
  useEffect(() => {
    loadBase();
  }, []);

  async function loadBase() {
    const [s, b] = await Promise.all([
      fetch(`${API_URL}/admin/ssb/semester`, auth()).then(r => r.json()),
      fetch(`${API_URL}/admin/ssb/branch`, auth()).then(r => r.json()),
    ]);

    setSemesters(s.data || []);
    setBranches(b.data || []);
  }

  /* ---------- Load Subjects ---------- */
  useEffect(() => {
    if (!semester || !branch) {
      setSubjects([]);
      setSubject("");
      return;
    }

    fetch(
      `${API_URL}/admin/ssb/subject?semester=${semester}&branch=${branch}`,
      auth()
    )
      .then(r => r.json())
      .then(j => setSubjects(j.data || []));
  }, [semester, branch]);

  /* ---------- Load Papers ---------- */
  useEffect(() => {
    if (!subject) {
      setPapers([]);
      return;
    }
    fetchPapers();
  }, [subject]);

  async function fetchPapers() {
    const res = await fetch(
      `${API_URL}/admin/papers/${subject}`,
      auth()
    );
    const json = await res.json();
    setPapers(json.data || []);
  }

  async function remove(id: string) {
    if (!id) return;

    await fetch(`${API_URL}/admin/papers/${id}`, {
      method: "DELETE",
      headers: auth().headers,
    });

    fetchPapers();
  }


  async function uploadFileForPaper(p: Paper) {
    const file = fileMap[p._id];
  
    if (!file) {
      alert("Select file first");
      return;
    }
  
    const exam_type = `${p.type}_${examTypeMap[p._id] || 'regular'}`;
  
    setUploadingId(p._id);
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("paper_id", p._id);
    formData.append("branch", branch);
    formData.append("sem", semester);
    formData.append("subject", subject);
    formData.append("year", String(p.year));
    formData.append("exam_type", exam_type);
  
    try {
      const res = await fetch(`${API_URL}/admin/upload-pdf`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
  
      const json = await res.json();
  
      if (json.success) {
        // await fetch(`${API_URL}/admin/papers/${p._id}`, {
        //   method: "PUT",
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${localStorage.getItem("token")}`,
        //   },
        //   body: JSON.stringify({
        //     paper_pdf: json.data.secure_url,
        //     type: exam_type,
        //   }),
        // });


        // ✅ clear file + preview
      setFileMap(prev => ({ ...prev, [p._id]: null }));
      setPreviewMap(prev => ({ ...prev, [p._id]: "" }));

      // ✅ success message
      alert("✅ Uploaded successfully");
  
        fetchPapers();
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload error");
    }
  
    setUploadingId(null);
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200 px-8 py-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-xl font-bold">Papers Management</h1>
        <p className="text-xs text-slate-400">
          Semester → Branch → Subject → Papers
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <Select label="Semester" value={semester} options={semesters} onChange={setSemester} />
        <Select label="Branch" value={branch} options={branches} onChange={setBranch} />
        <Select label="Subject" value={subject} options={subjects} onChange={setSubject} />

        <button
          disabled={!subject}
          onClick={() => { setEdit(null); setOpen(true); }}
          className="btn-primary h-[38px] mt-[18px] disabled:opacity-40"
        >
          Add Paper
        </button>
      </div>

      {/* TABLE */}
      <div className="border border-white/10 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#0F1629]">
            <tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Year</Th>
              <Th>Description</Th>
              <Th>Pdf</Th>
              <Th>Upload</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {papers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-slate-500">
                  No papers found
                </td>
              </tr>
            )}

            {papers.map(p => (
              <tr key={p._id} className="border-t border-white/5">
                <Td
                  className="text-indigo-400 cursor-pointer"
                  onClick={() => router.push(`/admin/papers/${p._id}`)}
                >
                  {p.name}
                </Td>
                <Td>{p.type}</Td>
                <Td>{p.year}</Td>
                <Td>{p.description || "-"}</Td>
                {/* <Td>{p.paper_pdf || "Na"}</Td> */}
                <Td>
                {p.paper_pdf? 
                  <button
                    onClick={() => window.open(p.paper_pdf  + ".pdf", "_blank")}
                    className="text-indigo-400 cursor-pointer"
                  >
                   View
                  </button>
                  :
                "Na"}
                </Td>





                    <Td>
                          <div className="bg-[#0F1629] border border-white/10 rounded-lg p-3 space-y-3">

                            {/* 🔹 TOP ROW */}
                            <div className="flex items-center gap-2">

                              {/* TYPE SELECT */}
                              <select
                                onChange={(e) =>
                                  setExamTypeMap(prev => ({
                                    ...prev,
                                    [p._id]: e.target.value
                                  }))
                                }
                                className="bg-[#0B0F1A] border border-white/10 px-2 py-1 rounded text-xs"
                              >
                                <option value="regular">Regular</option>
                                <option value="special">Special</option>
                              </select>

                              {/* FILE INPUT */}
                              <label className="text-xs cursor-pointer bg-indigo-600/20 text-indigo-300 px-3 py-1 rounded hover:bg-indigo-600/30 transition">
                                Choose File
                                <input
                                  type="file"
                                  accept="application/pdf"
                                  hidden
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] || null;

                                    if (file) {
                                      const previewUrl = URL.createObjectURL(file);

                                      setFileMap(prev => ({
                                        ...prev,
                                        [p._id]: file
                                      }));

                                      setPreviewMap(prev => ({
                                        ...prev,
                                        [p._id]: previewUrl
                                      }));
                                    }
                                  }}
                                />
                              </label>

                            </div>

                            {/* 🔹 FILE NAME */}
                            {fileMap[p._id] && (
                              <p className="text-[11px] text-slate-400 truncate">
                                📄 {fileMap[p._id]?.name}
                              </p>
                            )}

                            {/* 🔹 PREVIEW */}
                            {previewMap[p._id] && (
                              <div className="rounded overflow-hidden border border-white/10">
                                <iframe
                                  src={previewMap[p._id]}
                                  className="w-full h-[200px]"
                                />
                              </div>
                            )}

                            {/* 🔹 ACTION ROW */}
                            <div className="flex justify-between items-center">

                              {/* CLEAR FILE */}
                              {fileMap[p._id] && (
                                <button
                                  onClick={() => {
                                    setFileMap(prev => ({ ...prev, [p._id]: null }));
                                    setPreviewMap(prev => ({ ...prev, [p._id]: "" }));
                                  }}
                                  className="text-[11px] text-red-400 hover:underline"
                                >
                                  Remove
                                </button>
                              )}

                              {/* UPLOAD BUTTON */}
                              <button
                                onClick={() => uploadFileForPaper(p)}
                                disabled={uploadingId === p._id}
                                className="text-xs bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-500 disabled:opacity-40"
                              >
                                {uploadingId === p._id ? "Uploading..." : "Upload"}
                              </button>

                            </div>

                          </div>
                        </Td>


                <Td>
                  <ActionBtn onClick={() => { setEdit(p); setOpen(true); }}>Edit</ActionBtn>
                  <ActionBtn danger onClick={() => remove(p._id)}>Delete</ActionBtn>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      

      {/* MODAL */}
      {open && (
        <PaperModal
          subject={subject}
          data={edit}
          onClose={() => setOpen(false)}
          onSaved={fetchPapers}
        />
      )}
    </div>
  );
}

/* ================= UI ================= */

const auth = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

function Select({ label, value, options, onChange }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-slate-400">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-[#0F1629] border border-white/10 px-4 py-2 rounded"
      >
        <option value="">Select</option>
        {options.map((o: any) => (
          <option key={o.code} value={o.code}>
              {o.short_name
              ? `${o.short_name}(${o.code})`
              : o.code}
          </option>
        ))}
      </select>
    </div>
  );
}

const Th = ({ children }: any) => (
  <th className="px-4 py-3 text-left font-medium text-slate-400">{children}</th>
);

const Td = ({ children, className = "", ...p }: any) => (
  <td className={`px-4 py-3 ${className}`} {...p}>{children}</td>
);

const ActionBtn = ({ children, danger, ...p }: any) => (
  <button
    {...p}
    className={`mr-3 text-xs ${danger ? "text-red-400" : "text-indigo-400"}`}
  >
    {children}
  </button>
);

/* ================= MODAL ================= */

function PaperModal({ subject, data, onClose, onSaved }: any) {
  const [name, setName] = useState(data?.name || "");
  const [type, setType] = useState(data?.type || "END-SEM");
  const [year, setYear] = useState(data?.year || new Date().getFullYear());
  const [desc, setDesc] = useState(data?.description || "");
  const [paper_pdf, setpaper_pdf] = useState(data?.paper_pdf || "")

  async function submit() {
    if (!name || !type || !year) return;
    console.log("EDIT DATA:", data);

    const method = data ? "PUT" : "POST";
    const url = data
      ? `${API_URL}/admin/papers/${data._id}`
      : `${API_URL}/admin/papers`;

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        subject_code: subject,
        name,
        type,
        year,
        description: desc,
        paper_pdf,
      }),
    });

    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#0F1629] w-[420px] rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold mb-4">
          {data ? "Edit Paper" : "Add Paper"}
        </h3>

        <input className="input mb-3" placeholder="Paper Name"
          value={name} onChange={e => setName(e.target.value)} />

        <select className="input mb-3" value={type}
          onChange={e => setType(e.target.value)}>
          <option>MID-SEM</option>
          <option>END-SEM</option>
          <option>NPTEL</option>
          <option>QUIZ</option>
          <option>PRACTICE</option>
        </select>

        <input type="number" className="input mb-3"
          value={year} onChange={e => setYear(+e.target.value)} />

        <textarea className="input mb-4"
          placeholder="Description (optional)"
          value={desc} onChange={e => setDesc(e.target.value)} />

        <input type="string" className="input mb-3" placeholder="Pdf link"
          value={paper_pdf} onChange={e => setpaper_pdf(e.target.value)} />

        <button onClick={submit}
          disabled={!name}
          className="btn-primary w-full disabled:opacity-40">
          Save
        </button>
    
        <button onClick={onClose}
          className="text-xs text-slate-400 mt-3 w-full">
          Cancel
        </button>
      </div>
    </div>
  );
}
