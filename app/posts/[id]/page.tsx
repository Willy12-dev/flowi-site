/**
 * /posts/[id] — public visual deck page.
 *
 * The same carousel that ships to Instagram and TikTok, archived as its
 * own destination on the site. Slides render via /api/decks/[id]/[n]
 * (Satori + strong CDN cache); this page just composes them with the
 * caption, hashtags and a cross-link to the long-form blog article.
 *
 *   - [id] is the unprefixed slug (e.g. "2026-05-19-qwen-3-5-censorship-weights")
 *   - The matching spec is content/carousel-specs/<prefix>-<id>.json
 *     where <prefix> ∈ { news, evergreen, imagepost, starter }
 *   - For news specs, the blog article lives at /blog/<id> (1:1 slug map).
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import fsSync from "fs";
import path from "path";
import Link from "next/link";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import type { CarouselSpec } from "@/lib/carousel/types";

const SPECS_DIR = path.join(process.cwd(), "content", "carousel-specs");
const PREFIXES = ["news", "evergreen", "imagepost", "starter"] as const;

interface SpecResolution {
  spec: CarouselSpec;
  specId: string; // includes prefix
}

async function loadSpecBySlug(slug: string): Promise<SpecResolution | null> {
  const safe = slug.replace(/[^a-zA-Z0-9_-]/g, "");
  for (const prefix of PREFIXES) {
    const specId = `${prefix}-${safe}`;
    try {
      const text = await fs.readFile(
        path.join(SPECS_DIR, `${specId}.json`),
        "utf8"
      );
      return { spec: JSON.parse(text) as CarouselSpec, specId };
    } catch {
      /* try next */
    }
  }
  try {
    const text = await fs.readFile(
      path.join(SPECS_DIR, `${safe}.json`),
      "utf8"
    );
    return { spec: JSON.parse(text) as CarouselSpec, specId: safe };
  } catch {
    return null;
  }
}

function shortDescription(spec: CarouselSpec): string {
  const raw = (spec.caption || spec.title || "")
    .replace(/\s+/g, " ")
    .trim();
  if (raw.length <= 160) return raw;
  return raw.slice(0, 160).replace(/\s+\S*$/, "").trim() + "…";
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  if (!fsSync.existsSync(SPECS_DIR)) return [];
  return fsSync
    .readdirSync(SPECS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      let id = f.replace(/\.json$/, "");
      for (const prefix of PREFIXES) {
        if (id.startsWith(`${prefix}-`)) {
          id = id.slice(prefix.length + 1);
          break;
        }
      }
      return { id };
    });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await loadSpecBySlug(id);
  if (!result) return {};
  const { spec } = result;
  const url = `https://useflowi.app/posts/${id}`;
  const coverImage = `https://useflowi.app/api/decks/${id}/1`;
  const description = shortDescription(spec);

  return {
    title: `${spec.title} — Visual deck · Flowi`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: spec.title,
      description,
      type: "article",
      url,
      siteName: "Flowi",
      images: [{ url: coverImage, width: 1080, height: 1350, alt: spec.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: spec.title,
      description,
      images: [coverImage],
    },
  };
}

export default async function DeckPage({ params }: PageProps) {
  const { id } = await params;
  const result = await loadSpecBySlug(id);
  if (!result) notFound();
  const { spec, specId } = result;

  // News specs pair 1:1 with blog articles by stripping the "news-" prefix.
  // The cross-link only shows when a published blog article actually exists.
  const blogSlug = specId.startsWith("news-") ? specId.slice("news-".length) : null;
  const blogArticleExists =
    blogSlug !== null &&
    fsSync.existsSync(
      path.join(process.cwd(), "content", "blog", `${blogSlug}.md`)
    );

  const dateMatch = id.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const date = dateMatch
    ? new Date(`${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`)
    : null;
  const dateLong = date
    ? date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const deckUrl = `https://useflowi.app/posts/${id}`;
  const coverImage = `https://useflowi.app/api/decks/${id}/1`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: spec.title,
    description: shortDescription(spec),
    image: coverImage,
    datePublished: date ? date.toISOString() : undefined,
    author: {
      "@type": "Organization",
      name: "Flowi Editorial",
      url: "https://useflowi.app/about",
    },
    publisher: {
      "@type": "Organization",
      name: "Flowi",
      url: "https://useflowi.app",
      logo: {
        "@type": "ImageObject",
        url: "https://useflowi.app/images/LOGOOOO.png",
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": deckUrl },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://useflowi.app" },
      { "@type": "ListItem", position: 2, name: "Posts", item: "https://useflowi.app/posts" },
      { "@type": "ListItem", position: 3, name: spec.title, item: deckUrl },
    ],
  };

  return (
    <main className="bg-[var(--bg)] text-[var(--ink)]">
      <Nav />

      <article className="page-gutter pt-12 md:pt-16 pb-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        <div className="page-max">
          <div className="mb-8">
            <Link href="/posts" className="meta hover:text-[var(--accent)]">
              ← All posts
            </Link>
          </div>

          <header className="mb-10 pb-10 border-b border-[var(--rule)]">
            <p className="eyebrow eyebrow-mark mb-6">
              {(spec.vertical || "post").replace(/_/g, " ")} · visual deck
            </p>

            <h1 className="display text-[2.25rem] sm:text-[3rem] md:text-[4.25rem] leading-[1.02] mb-6">
              {spec.title}
            </h1>

            <p className="meta italic mb-2">
              {dateLong && (
                <>
                  <span className="tabular not-italic">{dateLong}</span>
                  {" · "}
                </>
              )}
              <span className="tabular not-italic">
                {spec.slides.length} slides
              </span>
              {blogArticleExists && (
                <>
                  {" · "}
                  <Link
                    href={`/blog/${blogSlug}`}
                    className="link-red not-italic"
                  >
                    Read the full article →
                  </Link>
                </>
              )}
            </p>
          </header>

          {/* Deck — vertical scroll, 4:5 portrait per slide (1080×1350) */}
          <div className="flex flex-col gap-6 md:gap-8 max-w-[640px] mx-auto">
            {spec.slides.map((_slide, i) => (
              <figure
                key={i}
                className="relative w-full aspect-[1080/1350] bg-[var(--bg-elevated)] border border-[var(--rule)] overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/decks/${id}/${i + 1}`}
                  alt={`${spec.title} — slide ${i + 1} of ${spec.slides.length}`}
                  width={1080}
                  height={1350}
                  loading={i < 2 ? "eager" : "lazy"}
                  className="block w-full h-auto"
                />
              </figure>
            ))}
          </div>

          {/* Caption — the same long-form copy that ships to Instagram */}
          {spec.caption && (
            <div className="mt-14 max-w-[64ch]">
              <p className="eyebrow eyebrow-mark mb-3">Caption</p>
              <div className="text-[1.0625rem] leading-relaxed whitespace-pre-wrap">
                {spec.caption}
              </div>
            </div>
          )}

          {spec.hashtags && spec.hashtags.length > 0 && (
            <div className="mt-10 max-w-[64ch]">
              <p className="eyebrow eyebrow-mark mb-3">Tagged</p>
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                {spec.hashtags.map((tag) => {
                  const clean = String(tag).replace(/^#/, "").toLowerCase().replace(/\s+/g, "");
                  return (
                    <span key={clean} className="meta">
                      #{clean}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {blogArticleExists && (
            <aside className="mt-14 pt-8 border-t border-[var(--rule)] max-w-[64ch]">
              <p className="eyebrow eyebrow-mark mb-3">The full read</p>
              <h3 className="serif text-[1.625rem] md:text-[1.875rem] leading-[1.15] mb-3">
                <Link href={`/blog/${blogSlug}`} className="link-ink">
                  Read &ldquo;{spec.title}&rdquo; as a full article →
                </Link>
              </h3>
              <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed">
                The long-form version of this deck — the same story, in prose.
              </p>
            </aside>
          )}
        </div>
      </article>

      <Footer />
    </main>
  );
}
