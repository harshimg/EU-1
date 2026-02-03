"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { API_URL } from "@/lib/api";

export default function AdminPDFPage() {
  const { user } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleUpload() {
    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/admin/process-pdf`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to process PDF");
      }

      // ✅ Extract filename from response
      const disposition = res.headers.get("content-disposition");
      let filename = "ar_pdf.pdf";

      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "");
      }

      // ✅ Download file
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      setSuccess("PDF processed and downloaded successfully");
      setFile(null);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // 🔒 SAFETY CHECK
  if (!user || !["admin", "superalpha"].includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-medium">
          Admin access required
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow p-6 space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-xl font-semibold">
            PDF Watermark Processor
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload a PDF to add AlphaResult watermark, logo & links
          </p>
        </div>

        {/* FILE INPUT */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Select PDF file
          </label>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-medium
                       file:bg-indigo-50 file:text-indigo-700
                       hover:file:bg-indigo-100"
          />

          {file && (
            <p className="text-xs text-slate-500">
              Selected: {file.name}
            </p>
          )}
        </div>

        {/* ACTION */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full btn-primary disabled:opacity-60"
        >
          {loading ? "Processing PDF..." : "Upload & Process"}
        </button>

        {/* STATUS */}
        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg">
            {success}
          </div>
        )}

        {/* INFO */}
        <div className="text-xs text-slate-500 border-t pt-4">
          • PDF is processed securely on server  
          <br />
          • Watermark, logo & clickable links added automatically  
          <br />
          • Temporary files are auto-deleted
        </div>

      </div>
    </div>
  );
}
