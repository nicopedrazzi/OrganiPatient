"use client";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";



export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  const router = useRouter()

  async function upload() {
    if (!file) return;
    setMsg("Uploading...");

    const fd = new FormData();
    fd.append("file", file);

    try {
      await apiFetch("/reports/upload", {
        method: "POST",
        body: fd,
      });
      router.push("/reports");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Upload failed";
      setMsg(message);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Upload</h1>
      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <Button onClick={upload} disabled={!file}>Upload</Button>
      <p>{msg}</p>
    </main>
  );
}
