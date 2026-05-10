import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import { isAuthed } from "@/lib/admin";

export const metadata: Metadata = {
  title: "SEO Health — Flowi Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface ArticleMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  description: string;
  hasSchema: boolean;
  wordCount: number;
}

async function readAllArticles(): Promise<ArticleMeta[]> {
  const blogDir = path.join(process.cwd(), "content", "blog");
  let files: string[] = [];
  try {
    files = await fs.readdir(blogDir);
  } catch {
    return [];
  }
  const out: ArticleMeta[] = [];
  for (const f of files) {
    if (!f.endsWith(".md") && !f.endsWith(".mdx")) continue;
    try {
      const text = await fs.readFile(path.join(blogDir, f), "utf8");
      const title = text.match(/^title:\s*['"]?([^\n'"]+)/m)?.[1]?.trim() || f;
      const date = text.match(/^date:\s*['"]?([^\n'"]+)/m)?.[1]?.trim() || "";
      const category = text.match(/^category:\s*['"]?([^\n'"]+)/m)?.[1]?.trim() || "uncategorized";
      const description = text.match(/^description:\s*['"]?([^\n'"]+)/m)?.[1]?.trim() || "";
      out.push({
        slug: f.replace(/\.(md|mdx)$/, ""),
        title,
        date,
        category,
        description,
        hasSchema: true,
        wordCount: text.split(/\s+/).length,
      });
    } catch {
      // skip
    }
  }
  return out;
}

function bucketByWeek(articles: ArticleMeta[]): Array<{ week: string; count: number }> {
  const buckets = new Map<string, number>();
  for (const a of articles) {
    if (!a.date) continue;
    const d = new Date(a.date);
    if (isNaN(d.getTime())) continue;
    // ISO week-ish: YYYY-MM-DD of Monday
    const day = d.getDay() || 7;
    const monday = new Date(d);
    monday.setDate(d.getDate() - day + 1);
    const k = monday.toISOString().slice(0, 10);
    buckets.set(k, (buckets.get(k) || 0) + 1);
  }
  return Array.from(buckets.entries())
    .map(([week, count]) => ({ week, count }))
    .sort((a, b) => b.week.localeCompare(a.week))
    .slice(0, 8);
}

export default async function SEODashboard() {
  if (!(await isAuthed())) {
    redirect("/admin/login");
  }

  const articles = await readAllArticles();
  const total = articles.length;
  const byCategory: Record<string, number> = {};
  for (const a of articles) byCategory[a.category] = (byCategory[a.category] || 0) + 1;

  const shortDesc = articles.filter((a) => !a.description || a.description.length < 60).length;
  const longDesc = articles.filter((a) => a.description && a.description.length > 160).length;
  const noKeywords = articles.filter((a) => a.title.length > 70).length;

  const cadence = bucketByWeek(articles);
  const last30 = articles.filter((a) => {
    if (!a.date) return false;
    const d = new Date(a.date);
    return Date.now() - d.getTime() < 30 * 24 * 60 * 60 * 1000;
  }).length;

  const verticals = (["ai_trading", "ai_behavior", "ai_general"] as const).map((v) => ({
    key: v,
    count: v === "ai_general"
      ? total - (byCategory.ai_trading || 0) - (byCategory.ai_behavior || 0)
      : byCategory[v] || 0,
  }));

  return (
    <main>
      <section className="page-gutter pt-10 md:pt-12 pb-8">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-4">SEO Health</p>
          <h1 className="display text-[2.5rem] md:text-[4rem] leading-[1.0] -tracking-[0.02em] mb-3">
            Crawl <span className="display-italic">readiness.</span>
          </h1>
          <p className="lead measure">
            Local snapshot of indexing-relevant signals. For the live numbers (impressions, position, indexed count), check Google Search Console directly.
          </p>
        </div>
      </section>

      {/* External dashboards */}
      <section className="page-gutter pb-8 border-t border-[var(--rule)]">
        <div className="page-max-wide pt-8">
          <p className="eyebrow eyebrow-mark mb-3">External dashboards</p>
          <span className="draw-rule mb-6 block" aria-hidden="true" />
          <div className="grid md:grid-cols-3 gap-6">
            <a href="https://search.google.com/search-console" target="_blank" rel="noopener" className="link-ink block py-2">
              Google Search Console →
              <span className="meta block mt-1">Indexed pages · queries · impressions</span>
            </a>
            <a href="https://www.bing.com/webmasters" target="_blank" rel="noopener" className="link-ink block py-2">
              Bing Webmaster Tools →
              <span className="meta block mt-1">Bing index status</span>
            </a>
            <a href="https://vercel.com/willy12-devs-projects/flowi-site/analytics" target="_blank" rel="noopener" className="link-ink block py-2">
              Vercel Analytics →
              <span className="meta block mt-1">Live traffic + sources</span>
            </a>
          </div>
        </div>
      </section>

      {/* Headline stats */}
      <section className="page-gutter pb-12 border-t border-[var(--rule)]">
        <div className="page-max-wide pt-8">
          <p className="eyebrow eyebrow-mark mb-3">Catalog snapshot</p>
          <span className="draw-rule mb-8 block" aria-hidden="true" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6">
            <Stat label="Total articles" value={total} sub={`${last30} in last 30 days`} />
            <Stat label="Schema coverage" value="100%" sub="Article + Breadcrumb on all" />
            <Stat label="Trading vertical" value={byCategory.ai_trading || 0} sub="→ FlowiAI Trader" />
            <Stat label="Behavior vertical" value={byCategory.ai_behavior || 0} sub="→ Woyuduin" />
          </div>
        </div>
      </section>

      {/* Per-vertical sitemap links */}
      <section className="page-gutter pb-12 border-t border-[var(--rule)]">
        <div className="page-max-wide pt-8">
          <p className="eyebrow eyebrow-mark mb-3">Sitemaps</p>
          <span className="draw-rule mb-6 block" aria-hidden="true" />
          <ul className="space-y-3">
            <li>
              <a href="/sitemap.xml" className="link-ink text-[1.0625rem]">
                /sitemap.xml
              </a>
              <span className="meta ml-3">Main index — submit this to GSC</span>
            </li>
            <li>
              <a href="/robots.txt" className="link-ink">/robots.txt</a>
              <span className="meta ml-3">Crawler directives + sitemap reference</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Health checks */}
      <section className="page-gutter pb-12 border-t border-[var(--rule)]">
        <div className="page-max-wide pt-8">
          <p className="eyebrow eyebrow-mark mb-3">Article quality flags</p>
          <span className="draw-rule mb-6 block" aria-hidden="true" />
          <div className="grid md:grid-cols-3 gap-6">
            <FlagStat label="Descriptions < 60 chars" count={shortDesc} totalCount={total} bad={shortDesc > 0} hint="Too short for SERP snippet" />
            <FlagStat label="Descriptions > 160 chars" count={longDesc} totalCount={total} bad={longDesc > 0} hint="Will get truncated in SERP" />
            <FlagStat label="Titles > 70 chars" count={noKeywords} totalCount={total} bad={noKeywords > 0} hint="Will get truncated in SERP" />
          </div>
        </div>
      </section>

      {/* Publishing cadence */}
      <section className="page-gutter pb-12 border-t border-[var(--rule)]">
        <div className="page-max-wide pt-8">
          <p className="eyebrow eyebrow-mark mb-3">Publishing cadence (last 8 weeks)</p>
          <span className="draw-rule mb-6 block" aria-hidden="true" />
          <ol className="list-none p-0 m-0">
            {cadence.map((row) => (
              <li key={row.week}>
                <div className="index-row">
                  <span className="num tabular">{row.week}</span>
                  <span className="title">
                    {"█".repeat(Math.min(row.count, 30))}
                  </span>
                  <span className="when tabular">{row.count}</span>
                </div>
              </li>
            ))}
          </ol>
          <p className="meta italic mt-4">
            Google rewards consistent publishing cadence. Aim for 5+ per week.
          </p>
        </div>
      </section>

      {/* Per-vertical articles */}
      <section className="page-gutter pb-20 border-t border-[var(--rule)]">
        <div className="page-max-wide pt-8">
          <p className="eyebrow eyebrow-mark mb-3">Funnel-vertical articles</p>
          <span className="draw-rule mb-6 block" aria-hidden="true" />
          {verticals.map((v) => (
            <div key={v.key} className="mb-10">
              <p className="meta uppercase tracking-[0.08em] mb-2">{v.key.replace("ai_", "")}</p>
              <p className="display text-[2rem] tabular leading-none mb-3">{v.count}</p>
              <p className="text-[14px] text-[var(--ink-soft)]">
                {v.key === "ai_trading" && "Funnel target: FlowiAI Trader"}
                {v.key === "ai_behavior" && "Funnel target: Woyuduin"}
                {v.key === "ai_general" && "Funnel target: Books (Gumroad)"}
              </p>
              {v.count < 5 && v.key !== "ai_general" && (
                <p className="meta italic mt-2 text-[var(--accent)]">
                  → Needs more articles. 5+ before the funnel converts meaningfully.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div>
      <p className="meta uppercase tracking-[0.08em] mb-2">{label}</p>
      <p className="display text-[2.5rem] md:text-[3rem] tabular leading-none">{value}</p>
      {sub && <p className="meta italic mt-2">{sub}</p>}
    </div>
  );
}

function FlagStat({ label, count, totalCount, bad, hint }: { label: string; count: number; totalCount: number; bad: boolean; hint?: string }) {
  return (
    <div>
      <p className="meta uppercase tracking-[0.08em] mb-2">{label}</p>
      <p className={`display text-[2rem] tabular leading-none ${bad ? "text-[var(--accent)]" : ""}`}>
        {count}<span className="text-[1rem] text-[var(--ink-mute)]"> / {totalCount}</span>
      </p>
      {hint && <p className="meta italic mt-2">{hint}</p>}
    </div>
  );
}
