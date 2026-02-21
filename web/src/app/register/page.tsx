"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

type Role = "admin" | "doctor" | "nurse";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("doctor");
  const [orgId, setOrgId] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setIsSubmitting(true);

    try {
      await apiFetch("/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, role, orgId }),
      });
      setMsg("Registered successfully. You can now login.");
      setEmail("");
      setPassword("");
      setOrgId("");
      setRole("doctor");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Registration failed";
      setErr(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Register</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 360 }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value as Role)} required>
          <option value="admin">admin</option>
          <option value="doctor">doctor</option>
          <option value="nurse">nurse</option>
        </select>
        <input
          value={orgId}
          onChange={(e) => setOrgId(e.target.value)}
          placeholder="orgId"
          required
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </form>
      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}
    </main>
  );
}
