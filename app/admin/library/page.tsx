import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin";
import { promises as fs } from "fs";
import path from "path";
import LibraryBrowser from "./LibraryBrowser";

export const metadata: Metadata = {
  title: "Content Library — Flowi Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export interface SpecMeta {
  id: string;
  title: string;
  vertical: string;
  topic: string | null;
  slides: number;
  kind: "news" | "evergreen" | "imagepost" | "starter";
  mtime: string;
}

async function listSpecs(): Promise<SpecMeta[]> {
  const dir = path.join(process.cwd(), "content", "carousel-specs");
  let files: string[] = [];
  try {
    files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
  const out: SpecMeta[] = [];
  for (const f of files) {
    try {
      const full = path.join(dir, f);
      const stat = await fs.stat(full);
      const j = JSON.parse(await fs.readFile(full, "utf8"));
      const id: string = j.id || f.replace(/\.json$/, "");
      out.push({
        id,
        title: j.title || id,
        vertical: j.vertical || "—",
        topic: j.topic || null,
        slides: Array.isArray(j.slides) ? j.slides.length : 0,
        kind: id.startsWith("news-")
          ? "news"
          : id.startsWith("evergreen-")
            ? "evergreen"
            : id.startsWith("imagepost-")
              ? "imagepost"
              : "starter",
        mtime: stat.mtime.toISOString(),
      });
    } catch {
      /* skip malformed */
    }
  }
  out.sort((a, b) => b.mtime.localeCompare(a.mtime));
  return out;
}

export default async function LibraryPage() {
  if (!(await isAuthed())) redirect("/admin/login");
  const specs = await listSpecs();

  const groups = {
    imagepost: specs.filter((s) => s.kind === "imagepost"),
    evergreen: specs.filter((s) => s.kind === "evergreen"),
    news: specs.filter((s) => s.kind === "news"),
    starter: specs.filter((s) => s.kind === "starter"),
  };

  return (
    <main>
      <section className="page-gutter pt-10 md:pt-12 pb-8">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-4">
            Content library · browse · copy · post
          </p>
          <h1 className="display text-[2.5rem] md:text-[4rem] leading-[1.0] -tracking-[0.02em] mb-3">
            Everything, <span className="display-italic">ready.</span>
          </h1>
          <p className="lead measure">
            Every carousel — news + evergreen — in one place. Click a deck:
            preview every slide, copy the caption or any platform&apos;s text
            with one button, or download the full zip. No terminal, no files.
          </p>
          <p className="meta mt-4">
            {groups.imagepost.length} image-posts · {groups.evergreen.length}{" "}
            evergreen · {groups.news.length} news · {groups.starter.length}{" "}
            starter · {specs.length} total
          </p>
        </div>
      </section>

      <LibraryBrowser
        groups={{
          imagepost: groups.imagepost,
          evergreen: groups.evergreen,
          news: groups.news,
          starter: groups.starter,
        }}
      />
    </main>
  );
}
