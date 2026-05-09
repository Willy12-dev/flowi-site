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
  const lead = posts[0];
  const rest = posts.slice(1);
  const grouped = groupByMonth(rest);

  return (
    <main className="bg-[var(--bg)] text-[var(--ink)]">
      <Nav />

      {/* Masthead — newspaper-style header */}
      <section className="page-gutter pt-12 md:pt-16 pb-6 md:pb-8">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-4">
            Daily AI Brief
            {lead && (
              <>
                {" · "}Latest dispatched{" "}
                <span className="tabular">{fmt(lead.date)}</span>
              </>
            )}
          </p>
          <h1 className="serif text-[1.875rem] md:text-[2.625rem] leading-[1.1] -tracking-[0.01em] mb-4">
            What shipped <span className="display-italic">in&nbsp;AI</span>.
          </h1>
          <p className="meta">
            Updated every morning at 06:00 UTC · {posts.length}&nbsp;articles in the archive
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

      {posts.length === 0 ? (
        <section className="page-gutter pb-24">
          <div className="page-max-wide">
            <p className="meta text-center py-20 italic">No articles yet. The first edition lands at 06:00 UTC tomorrow.</p>
          </div>
        </section>
      ) : (
        <>
          {/* Lead story — most recent gets the bigger treatment */}
          <section className="page-gutter pb-16 md:pb-20 border-b border-[var(--rule)]">
            <div className="page-max-wide">
              <p className="eyebrow eyebrow-mark mb-5">Latest</p>
              <span className="draw-rule mb-10 block" aria-hidden="true" />

              <Link href={`/blog/${lead.slug}`} className="block group no-underline">
                <p className="eyebrow mb-5">
                  {(lead.category || "Article").replace(/_/g, " ")}
                </p>
                <h2 className="display text-[2.75rem] sm:text-[4rem] md:text-[5.5rem] leading-[1.0] -tracking-[0.02em] mb-6 max-w-[20ch] group-hover:text-[var(--accent)] transition-colors duration-200">
                  {lead.title}
                </h2>
                {lead.description && (
                  <p className="lead measure mb-6 text-[var(--ink)]">{lead.description}</p>
                )}
                <p className="meta italic">
                  By{" "}
                  <span className="not-italic font-medium text-[var(--ink)]">
                    {lead.author || "Flowi Editorial"}
                  </span>
                  {" · "}
                  <span className="tabular not-italic">{fmt(lead.date)}</span>
                  {" · "}
                  <span className="link-red not-italic">Read the dispatch →</span>
                </p>
              </Link>
            </div>
          </section>

          {/* Archive — date-grouped Index */}
          {rest.length > 0 && (
            <section className="page-gutter pt-16 md:pt-20 pb-24">
              <div className="page-max-wide">
                <p className="eyebrow eyebrow-mark mb-3">Archive</p>
                <span className="draw-rule mb-10 block" aria-hidden="true" />
                {grouped.map(([month, monthPosts]) => (
                  <div key={month} className="mb-14">
                    <p className="eyebrow mb-3">{month}</p>
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
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <Footer />
    </main>
  );
}
