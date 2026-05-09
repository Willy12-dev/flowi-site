"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const r = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErr(data.error || `error ${r.status}`);
        setLoading(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch (e) {
      setErr((e as Error).message);
      setLoading(false);
    }
  }

  return (
    <main className="bg-[var(--bg)] text-[var(--ink)] min-h-screen flex items-center">
      <div className="page-gutter w-full">
        <div className="page-max max-w-md">
          <p className="eyebrow eyebrow-mark mb-6">Admin · Restricted</p>
          <h1 className="display text-[2.5rem] md:text-[3.5rem] leading-[1.0] mb-3">
            The newsroom is{" "}
            <span className="display-italic">closed.</span>
          </h1>
          <p className="meta italic mb-10">
            Press passes only. One typed answer in.
          </p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label htmlFor="pw" className="eyebrow block mb-2">
                Password
              </label>
              <input
                id="pw"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                autoFocus
                disabled={loading}
                className="w-full bg-transparent border-0 border-b border-[var(--ink)] py-3 px-0 text-[1.125rem] focus:outline-none focus:border-[var(--accent)] tabular"
                placeholder="••••••••"
              />
            </div>

            {err && (
              <p className="meta italic text-[var(--accent)]">— {err}</p>
            )}

            <button
              type="submit"
              disabled={loading || !pw}
              className="link-red text-[1.0625rem] font-medium disabled:opacity-40"
            >
              {loading ? "Verifying…" : "Enter →"}
            </button>
          </form>

          <p className="meta italic mt-12">
            ADMIN_PASSWORD is set in <span className="tabular">.env.local</span>.
            Server reload picks it up.
          </p>
        </div>
      </div>
    </main>
  );
}
