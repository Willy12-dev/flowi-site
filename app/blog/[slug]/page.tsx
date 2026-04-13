import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs, markdownToHtml } from "@/lib/blog";
import BlogPostContent from "@/components/BlogPost";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
      authors: [post.author],
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-20">
        <article className="mx-auto max-w-3xl px-6">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
          />

          <div className="mb-8">
            <Link
              href="/blog"
              className="text-sm text-muted hover:text-blue-light transition-colors"
            >
              ← Back to blog
            </Link>
          </div>

          <header className="mb-10">
            <div className="flex items-center gap-3 text-sm text-muted mb-4">
              {post.category && (
                <Link
                  href={`/blog/category/${post.category.toLowerCase()}`}
                  className="rounded-full bg-blue/10 px-3 py-1 text-blue-light text-xs font-medium hover:bg-blue/20"
                >
                  {post.category}
                </Link>
              )}
              <span>
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span>{readTime} min read</span>
            </div>

            <h1 className="text-4xl font-bold text-foreground leading-tight">
              {post.title}
            </h1>

            {post.description && (
              <p className="mt-4 text-lg text-muted">{post.description}</p>
            )}
          </header>

          <BlogPostContent htmlContent={htmlContent} />

          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-surface px-3 py-1 text-xs text-muted"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
