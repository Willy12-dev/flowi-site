"use client";

import { useState } from "react";
import type { SpecMeta } from "./page";

interface Pack {
  id: string;
  title: string;
  slides: Array<{ name: string; dataUrl: string }>;
  caption: string;
  posts: {
    twitter: string;
    reddit: string;
    quora: string;
    tiktok: string;
    pinterest: string;
  };
  imagePrompts: string | null;
}

const KIND_LABEL: Record<string, string> = {
  evergreen: "Evergreen — Pinterest engine (compounds in search)",
  news: "News — timely (IG / X / TikTok / Reddit, decays fast)",
  starter: "Starter / hand-written",
};

export default function LibraryBrowser({
  groups,
}: {
  groups: { evergreen: SpecMeta[]; news: SpecMeta[]; starter: SpecMeta[] };
}) {
  return (
    <>
      {(["evergreen", "news", "starter"] as const).map((kind) => {
        const list = groups[kind];
        if (list.length === 0) return null;
        return (
          <section
            key={kind}
            className="page-gutter pb-10 border-t border-[var(--rule)]"
          >
            <div className="page-max-wide pt-8">
              <p className="eyebrow eyebrow-mark mb-3">
                {KIND_LABEL[kind]} · {list.length}
              </p>
              <span className="draw-rule mb-6 block" aria-hidden="true" />
              <div className="flex flex-col gap-3">
                {list.map((s) => (
                  <DeckRow key={s.id} meta={s} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}

function DeckRow({ meta }: { meta: SpecMeta }) {
  const [open, setOpen] = useState(false);
  const [pack, setPack] = useState<Pack | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  async function toggle() {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (pack || loading) return;
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch("/api/carousel/pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specId: meta.id }),
      });
      if (!r.ok) {
        setErr(`${r.status}: ${(await r.json()).error ?? "render failed"}`);
      } else {
        setPack(await r.json());
      }
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function downloadZip() {
    setDownloading(true);
    try {
      const r = await fetch("/api/carousel/zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specId: meta.id }),
      });
      if (!r.ok) {
        alert(`Zip failed: ${await r.text()}`);
        return;
      }
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${meta.id}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="border border-[var(--rule)] rounded bg-[var(--bg-elevated)]">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="min-w-0">
          <p className="text-[1.0625rem] font-semibold truncate">
            {meta.title}
          </p>
          <p className="meta mt-1">
            {meta.vertical}
            {meta.topic ? ` · ${meta.topic}` : ""} · {meta.slides} slides ·{" "}
            <span className="tabular">{meta.id}</span>
          </p>
        </div>
        <span className="text-[14px] opacity-60 shrink-0">
          {open ? "− close" : "+ open"}
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-[var(--rule)] pt-4">
          {loading && (
            <p className="meta italic py-6">
              Rendering {meta.slides} slides + all platform text…
            </p>
          )}
          {err && (
            <p className="text-[var(--accent)] text-[14px] py-4">⚠ {err}</p>
          )}

          {pack && (
            <>
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={downloadZip}
                  disabled={downloading}
                  className="px-4 py-2 bg-[var(--accent)] text-[var(--paper)] text-[13px] tracking-[0.04em] uppercase disabled:opacity-40"
                >
                  {downloading ? "Zipping…" : "Download full .zip"}
                </button>
              </div>

              {/* Slides */}
              <p className="meta uppercase tracking-[0.08em] mb-3">
                Slides · click to download each
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-7">
                {pack.slides.map((sl) => (
                  <a
                    key={sl.name}
                    href={sl.dataUrl}
                    download={sl.name}
                    className="block border border-[var(--rule)] rounded overflow-hidden hover:opacity-80"
                    title={`Download ${sl.name}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sl.dataUrl} alt={sl.name} className="w-full block" />
                  </a>
                ))}
              </div>

              {/* Copy blocks */}
              <CopyBlock label="Instagram caption" text={pack.caption} />
              <CopyBlock label="Pinterest pins" text={pack.posts.pinterest} />
              <CopyBlock label="X / Twitter thread" text={pack.posts.twitter} />
              <CopyBlock label="Reddit post" text={pack.posts.reddit} />
              <CopyBlock
                label="Quora (link-free)"
                text={pack.posts.quora}
              />
              <CopyBlock label="TikTok script" text={pack.posts.tiktok} />
              {pack.imagePrompts && (
                <CopyBlock label="Image prompts" text={pack.imagePrompts} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function CopyBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <p className="meta uppercase tracking-[0.08em]">{label}</p>
        <button
          onClick={copy}
          className="text-[12px] px-3 py-1 bg-[var(--ink)] text-[var(--paper)] uppercase tracking-[0.04em]"
        >
          {copied ? "✓ copied" : "Copy"}
        </button>
      </div>
      <pre className="text-[12px] bg-[var(--bg)] border border-[var(--rule)] rounded p-3 max-h-56 overflow-auto whitespace-pre-wrap">
        {text}
      </pre>
    </div>
  );
}
