"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

interface Copy {
  eyebrow: string;
  headline: string;
  body: string;
  cta: string;
  promiseLine: string;
}

const COPY: Record<string, Copy> = {
  ai_trading: {
    eyebrow: "If this is your kind of read",
    headline: "Get the PDF + monthly Dispatch for traders",
    body: "This article packaged for offline reading, plus the monthly editorial on AI in markets. The Dispatch goes to the trading list only — no behavior content, no AI-builder fluff.",
    cta: "Get the PDF →",
    promiseLine: "One email a month. Unsubscribe in one click.",
  },
  ai_behavior: {
    eyebrow: "If this is your kind of read",
    headline: "Get the PDF + monthly Dispatch on behavior change",
    body: "This article as a PDF you can re-read offline, plus the monthly editorial on what actually works in behavior change. Trading content stays in the other list.",
    cta: "Get the PDF →",
    promiseLine: "One email a month. Unsubscribe in one click.",
  },
  default: {
    eyebrow: "If this is your kind of read",
    headline: "Get the PDF + monthly Dispatch for AI builders",
    body: "This article packaged as a PDF you can read offline, plus the monthly Dispatch — long-form on what shipped in AI and which patterns actually ship in production.",
    cta: "Get the PDF →",
    promiseLine: "One email a month. Unsubscribe in one click.",
  },
};

interface Props {
  vertical: string;
  slug: string;
  hasPdf: boolean;
}

export default function InlineLeadMagnet({ vertical, slug, hasPdf }: Props) {
  const copy = COPY[vertical] || COPY.default;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setError("");

    track("inline_magnet_submit", { article: slug, vertical, position: "inline-40" });

    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: `inline-${vertical}-${slug}`,
        }),
      });
      if (!r.ok) throw new Error(`status ${r.status}`);
      setStatus("success");
      // Trigger PDF download after success, if available
      if (hasPdf) {
        setTimeout(() => {
          const a = document.createElement("a");
          a.href = `/pdfs/${slug}.pdf`;
          a.download = `${slug}.pdf`;
          a.click();
        }, 500);
      }
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  }

  if (status === "success") {
    return (
      <aside
        className="my-12 py-8 px-6 md:px-8 border-l-2 border-[var(--accent)] bg-[var(--bg-elevated)] max-w-[64ch]"
        aria-live="polite"
      >
        <p className="eyebrow eyebrow-mark mb-2">✓ Subscribed</p>
        <p className="serif text-[1.25rem] leading-[1.3] mb-2">
          You&apos;re on the list. The Dispatch lands first of the month.
        </p>
        <p className="meta italic">
          {hasPdf ? "Your PDF should be downloading now." : ""} If it doesn&apos;t,{" "}
          {hasPdf && (
            <a href={`/pdfs/${slug}.pdf`} className="link-red">
              click here
            </a>
          )}
          .
        </p>
      </aside>
    );
  }

  return (
    <aside
      className="my-12 py-8 px-6 md:px-8 border-l-2 border-[var(--accent)] bg-[var(--bg-elevated)] max-w-[64ch]"
      aria-label="Newsletter signup with PDF download"
    >
      <p className="eyebrow eyebrow-mark mb-3">{copy.eyebrow}</p>
      <h3 className="serif text-[1.375rem] md:text-[1.5rem] leading-[1.2] mb-3">
        {copy.headline}
      </h3>
      <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed mb-5">
        {copy.body}
      </p>
      <form onSubmit={submit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-baseline sm:gap-x-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            placeholder="you@somewhere.com"
            className="flex-1 bg-transparent border-0 border-b border-[var(--ink)] py-2 px-0 text-[1rem] focus:outline-none focus:border-[var(--accent)] placeholder:text-[var(--ink-mute)]"
          />
          <button
            type="submit"
            disabled={status === "loading" || !email}
            className="link-red text-[1rem] font-medium disabled:opacity-40 self-start sm:self-auto whitespace-nowrap"
          >
            {status === "loading" ? "Sending…" : copy.cta}
          </button>
        </div>
        <p className="meta italic">{copy.promiseLine}</p>
        {status === "error" && (
          <p className="meta italic text-[var(--accent)]">— {error || "Something failed. Try again?"}</p>
        )}
      </form>
    </aside>
  );
}
