"use client";
import { useState } from "react";

export function DownloadResumeButton({ resume }: { resume: any }) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const resp = await fetch("/api/public/resume-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resume),
        });
        setLoading(false);
        if (!resp.ok) return alert("Build failed");

        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${(resume.name || "resume").replace(/\s+/g, "_")}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }}
    >
      {loading ? "Building…" : "Download PDF"}
    </button>
  );
}
