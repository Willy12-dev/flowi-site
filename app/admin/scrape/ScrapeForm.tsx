"use client";

import { useState } from "react";

const LABEL: Record<string, string> = {
  ai_general: "AI General — funnels to Books",
  ai_trading: "Trading — funnels to FlowiAI Trader",
  ai_behavior: "Behavior — funnels to Woyuduin",
};

interface Result {
  ok: boolean;
  output?: string;
  outFile?: string;
  strategy?: string;
  error?: string;
}

export default function ScrapeForm({ verticals }: { verticals: string[] }) {
  const [url, setUrl] = useState("");
  const [vertical, setVertical] = useState("ai_general");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const r = await fetch("/api/admin/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), vertical, note: note.trim() }),
      });
      const data: Result = await r.json().catch(() => ({ ok: false, error: "bad json" }));
      setResult(data);
      if (data.ok) {
        setUrl("");
        setNote("");
      }
    } catch (e) {
      setResult({ ok: false, error: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <div>
        <label htmlFor="url" className="eyebrow block mb-2">
          Source URL
        </label>
        <input
          id="url"
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={busy}
          placeholder="https://twitter.com/handle/status/12345…"
          className="w-full bg-transparent border-0 border-b border-[var(--ink)] py-3 px-0 text-[1.0625rem] focus:outline-none focus:border-[var(--accent)] placeholder:text-[var(--ink-mute)] tabular"
        />
      </div>

      <div>
        <p className="eyebrow mb-3">Vertical</p>
        <div className="space-y-3">
          {verticals.map((v) => (
            <label
              key={v}
              className={`flex items-baseline gap-x-4 cursor-pointer py-1 ${
                vertical === v ? "" : "opacity-60 hover:opacity-100"
              }`}
            >
              <input
                type="radio"
                name="vertical"
                value={v}
                checked={vertical === v}
                onChange={() => setVertical(v)}
                disabled={busy}
                className="accent-[var(--accent)]"
              />
              <span className="text-[1.0625rem]">{LABEL[v] || v}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="note" className="eyebrow block mb-2">
          Note <span className="meta italic">(optional — what made this worth scraping?)</span>
        </label>
        <input
          id="note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={busy}
          placeholder="3.4M views; model the hook"
          className="w-full bg-transparent border-0 border-b border-[var(--rule)] py-3 px-0 text-[1.0625rem] focus:outline-none focus:border-[var(--accent)] placeholder:text-[var(--ink-mute)]"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={busy || !url}
          className="link-red text-[1.0625rem] font-medium disabled:opacity-40"
        >
          {busy ? "Scraping…" : "Scrape it →"}
        </button>
      </div>

      {result && (
        <div
          className={`mt-8 pt-6 border-t ${
            result.ok ? "border-[var(--rule)]" : "border-[var(--accent)]"
          }`}
        >
          {result.ok ? (
            <>
              <p className="eyebrow eyebrow-mark mb-2 text-[var(--accent)]">
                ✓ Saved
              </p>
              <p className="meta italic mb-2">
                Strategy: <span className="tabular not-italic">{result.strategy}</span>
              </p>
              {result.outFile && (
                <p className="text-[14px] text-[var(--ink-soft)] tabular break-all">
                  → {result.outFile}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="eyebrow eyebrow-mark mb-2 text-[var(--accent)]">
                ✕ Failed
              </p>
              <p className="meta italic mb-2">{result.error}</p>
            </>
          )}
          {result.output && (
            <details className="mt-4">
              <summary className="meta italic cursor-pointer hover:text-[var(--accent)]">
                show python output
              </summary>
              <pre className="text-[12px] mt-3 bg-[var(--bg-elevated)] p-3 border-l-2 border-[var(--rule)] overflow-x-auto whitespace-pre-wrap">
                {result.output.replace(/\x1b\[[0-9;]*m/g, "")}
              </pre>
            </details>
          )}
        </div>
      )}
    </form>
  );
}
