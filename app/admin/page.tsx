import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  isAuthed,
  getSystemState,
  getRecentScrapes,
  getRecentArticles,
  VERTICALS,
  type Vertical,
} from "@/lib/admin";

export const metadata: Metadata = {
  title: "Admin — Flowi",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const VERTICAL_LABEL: Record<Vertical, string> = {
  ai_general: "AI General → Books",
  ai_trading: "Trading → FlowiAI Trader",
  ai_behavior: "Behavior → Woyuduin",
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  const now = Date.now();
  const diff = now - d.getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  if (min < 60 * 24) return `${Math.floor(min / 60)}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function AdminDashboard() {
  if (!(await isAuthed())) {
    redirect("/admin/login");
  }

  const [state, scrapes, articles] = await Promise.all([
    getSystemState(),
    getRecentScrapes(10),
    getRecentArticles(8),
  ]);

  return (
    <main>
      {/* Masthead */}
      <section className="page-gutter pt-10 md:pt-12 pb-8">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-4">
            Newsroom · {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
          <h1 className="display text-[2.5rem] md:text-[4rem] leading-[1.0] -tracking-[0.02em] mb-3">
            What&apos;s <span className="display-italic">in motion.</span>
          </h1>
          <p className="lead measure">
            Three verticals, one editorial line. Drop links, the system scrapes them, you process the batch into platform variants.
          </p>
        </div>
      </section>

      {/* Stat grid */}
      <section className="page-gutter pb-12 md:pb-16 border-t border-[var(--rule)]">
        <div className="page-max-wide pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6">
            <Stat label="Articles published" value={state.totalArticles} sub={`across ${Object.keys(state.articles).length} categories`} />
            <Stat label="Scrapes in queue" value={state.totalScrapes} sub={state.flowiLeadsAvailable ? "FlowiLeads connected" : "FlowiLeads OFFLINE"} sublineAccent={!state.flowiLeadsAvailable} />
            <Stat label="Books" value={state.books.live} sub={`${state.books.inProduction} in production`} />
            <Stat label="Subscribers" value={state.subscribers} sub="Dispatch list" />
          </div>
        </div>
      </section>

      {/* Vertical breakdown */}
      <section className="page-gutter pb-12 md:pb-16 border-t border-[var(--rule)]">
        <div className="page-max-wide pt-8">
          <p className="eyebrow eyebrow-mark mb-3">Per-vertical pipeline</p>
          <span className="draw-rule mb-8 block" aria-hidden="true" />

          <div className="grid md:grid-cols-3 gap-8">
            {VERTICALS.map((v) => {
              const articleCount =
                v === "ai_general"
                  ? Object.entries(state.articles)
                      .filter(([k]) => !["ai_trading", "ai_behavior"].includes(k))
                      .reduce((s, [, n]) => s + n, 0)
                  : state.articles[v] || 0;
              return (
                <article key={v} className="border-l-2 border-[var(--rule)] pl-5">
                  <p className="meta uppercase tracking-[0.08em] mb-2">{VERTICAL_LABEL[v]}</p>
                  <p className="display text-[2.5rem] tabular leading-none mb-3">
                    {state.scrapes[v]}
                  </p>
                  <p className="meta italic mb-1">scrapes queued</p>
                  <p className="text-[14px] text-[var(--ink-soft)]">
                    {articleCount} {articleCount === 1 ? "article" : "articles"} live
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent scrapes */}
      <section className="page-gutter pb-12 md:pb-16 border-t border-[var(--rule)]">
        <div className="page-max-wide pt-8">
          <div className="flex items-end justify-between mb-3">
            <p className="eyebrow eyebrow-mark">Recent scrapes</p>
            <Link href="/admin/scrape" className="link-red text-[14px]">
              Drop a link →
            </Link>
          </div>
          <span className="draw-rule mb-8 block" aria-hidden="true" />

          {scrapes.length === 0 ? (
            <p className="meta italic py-8">No scrapes yet. <Link href="/admin/scrape" className="link-ink">Submit your first link →</Link></p>
          ) : (
            <ol className="list-none p-0 m-0">
              {scrapes.map((s, i) => (
                <li key={s.path}>
                  <div className="index-row">
                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="source">{s.vertical.replace("ai_", "")}</span>
                    <span className="title">
                      {s.author ? <span className="meta">@{s.author} </span> : null}
                      {s.note || s.filename.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "")}
                    </span>
                    <span className="when tabular">{fmtTime(s.modified)}</span>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* Recent articles */}
      <section className="page-gutter pb-20 md:pb-28 border-t border-[var(--rule)]">
        <div className="page-max-wide pt-8">
          <div className="flex items-end justify-between mb-3">
            <p className="eyebrow eyebrow-mark">Latest articles</p>
            <Link href="/blog" className="link-ink text-[14px]">All →</Link>
          </div>
          <span className="draw-rule mb-8 block" aria-hidden="true" />

          <ol className="list-none p-0 m-0">
            {articles.map((a, i) => (
              <li key={a.slug}>
                <Link href={`/blog/${a.slug}`} className="index-row no-underline">
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="source">{a.category || "uncategorized"}</span>
                  <span className="title">{a.title || a.slug}</span>
                  <span className="when tabular">
                    {a.date ? new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : fmtTime(a.modified)}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  sub,
  sublineAccent,
}: {
  label: string;
  value: number | string;
  sub?: string;
  sublineAccent?: boolean;
}) {
  return (
    <div>
      <p className="meta uppercase tracking-[0.08em] mb-2">{label}</p>
      <p className="display text-[3rem] md:text-[3.5rem] tabular leading-none">
        {value}
      </p>
      {sub && (
        <p
          className={`meta italic mt-2 ${
            sublineAccent ? "text-[var(--accent)]" : ""
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
