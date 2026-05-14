"use client";

import { useEffect, useMemo, useState } from "react";

interface Starter {
  id: string;
  label: string;
  spec: string;
}

const EMPTY_SPEC = `{
  "id": "new-carousel",
  "title": "New carousel",
  "vertical": "ai_builder",
  "handle": "@useflowi",
  "slides": [
    {
      "type": "cover",
      "index": 1,
      "total": 3,
      "eyebrow": "AI BUILDERS",
      "headline": "How I shipped 13 articles in a week using",
      "italicWord": "Claude.",
      "sub": "The exact pipeline — scrape, write, render, post."
    },
    {
      "type": "numbered",
      "index": 2,
      "total": 3,
      "number": "01",
      "title": "Scrape what's working",
      "body": "Find one viral carousel per day in your niche. Read it slide-by-slide. Note the hook, the body density, the CTA mechanic."
    },
    {
      "type": "cta",
      "index": 3,
      "total": 3,
      "hook": "Want the full pipeline?",
      "italicWord": "Free.",
      "sub": "Save this for when you're ready.",
      "ctaKeyword": "BUILD",
      "ctaPromise": "for the playbook"
    }
  ],
  "cta": { "keyword": "BUILD", "promise": "for the playbook" },
  "caption": "13 articles. 1 week. Same pipeline I'm shipping now.",
  "hashtags": ["ai", "claude", "buildwithai", "aiworkflow", "indiehacker"]
}`;

export default function StudioEditor({ starters }: { starters: Starter[] }) {
  const [specText, setSpecText] = useState(EMPTY_SPEC);
  const [parseError, setParseError] = useState<string | null>(null);
  const [renderedSlides, setRenderedSlides] = useState<
    Array<{ index: number; dataUrl: string | null; error?: string }>
  >([]);
  const [rendering, setRendering] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const parsedSpec = useMemo(() => {
    try {
      const p = JSON.parse(specText);
      setParseError(null);
      return p;
    } catch (e) {
      setParseError((e as Error).message);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specText]);

  async function renderAll() {
    if (!parsedSpec) return;
    setRendering(true);
    setRenderedSlides(
      parsedSpec.slides.map((s: { index: number }) => ({
        index: s.index,
        dataUrl: null,
      }))
    );

    const themeName = parsedSpec.theme ?? defaultThemeFor(parsedSpec.vertical);
    const handle = parsedSpec.handle;
    const results: Array<{ index: number; dataUrl: string | null; error?: string }> = [];

    for (const slide of parsedSpec.slides) {
      try {
        const res = await fetch("/api/carousel/render", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slide, themeName, handle }),
        });
        if (!res.ok) {
          const txt = await res.text();
          results.push({ index: slide.index, dataUrl: null, error: txt });
        } else {
          const blob = await res.blob();
          const dataUrl = await blobToDataUrl(blob);
          results.push({ index: slide.index, dataUrl });
        }
      } catch (e) {
        results.push({
          index: slide.index,
          dataUrl: null,
          error: (e as Error).message,
        });
      }
      // Push intermediate state so user sees progress.
      setRenderedSlides([...results]);
    }
    setRendering(false);
  }

  async function downloadZip() {
    if (!parsedSpec) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/carousel/zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedSpec),
      });
      if (!res.ok) {
        alert(`Zip failed: ${await res.text()}`);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${parsedSpec.id}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  // Auto-render on first parse-success.
  useEffect(() => {
    if (parsedSpec && renderedSlides.length === 0) {
      renderAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedSpec]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-x-10 gap-y-8">
      {/* Editor column */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <label className="meta uppercase tracking-[0.08em]">
            Starter
          </label>
          <select
            className="bg-[var(--bg-elevated)] text-[var(--ink)] border border-[var(--rule)] rounded px-3 py-2 text-[14px]"
            onChange={(e) => {
              const id = e.target.value;
              if (!id) return;
              const s = starters.find((x) => x.id === id);
              if (s) {
                setSpecText(s.spec);
                setRenderedSlides([]);
              }
            }}
            defaultValue=""
          >
            <option value="">— pick a starter —</option>
            {starters.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setSpecText(EMPTY_SPEC);
              setRenderedSlides([]);
            }}
            className="text-[14px] underline opacity-80 hover:opacity-100"
          >
            reset to default
          </button>
        </div>

        <textarea
          className="font-mono text-[13px] bg-[var(--bg-elevated)] border border-[var(--rule)] rounded p-4 h-[520px] resize-none whitespace-pre"
          value={specText}
          onChange={(e) => setSpecText(e.target.value)}
          spellCheck={false}
        />

        {parseError && (
          <div className="text-[var(--accent)] text-[14px]">
            <span className="font-semibold">JSON error:</span> {parseError}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={renderAll}
            disabled={!parsedSpec || rendering}
            className="px-5 py-3 bg-[var(--ink)] text-[var(--paper)] text-[14px] tracking-[0.04em] uppercase disabled:opacity-40"
          >
            {rendering ? "Rendering…" : "Render all slides"}
          </button>
          <button
            onClick={downloadZip}
            disabled={!parsedSpec || downloading}
            className="px-5 py-3 bg-[var(--accent)] text-[var(--paper)] text-[14px] tracking-[0.04em] uppercase disabled:opacity-40"
          >
            {downloading ? "Building zip…" : "Download deck (.zip)"}
          </button>
        </div>
      </div>

      {/* Preview column */}
      <div className="flex flex-col gap-4">
        <p className="meta uppercase tracking-[0.08em]">
          Preview · 1080×1350 each
        </p>
        <div className="grid grid-cols-2 gap-3">
          {renderedSlides.length === 0 && (
            <div className="col-span-2 text-[14px] italic text-[var(--ink-soft)]">
              {parsedSpec
                ? "Click \"Render all slides\" to preview."
                : "Fix the JSON to enable rendering."}
            </div>
          )}
          {renderedSlides.map((s) => (
            <div
              key={s.index}
              className="border border-[var(--rule)] rounded overflow-hidden bg-[var(--bg-elevated)]"
            >
              {s.dataUrl ? (
                <img
                  src={s.dataUrl}
                  alt={`Slide ${s.index}`}
                  className="w-full block"
                />
              ) : s.error ? (
                <div className="p-3 text-[12px] text-[var(--accent)]">
                  Slide {s.index}: {s.error}
                </div>
              ) : (
                <div className="aspect-[4/5] flex items-center justify-center text-[12px] italic text-[var(--ink-soft)]">
                  Rendering slide {s.index}…
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function defaultThemeFor(vertical: string): string {
  switch (vertical) {
    case "ai_trading":
      return "premium-dark";
    case "ai_behavior":
    case "ai_builder":
    case "ai_general":
    default:
      return "editorial-cream";
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}
