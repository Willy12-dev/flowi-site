import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin";
import StudioEditor from "./StudioEditor";
import { promises as fs } from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "Studio — Flowi Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function StudioPage() {
  if (!(await isAuthed())) {
    redirect("/admin/login");
  }

  // Load starter specs from content/carousel-specs/ as picker options.
  const starters: Array<{ id: string; label: string; spec: string }> = [];
  const dir = path.join(process.cwd(), "content", "carousel-specs");
  try {
    const files = await fs.readdir(dir);
    for (const f of files) {
      if (!f.endsWith(".json")) continue;
      try {
        const spec = await fs.readFile(path.join(dir, f), "utf8");
        const parsed = JSON.parse(spec);
        starters.push({
          id: f.replace(/\.json$/, ""),
          label: parsed.title || f,
          spec,
        });
      } catch {
        // skip malformed
      }
    }
  } catch {
    // directory may not exist yet
  }

  return (
    <main>
      <section className="page-gutter pt-10 md:pt-12 pb-8">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-4">
            Carousel studio · paste a spec, render a deck
          </p>
          <h1 className="display text-[2.5rem] md:text-[4rem] leading-[1.0] -tracking-[0.02em] mb-3">
            Pick a format. <span className="display-italic">Ship.</span>
          </h1>
          <p className="lead measure">
            10 templates, 4 themes. Edit the JSON, preview every slide, download
            the deck as PNGs zipped + caption.txt. Distilled from 193 reference
            images — see <code className="tabular">references/SYNTHESIS.md</code>.
          </p>
        </div>
      </section>

      <section className="page-gutter pb-20 border-t border-[var(--rule)]">
        <div className="page-max-wide pt-8">
          <StudioEditor starters={starters} />
        </div>
      </section>
    </main>
  );
}
