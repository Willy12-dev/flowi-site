import type { Metadata } from "next";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { getPostBySlug, getAllSlugs, getAllPosts, getPostsByCategory, getPrevNextInCategory, markdownToHtml } from "@/lib/blog";
import { getCTAForCategory } from "@/lib/funnels";
import BlogPostContent from "@/components/BlogPost";
import InlineLeadMagnet from "@/components/InlineLeadMagnet";
import TrackedLink from "@/components/TrackedLink";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import EmailCapture from "@/components/site/EmailCapture";
import Link from "next/link";

/** Split HTML at the Nth closing </p> tag so we can inject components mid-article. */
function splitHtmlAtParagraph(html: string, n: number): [string, string] {
  let count = 0;
  const re = /<\/p>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    count++;
    if (count === n) {
      const cut = match.index + match[0].length;
      return [html.slice(0, cut), html.slice(cut)];
    }
  }
  return [html, ""];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `https://useflowi.app/blog/${slug}`;
  const image = post.image || "https://useflowi.app/images/atlas_hero.png";

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author || "Flowi Editorial" }],
    category: post.category?.replace(/_/g, " "),
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      siteName: "Flowi",
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author || "Flowi Editorial"],
      tags: post.tags,
      section: post.category?.replace(/_/g, " "),
      images: [{ url: image, width: 1500, height: 1000, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
      creator: "@FlowiGroup",
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const htmlContent = await markdownToHtml(post.content);
  const readTime = Math.max(1, Math.ceil(post.wordCount / 200));

  // Check if a pre-generated PDF exists for this article
  const pdfPath = path.join(process.cwd(), "public", "pdfs", `${slug}.pdf`);
  const pdfExists = fs.existsSync(pdfPath);

  // Category-aware: prefer 3 more from the same vertical; fall back to recent overall
  const sameCategory = getPostsByCategory(post.category).filter((p) => p.slug !== slug);
  const more = sameCategory.length >= 3
    ? sameCategory.slice(0, 3)
    : [
        ...sameCategory,
        ...getAllPosts()
          .filter((p) => p.slug !== slug && !sameCategory.some((s) => s.slug === p.slug))
          .slice(0, 3 - sameCategory.length),
      ];
  const moreFromCategoryLabel = sameCategory.length >= 3
    ? `More on ${post.category.replace(/_/g, " ")}`
    : "More from Daily AI";

  // rel=prev/next within the same category — helps non-Google crawlers
  // discover topic clusters. Google deprecated as a ranking signal in 2019
  // but Bing/Yandex still use it.
  const { prev: prevInCategory, next: nextInCategory } = getPrevNextInCategory(
    slug,
    post.category
  );

  const articleUrl = `https://useflowi.app/blog/${slug}`;
  const articleImage = post.image || "https://useflowi.app/images/atlas_hero.png";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: articleImage,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author || "Flowi Editorial",
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
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    keywords: post.keywords.join(", "),
    articleSection: post.category?.replace(/_/g, " "),
    wordCount: post.wordCount,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://useflowi.app" },
      { "@type": "ListItem", position: 2, name: "Daily AI Brief", item: "https://useflowi.app/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: articleUrl },
    ],
  };

  const dateLong = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
        {prevInCategory && (
          <link rel="prev" href={`https://useflowi.app/blog/${prevInCategory.slug}`} />
        )}
        {nextInCategory && (
          <link rel="next" href={`https://useflowi.app/blog/${nextInCategory.slug}`} />
        )}

        <div className="page-max">
          <div className="mb-8">
            <Link href="/blog" className="meta hover:text-[var(--accent)]">← Daily AI</Link>
          </div>

          <header className="mb-12 pb-12 border-b border-[var(--rule)]">
            <p className="eyebrow eyebrow-mark mb-6">
              {post.category ? post.category.replace(/_/g, " ") : "Article"}
            </p>

            <h1 className="display text-[2.25rem] sm:text-[3rem] md:text-[4.25rem] leading-[1.02] mb-6">
              {post.title}
            </h1>

            <p className="meta italic mb-6">
              By{" "}
              <span className="not-italic font-medium text-[var(--ink)]">
                {post.author || "Flowi Editorial"}
              </span>
              {" · "}
              <span className="tabular">{dateLong}</span>
              {" · "}
              <span className="tabular">{readTime} min read</span>
              {pdfExists && (
                <>
                  {" · "}
                  <TrackedLink
                    href={`/pdfs/${slug}.pdf`}
                    className="link-red not-italic"
                    attribution={{
                      article: slug,
                      vertical: post.category || "uncategorized",
                      position: "top-byline",
                      offer: "Download PDF",
                    }}
                  >
                    Download PDF ↓
                  </TrackedLink>
                </>
              )}
            </p>

            {post.description && (
              <p className="lead measure mb-8">{post.description}</p>
            )}

            {post.image && (
              <figure className="mt-10 -mx-4 sm:mx-0">
                <div className="relative w-full aspect-[16/9] bg-[var(--bg-elevated)] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
              </figure>
            )}
          </header>

          {(() => {
            // Inject InlineLeadMagnet after the 5th paragraph (≈35–45% scroll
            // depth for a typical 1,200-word article). Conversion-surface
            // mid-article > only-at-bottom — readers rarely finish.
            const [firstHalf, secondHalf] = splitHtmlAtParagraph(htmlContent, 5);
            return (
              <>
                <BlogPostContent htmlContent={firstHalf} />
                {secondHalf && (
                  <InlineLeadMagnet
                    vertical={post.category}
                    slug={slug}
                    hasPdf={pdfExists}
                  />
                )}
                {secondHalf && <BlogPostContent htmlContent={secondHalf} />}
              </>
            );
          })()}

          {/* Context-aware CTA — funnels to flagship product based on article category */}
          {(() => {
            const cta = getCTAForCategory(post.category);
            const linkProps = cta.external
              ? { target: "_blank", rel: "noopener" }
              : {};
            const ctaPosition =
              post.category === "ai_trading"
                ? "trader-cta"
                : post.category === "ai_behavior"
                ? "woyuduin-cta"
                : "book-cta";
            const attribution = {
              article: slug,
              vertical: post.category || "uncategorized",
              position: ctaPosition as
                | "trader-cta"
                | "woyuduin-cta"
                | "book-cta",
              offer: cta.primaryLabel,
            };
            return (
              <aside className="mt-14 pt-8 border-t border-[var(--rule)] max-w-[64ch]">
                <p className="eyebrow eyebrow-mark mb-3">{cta.eyebrow}</p>
                <h3 className="serif text-[1.625rem] md:text-[1.875rem] leading-[1.15] mb-3">
                  <TrackedLink
                    href={cta.titleHref}
                    {...linkProps}
                    className="link-ink"
                    attribution={attribution}
                  >
                    {cta.title}
                  </TrackedLink>
                </h3>
                <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed mb-4">
                  {cta.body}
                </p>
                <p className="flex items-baseline gap-x-5 flex-wrap">
                  <TrackedLink
                    href={cta.primaryHref}
                    {...linkProps}
                    className="link-red text-[1.0625rem] font-medium"
                    attribution={attribution}
                  >
                    {cta.primaryLabel}
                  </TrackedLink>
                  <span className="meta">
                    {cta.secondary.prefix}{" "}
                    <a href={cta.secondary.href} className="link-ink">
                      {cta.secondary.label}
                    </a>
                  </span>
                </p>
              </aside>
            );
          })()}

          {post.tags.length > 0 && (
            <div className="mt-14 pt-8 border-t border-[var(--rule)] max-w-[64ch]">
              <p className="eyebrow eyebrow-mark mb-3">Tagged</p>
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="meta">#{tag.toLowerCase().replace(/\s+/g, "-")}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Inline subscribe block */}
        <div className="page-max-wide mt-20 pt-14 border-t border-[var(--rule)]">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-7">
              <p className="eyebrow eyebrow-mark mb-3">Get this in your inbox</p>
              <h2 className="serif text-[1.875rem] md:text-[2.25rem] leading-[1.15] mb-3">
                One email a month. Zero noise.
              </h2>
              <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed measure-tight">
                The Dispatch — the month&apos;s biggest AI stories, written long. Free.
              </p>
            </div>
            <div className="md:col-span-5">
              <EmailCapture source={`article-${slug}`} cta="Subscribe — free" />
            </div>
          </div>
        </div>

        {/* Prev/Next within same category — topic-cluster navigation */}
        {(prevInCategory || nextInCategory) && (
          <nav
            className="page-max-wide mt-20 pt-14 border-t border-[var(--rule)] grid md:grid-cols-2 gap-8"
            aria-label="Article navigation within category"
          >
            <div>
              {prevInCategory && (
                <Link href={`/blog/${prevInCategory.slug}`} className="block group no-underline">
                  <p className="meta italic mb-1">← Previous in {post.category.replace(/_/g, " ")}</p>
                  <p className="serif text-[1.25rem] leading-[1.2] group-hover:text-[var(--accent)] transition-colors">
                    {prevInCategory.title}
                  </p>
                </Link>
              )}
            </div>
            <div className="md:text-right">
              {nextInCategory && (
                <Link href={`/blog/${nextInCategory.slug}`} className="block group no-underline">
                  <p className="meta italic mb-1">Next in {post.category.replace(/_/g, " ")} →</p>
                  <p className="serif text-[1.25rem] leading-[1.2] group-hover:text-[var(--accent)] transition-colors">
                    {nextInCategory.title}
                  </p>
                </Link>
              )}
            </div>
          </nav>
        )}

        {/* More articles (category-aware) */}
        {more.length > 0 && (
          <div className="page-max-wide mt-20 pt-14 border-t border-[var(--rule)]">
            <p className="eyebrow eyebrow-mark mb-3">{moreFromCategoryLabel}</p>
            <span className="draw-rule mb-8 block" aria-hidden="true" />
            <ol className="list-none p-0 m-0">
              {more.map((p, i) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="index-row no-underline">
                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="source">{(p.category || "Article").replace(/_/g, " ")}</span>
                    <span className="title">{p.title}</span>
                    <span className="when tabular">
                      {new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        )}
      </article>

      <Footer />
    </main>
  );
}
