import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthed } from "@/lib/admin";
import { promises as fs } from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "News engine — Flowi Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

interface NewsEngineState {
  seen: string[];
  last_run: string | null;
  last_run_count: number;
  last_run_items: Array<{
    id: string;
    title: string;
    source: string;
    url: string;
    vertical: string;
    topic: string;
  }>;
  total_drafted: number;
}

interface DraftedSpec {
  filename: string;
  id: string;
  title?: string;
  vertical?: string;
  topic?: string;
  modified: string;
}

async function loadState(): Promise<NewsEngineState | null> {
  try {
    const p = path.join(process.cwd(), "content", "news-engine-state.json");
    const text = await fs.readFile(p, "utf8");
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function listDraftedSpecs(limit = 30): Promise<DraftedSpec[]> {
  const dir = path.join(process.cwd(), "content", "carousel-specs");
  try {
    const files = (await fs.readdir(dir)).filter((f) =>
      f.startsWith("news-")
    );
    const out: DraftedSpec[] = [];
    for (const f of files) {
      try {
        const full = path.join(dir, f);
        const stat = await fs.stat(full);
        const json = JSON.parse(await fs.readFile(full, "utf8"));
        out.push({
          filename: f,
          id: json.id ?? f.replace(/\.json$/, ""),
          title: json.title,
          vertical: json.vertical,
          topic: json.topic,
          modified: stat.mtime.toISOString(),
        });
      } catch {
        // skip
      }
    }
    out.sort((a, b) => b.modified.localeCompare(a.modified));
    return out.slice(0, limit);
  } catch {
    return [];
  }
}

function timeAgo(iso: string): string {
  const d = new Date(iso);
  const min = Math.floor((Date.now() - d.getTime()) / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  if (min < 60 * 24) return `${Math.floor(min / 60)}h ago`;
  return `${Math.floor(min / (60 * 24))}d ago`;
}

export default async function NewsEngineAdmin() {
  if (!(await isAuthed())) redirect("/admin/login");

  const [state, drafted] = await Promise.all([loadState(), listDraftedSpecs()]);

  return (
    <main>
      <section className="page-gutter pt-10 md:pt-12 pb-8">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-4">
            News engine · the autonomous content brain
          </p>
          <h1 className="display text-[2.5rem] md:text-[4rem] leading-[1.0] -tracking-[0.02em] mb-3">
            What it&apos;s <span className="display-italic">drafting.</span>
          </h1>
          <p className="lead measure">
            Daily at 06:00 UTC, GitHub Actions polls 18 AI / AI-company RSS
            feeds. Claude writes a complete publication-ready CarouselSpec
            for each fresh item. Drafts land here, ready to review in{" "}
            <Link href="/admin/studio" className="link-ink">
              the studio
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Headline stats */}
      <section className="page-gutter pb-12 border-t border-[var(--rule)]">
        <div className="page-max-wide pt-8">
          <p className="eyebrow eyebrow-mark mb-3">Last run</p>
          <span className="draw-rule mb-8 block" aria-hidden="true" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6">
            <Stat
              label="Last ran"
              value={state?.last_run ? timeAgo(state.last_run) : "never"}
              sub={state?.last_run ?? "waiting for first cron tick"}
              accent={!!state?.last_run}
            />
            <Stat
              label="Drafted last run"
              value={state?.last_run_count ?? 0}
              sub="carousels"
              accent={(state?.last_run_count ?? 0) > 0}
            />
            <Stat
              label="Total ever"
              value={state?.total_drafted ?? 0}
              sub="carousels drafted"
            />
            <Stat
              label="URLs deduped"
              value={state?.seen.length ?? 0}
              sub="seen across all runs"
            />
          </div>
        </div>
      </section>

      {/* Last-run items detail */}
      {state?.last_run_items && state.last_run_items.length > 0 && (
        <section className="page-gutter pb-12 border-t border-[var(--rule)]">
          <div className="page-max-wide pt-8">
            <p className="eyebrow eyebrow-mark mb-3">From the last run</p>
            <span className="draw-rule mb-8 block" aria-hidden="true" />
            <ol className="list-none p-0 m-0">
              {state.last_run_items.map((it, i) => (
                <li key={it.id}>
                  <div className="index-row">
                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="source">
                      [{it.source}] · {it.vertical} · {it.topic}
                    </span>
                    <span className="title">{it.title}</span>
                    <span className="when tabular">
                      <Link
                        href="/admin/studio"
                        className="link-ink text-[14px]"
                      >
                        open →
                      </Link>
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Recent drafts on disk */}
      <section className="page-gutter pb-12 border-t border-[var(--rule)]">
        <div className="page-max-wide pt-8">
          <p className="eyebrow eyebrow-mark mb-3">
            Recent drafts on disk · {drafted.length}
          </p>
          <span className="draw-rule mb-8 block" aria-hidden="true" />
          {drafted.length === 0 ? (
            <p className="meta italic py-8">
              No drafted specs yet. The cron runs daily at 06:00 UTC. To draft
              manually right now:{" "}
              <code className="tabular">
                node scripts/news-engine.mjs --count 3
              </code>
            </p>
          ) : (
            <ol className="list-none p-0 m-0">
              {drafted.map((d, i) => (
                <li key={d.id}>
                  <div className="index-row">
                    <span className="num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="source">
                      {d.vertical ?? "—"} · {d.topic ?? "—"}
                    </span>
                    <span className="title">{d.title ?? d.id}</span>
                    <span className="when tabular">{timeAgo(d.modified)}</span>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <section className="page-gutter pb-20 border-t border-[var(--rule)]">
        <div className="page-max-wide pt-8">
          <p className="eyebrow eyebrow-mark mb-3">How to run manually</p>
          <span className="draw-rule mb-8 block" aria-hidden="true" />
          <pre className="text-[13px] bg-[var(--bg-elevated)] border-l-2 border-[var(--accent)] p-4 overflow-x-auto whitespace-pre-wrap">
            {`# dry run — show what would be drafted, no API call
node scripts/news-engine.mjs --dry

# draft 3 carousels right now (requires ANTHROPIC_API_KEY in .env.local)
node scripts/news-engine.mjs --count 3

# from GitHub UI: Actions → "News Engine — daily AI carousel drafter" → Run workflow`}
          </pre>

          <p className="text-[0.95rem] text-[var(--ink-soft)] mt-6 measure">
            The workflow needs <code className="tabular">ANTHROPIC_API_KEY</code>{" "}
            (required) and <code className="tabular">RESEND_API_KEY</code> +{" "}
            <code className="tabular">OPS_EMAIL_TO</code> (optional, for the
            digest email) set as repo secrets at{" "}
            <Link
              href="https://github.com/Willy12-dev/flowi-site/settings/secrets/actions"
              className="link-ink"
              target="_blank"
            >
              Settings → Secrets → Actions
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: number | string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="meta uppercase tracking-[0.08em] mb-2">{label}</p>
      <p
        className={`display text-[2rem] md:text-[2.5rem] tabular leading-none ${accent ? "text-[var(--accent)]" : ""}`}
      >
        {value}
      </p>
      {sub && <p className="meta italic mt-2 truncate">{sub}</p>}
    </div>
  );
}
