import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs, getAllPosts, markdownToHtml } from "@/lib/blog";
import BlogPostContent from "@/components/BlogPost";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import EmailCapture from "@/components/site/EmailCapture";
import Link from "next/link";

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

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `https://useflowi.app/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author || "Flowi Editorial"],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const htmlContent = await markdownToHtml(post.content);
  const readTime = Math.max(1, Math.ceil(post.wordCount / 200));

  // Three more articles for the bottom rail
  const more = getAllPosts().filter((p) => p.slug !== slug).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Flowi" },
    publisher: {
      "@type": "Organization",
      name: "Flowi",
      url: "https://useflowi.app",
    },
    mainEntityOfPage: `https://useflowi.app/blog/${slug}`,
    keywords: post.keywords.join(", "),
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

        <div className="page-max">
          <div className="mb-8">
            <Link href="/blog" className="meta hover:text-[var(--accent)]">← Daily AI</Link>
          </div>

          <header className="mb-12 pb-12 border-b border-[var(--rule)]">
            <p className="eyebrow eyebrow-mark mb-6">
              {post.category ? post.category.replace(/_/g, " ") : "Article"} ·{" "}
              <span className="tabular">{dateLong}</span> ·{" "}
              <span className="tabular">{readTime} min read</span>
            </p>

            <h1 className="display text-[2.25rem] sm:text-[3rem] md:text-[4.25rem] leading-[1.02] mb-6">
              {post.title}
            </h1>

            {post.description && (
              <p className="lead measure">{post.description}</p>
            )}
          </header>

          <BlogPostContent htmlContent={htmlContent} />

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

        {/* More articles */}
        {more.length > 0 && (
          <div className="page-max-wide mt-20 pt-14 border-t border-[var(--rule)]">
            <p className="eyebrow eyebrow-mark mb-3">More from Daily AI</p>
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
