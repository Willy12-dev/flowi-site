import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getCategories } from "@/lib/blog";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Daily AI Brief — Flowi",
  description:
    "Daily editorial coverage of the AI ecosystem. Releases, frameworks, skills, arguments. Updated every morning.",
  alternates: { canonical: "https://useflowi.app/blog" },
};

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function groupByMonth(posts: ReturnType<typeof getAllPosts>) {
  const groups = new Map<string, typeof posts>();
  for (const p of posts) {
    const d = new Date(p.date);
    const key = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  }
  return Array.from(groups.entries());
}

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getCategories();
  const grouped = groupByMonth(posts);

  return (
    <main className="bg-[var(--bg)] text-[var(--ink)]">
      <Nav />

      {/* Manifesto hero */}
      <section className="page-gutter pt-16 md:pt-24 pb-12">
        <div className="page-max">
          <p className="eyebrow eyebrow-mark mb-10">Daily AI · Updated every morning</p>
          <h1 className="display text-[3rem] sm:text-[4.5rem] md:text-[6rem] leading-[0.96]">
            What shipped <br />
            <span className="display-italic">in&nbsp;AI</span>, written down.
          </h1>
          <p className="lead mt-10 measure">
            Daily editorial coverage of the AI ecosystem. Releases, frameworks, skills, arguments. {posts.length}&nbsp;articles in the archive.
          </p>
        </div>
      </section>

      {/* Categories filter */}
      {categories.length > 0 && (
        <section className="page-gutter pb-8">
          <div className="page-max-wide flex flex-wrap items-baseline gap-x-5 gap-y-3 border-y border-[var(--rule)] py-4">
            <p className="eyebrow">Filter</p>
            <Link href="/blog" className="text-[14px] text-[var(--ink)] hover:text-[var(--accent)]">All</Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/blog/category/${cat.toLowerCase()}`}
                className="text-[14px] text-[var(--ink-soft)] hover:text-[var(--accent)]"
              >
                {cat.replace(/_/g, " ")}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Date-grouped Index */}
      <section className="page-gutter pb-24">
        <div className="page-max-wide">
          {posts.length === 0 ? (
            <p className="meta text-center py-20 italic">No articles yet. The first edition lands at 06:00 UTC tomorrow.</p>
          ) : (
            grouped.map(([month, monthPosts]) => (
              <div key={month} className="mb-14">
                <p className="eyebrow eyebrow-mark mb-3">{month}</p>
                <span className="draw-rule mb-8 block" aria-hidden="true" />
                <ol className="list-none p-0 m-0">
                  {monthPosts.map((p, i) => (
                    <li key={p.slug}>
                      <Link href={`/blog/${p.slug}`} className="index-row no-underline">
                        <span className="num">{String(i + 1).padStart(2, "0")}</span>
                        <span className="source">{(p.category || "Article").replace(/_/g, " ")}</span>
                        <span className="title">{p.title}</span>
                        <span className="when tabular">{fmt(p.date)}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            ))
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
