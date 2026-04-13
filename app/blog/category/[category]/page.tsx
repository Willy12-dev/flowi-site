import type { Metadata } from "next";
import { getPostsByCategory, getCategories } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.toLowerCase() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const formatted = category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${formatted} — Blog`,
    description: `Articles about ${formatted.toLowerCase()} — practical guides, tools, and strategies.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const posts = getPostsByCategory(category);
  const formatted = category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            href="/blog"
            className="text-sm text-muted hover:text-blue-light transition-colors"
          >
            ← All posts
          </Link>

          <h1 className="text-4xl font-bold text-foreground mt-4 mb-10">
            {formatted}
          </h1>

          {posts.length === 0 ? (
            <p className="text-muted text-center py-20">
              No posts in this category yet.
            </p>
          ) : (
            <div className="grid gap-6">
              {posts.map((post) => (
                <BlogCard
                  key={post.slug}
                  slug={post.slug}
                  title={post.title}
                  description={post.description}
                  date={post.date}
                  category={post.category}
                  tags={post.tags}
                  wordCount={post.wordCount}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
