/**
 * /posts — the visual-decks index.
 *
 * Every spec in content/carousel-specs/ is one post. We list them
 * newest-first as a grid of cover thumbnails. The cover is the spec's
 * first slide rendered via /api/decks/[id]/1 (CDN-cached, free in steady
 * state).
 */

import type { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import type { CarouselSpec } from "@/lib/carousel/types";

const SPECS_DIR = path.join(process.cwd(), "content", "carousel-specs");
const PREFIXES = ["news", "evergreen", "imagepost", "starter"] as const;

type Prefix = (typeof PREFIXES)[number] | "other";

interface PostMeta {
  slug: string; // unprefixed
  title: string;
  vertical: string;
  topic: string | null;
  date: Date | null;
  prefix: Prefix;
}

async function loadAllPostsMeta(): Promise<PostMeta[]> {
  let files: string[] = [];
  try {
    files = (await fs.readdir(SPECS_DIR)).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }

  const metas: PostMeta[] = [];
  for (const f of files) {
    const fileId = f.replace(/\.json$/, "");
    let slug = fileId;
    let prefix: Prefix = "other";
    for (const p of PREFIXES) {
      if (fileId.startsWith(`${p}-`)) {
        slug = fileId.slice(p.length + 1);
        prefix = p;
        break;
      }
    }
    try {
      const spec = JSON.parse(
        await fs.readFile(path.join(SPECS_DIR, f), "utf8")
      ) as CarouselSpec;
      const dateMatch = slug.match(/^(\d{4})-(\d{2})-(\d{2})/);
      const date = dateMatch
        ? new Date(`${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`)
        : null;
      metas.push({
        slug,
        title: spec.title,
        vertical: spec.vertical,
        topic: spec.topic ?? null,
        date,
        prefix,
      });
    } catch {
      /* skip bad JSON */
    }
  }

  metas.sort((a, b) => {
    if (a.date && b.date) return b.date.getTime() - a.date.getTime();
    if (a.date) return -1;
    if (b.date) return 1;
    return a.title.localeCompare(b.title);
  });

  return metas;
}

export const metadata: Metadata = {
  title: "Posts — Visual decks · Flowi",
  description:
    "Every Flowi post as a visual deck — the same AI stories that ship to Instagram and TikTok, archived here as their own destination on the site.",
  alternates: { canonical: "https://useflowi.app/posts" },
  openGraph: {
    title: "Posts — Visual decks · Flowi",
    description:
      "Every Flowi post as a visual deck — the same stories that ship to Instagram and TikTok.",
    url: "https://useflowi.app/posts",
    siteName: "Flowi",
    type: "website",
  },
};

export default async function PostsIndexPage() {
  const metas = await loadAllPostsMeta();

  return (
    <main className="bg-[var(--bg)] text-[var(--ink)]">
      <Nav />

      <section className="page-gutter pt-16 md:pt-24 pb-14 md:pb-20">
        <div className="page-max">
          <p className="eyebrow eyebrow-mark mb-8 md:mb-10">
            Posts · {metas.length} {metas.length === 1 ? "deck" : "decks"}
          </p>
          <h1 className="display text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] leading-[0.98] -tracking-[0.025em] mb-8">
            Every post, <span className="marker">in pictures</span>.
          </h1>
          <p className="lead measure">
            The same visual decks that ship to Instagram and TikTok — archived here as their own destination on the site. Tap one to read it slide by slide; the long-form article sits one click away.
          </p>
        </div>
      </section>

      <section className="page-gutter pb-20 md:pb-28 border-t border-[var(--rule)]">
        <div className="page-max-wide pt-12 md:pt-16">
          {metas.length === 0 ? (
            <p className="meta italic">No decks yet. The daily engine drafts them at 06:00 UTC.</p>
          ) : (
            <ol className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 list-none p-0 m-0">
              {metas.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/posts/${m.slug}`}
                    className="block group no-underline"
                  >
                    <figure className="relative w-full aspect-[1080/1350] bg-[var(--bg-elevated)] border border-[var(--rule)] overflow-hidden mb-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/api/decks/${m.slug}/1`}
                        alt={`${m.title} — cover slide`}
                        className="block w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </figure>
                    <p className="meta tabular mb-1">
                      {m.date
                        ? m.date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : m.prefix}
                    </p>
                    <h3 className="serif text-[1.0625rem] md:text-[1.125rem] leading-tight group-hover:text-[var(--accent)] transition-colors">
                      {m.title}
                    </h3>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
