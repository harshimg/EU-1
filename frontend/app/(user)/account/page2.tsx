"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { apiGet, apiPut } from "@/lib/api";
import { useRouter } from "next/navigation";


export default function AccountPage() {
  const { user, loading, refreshUser } = useAuth();
  const { logout } = useAuth();
  const router = useRouter();


  // To get
  const [profile, setProfile] = useState<any>(null);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [branches, setbranches] = useState<any[]>([]);

  // To update
  const [semester, setSemester] = useState("");
  const [branch, setbranch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ---------------- FETCH PROFILE ---------------- */
  useEffect(() => {
    if (!user) return;

    fetchprofile();

  }, [user]);

  async function fetchprofile() {

    apiGet("/user/account")
    .then(json => {
      setProfile(json.data);
      setSemester(json.data.semester);
      setbranch(json.data.branch);
    })
    .catch(err => console.error(err.message));
    
  }
  /* ---------------- FETCH SEMESTERS ---------------- */
  useEffect(() => {
    if (!showModal) return;

    apiGet("/user/semester")
      .then(json => setSemesters(json.data || []),)
      .catch(err => console.error(err.message));

      apiGet("/user/branch")
      .then(json => setbranches(json.data || []),)
      .catch(err => console.error(err.message));
  }, [showModal]);

  async function updateProfile() {
    if (!semester) return;

    setSaving(true);

    try {
      await apiPut("/user/account/edit", { semester, branch });
      // localStorage.setItem("semester ", {semester});
      // await refreshUser();
      alert("Semester updated successfully");
      fetchprofile();

      const stored = localStorage.getItem("user");
        if (stored) {
        const parsed = JSON.parse(stored);

        parsed.semester = semester;
        parsed.branch = branch;

        localStorage.setItem("user", JSON.stringify(parsed));
        }


      // refreshUser();        // keep auth context in sync
      setShowModal(false);  // close modal
    } catch (e: any) {
      alert(e.message || "Failed to update semester");
    } finally {
      setSaving(false);
    }
    
  }

  if (loading || !profile) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6 space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-xl font-semibold">My Account</h1>
          <p className="text-sm text-slate-500">
            Manage your academic profile
          </p>
        </div>

        {/* PROFILE */}
        <ProfileField label="Name" value={profile?.name} />
        <ProfileField label="Email" value={profile?.email} />
        <ProfileField label="Registration No." value={profile?.reg_no} />
        <ProfileField label="Branch" value={profile?.branch} />
        <ProfileField label="Semester" value={profile?.semester} />
        <ProfileField label="Mobile" value={profile?.mobile} />
        <button
            onClick={() => {logout(),  router.push("/");}}  
            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
          >
            Logout
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="w-full btn-primary"
        >
          Change Semester
        </button>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 space-y-4">

            <h3 className="text-lg font-semibold">Update Academic Profile</h3>
            <p className="text-sm text-slate-500">
              Choose your current semester
            </p>

            <select
              className="input w-full"
              value={semester}
              onChange={e => setSemester(e.target.value)}
            >
              <option value="">Select semester</option>
              {semesters.map(s => (
                <option key={s.code} value={s.code}>
                  {s.code} – {s.name}
                </option>
              ))}
            </select>

            <select
              className="input w-full"
              value={branch}
              onChange={e => setbranch(e.target.value)}
            >
              <option value="">Select Branch</option>
              {branches.map(b => (
                <option key={b.code} value={b.code}>
                  {b.code} – {b.short_name}
                </option>
              ))}
            </select>

            <div className="flex gap-3 pt-3">
              {/*  VISIBLE CANCEL */}
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-lg border border-slate-300
                           text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Cancel
              </button>

              <button
                onClick={updateProfile}
                disabled={!semester || !branch || saving}
                className="flex-1 btn-primary"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- FIELD ---------------- */
function ProfileField({ label, value }: any) {
  return (
    <div className="flex justify-between items-center rounded-lg border px-3 py-2 bg-slate-50 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium">{value || "-"}</span>
    </div>
  );
}

