import type { Metadata } from "next";
import { getAllPosts, getCategories } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — AI Tools, Strategies & Guides",
  description:
    "Practical guides on using AI for business, automation, coding, and content creation. Updated daily.",
  alternates: { canonical: "https://useflowi.app/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getCategories();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="text-4xl font-bold text-foreground mb-3">Blog</h1>
          <p className="text-muted text-lg mb-10">
            AI tools, strategies, and step-by-step guides. Updated daily.
          </p>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              <Link
                href="/blog"
                className="rounded-full bg-blue/10 px-4 py-1.5 text-sm text-blue-light hover:bg-blue/20 transition-colors"
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/blog/category/${cat.toLowerCase()}`}
                  className="rounded-full bg-surface px-4 py-1.5 text-sm text-muted hover:bg-surface-light transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}

          {posts.length === 0 ? (
            <p className="text-muted text-center py-20">
              No posts yet. Check back soon.
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
