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
