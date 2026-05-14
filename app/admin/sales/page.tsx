import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthed } from "@/lib/admin";
import { getSalesSnapshot, fmtUsd } from "@/lib/gumroad";

export const metadata: Metadata = {
  title: "Sales — Flowi Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

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

function maskEmail(email: string): string {
  const [u, d] = email.split("@");
  if (!d) return email;
  return `${u.slice(0, 2)}…@${d}`;
}

export default async function SalesDashboard() {
  if (!(await isAuthed())) {
    redirect("/admin/login");
  }

  let snapshot;
  let fatalError: string | null = null;
  try {
    snapshot = await getSalesSnapshot();
  } catch (e) {
    fatalError = (e as Error).message;
  }

  return (
    <main>
      {/* Masthead */}
      <section className="page-gutter pt-10 md:pt-12 pb-8">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-4">Gumroad sales · auto-refreshes on every load</p>
          <h1 className="display text-[2.5rem] md:text-[4rem] leading-[1.0] -tracking-[0.02em] mb-3">
            What&apos;s <span className="display-italic">converting.</span>
          </h1>
          <p className="lead measure">
            Live pull from Gumroad. Total revenue, last-24h spike, last-7d cadence,
            per-product breakdown, referrer mix, last 25 sales.
          </p>
        </div>
      </section>

      {fatalError && (
        <section className="page-gutter pb-12 border-t border-[var(--accent)]">
          <div className="page-max-wide pt-8">
            <p className="eyebrow eyebrow-mark mb-3 text-[var(--accent)]">⚠ Cannot reach Gumroad</p>
            <p className="text-[1rem] text-[var(--ink-soft)] leading-relaxed mb-4 measure">
              {fatalError}
            </p>
            <p className="meta italic">
              Fix: add <span className="tabular">GUMROAD_ACCESS_TOKEN</span> to Vercel production env vars:
            </p>
            <pre className="text-[13px] bg-[var(--bg-elevated)] border-l-2 border-[var(--accent)] p-4 mt-3 overflow-x-auto whitespace-pre-wrap">
{`# in C:\\Users\\User\\flowi-site
printf "your-token-here" | vercel env add GUMROAD_ACCESS_TOKEN production
git commit --allow-empty -m "trigger deploy for GUMROAD_ACCESS_TOKEN"
git push`}
            </pre>
          </div>
        </section>
      )}

      {snapshot && !fatalError && (
        <>
          {/* Headline stats */}
          <section className="page-gutter pb-12 border-t border-[var(--rule)]">
            <div className="page-max-wide pt-8">
              <p className="eyebrow eyebrow-mark mb-3">All-time</p>
              <span className="draw-rule mb-8 block" aria-hidden="true" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6">
                <Stat label="Total revenue" value={fmtUsd(snapshot.totalRevenueCents)} sub={`${snapshot.totalSales} sales`} />
                <Stat label="Last 24 h" value={fmtUsd(snapshot.last24h.revenueCents)} sub={`${snapshot.last24h.count} sales`} accent={snapshot.last24h.count > 0} />
                <Stat label="Last 7 d" value={fmtUsd(snapshot.last7d.revenueCents)} sub={`${snapshot.last7d.count} sales`} accent={snapshot.last7d.count > 0} />
                <Stat label="Products" value={snapshot.products.length} sub={`${snapshot.products.filter((p) => p.published).length} live`} />
              </div>
            </div>
          </section>

          {/* By product */}
          <section className="page-gutter pb-12 border-t border-[var(--rule)]">
            <div className="page-max-wide pt-8">
              <p className="eyebrow eyebrow-mark mb-3">By product</p>
              <span className="draw-rule mb-8 block" aria-hidden="true" />
              {snapshot.byProduct.length === 0 ? (
                <p className="meta italic py-8">No products on Gumroad yet.</p>
              ) : (
                <ol className="list-none p-0 m-0">
                  {snapshot.byProduct.map((p, i) => (
                    <li key={p.id}>
                      <div className="index-row">
                        <span className="num">{String(i + 1).padStart(2, "0")}</span>
                        <span className="title">{p.name}</span>
                        <span className="when tabular">
                          {p.sales} sales · {fmtUsd(p.revenueCents)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </section>

          {/* By referrer */}
          <section className="page-gutter pb-12 border-t border-[var(--rule)]">
            <div className="page-max-wide pt-8">
              <p className="eyebrow eyebrow-mark mb-3">Where buyers came from (last 30d)</p>
              <span className="draw-rule mb-8 block" aria-hidden="true" />
              {snapshot.byReferrer.length === 0 ? (
                <p className="meta italic py-8">No sales in the last 30 days.</p>
              ) : (
                <ol className="list-none p-0 m-0">
                  {snapshot.byReferrer.map((r, i) => (
                    <li key={r.source}>
                      <div className="index-row">
                        <span className="num">{String(i + 1).padStart(2, "0")}</span>
                        <span className="title">{r.source}</span>
                        <span className="when tabular">{r.count}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </section>

          {/* Recent sales */}
          <section className="page-gutter pb-20 border-t border-[var(--rule)]">
            <div className="page-max-wide pt-8">
              <p className="eyebrow eyebrow-mark mb-3">Last 25 sales</p>
              <span className="draw-rule mb-8 block" aria-hidden="true" />
              {snapshot.recentSales.length === 0 ? (
                <p className="meta italic py-8">No recent sales yet.</p>
              ) : (
                <ol className="list-none p-0 m-0">
                  {snapshot.recentSales.map((s, i) => (
                    <li key={s.id}>
                      <div className="index-row">
                        <span className="num">{String(i + 1).padStart(2, "0")}</span>
                        <span className="source">{maskEmail(s.email)}</span>
                        <span className="title">{s.product_name} — {fmtUsd(s.price)}</span>
                        <span className="when tabular">{fmtTime(s.created_at)}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </section>

          {snapshot.errors.length > 0 && (
            <section className="page-gutter pb-20 border-t border-[var(--rule)]">
              <div className="page-max-wide pt-8">
                <p className="eyebrow eyebrow-mark mb-3 text-[var(--accent)]">Errors</p>
                <ul className="list-disc pl-6 space-y-2 text-[0.9375rem] text-[var(--ink-soft)]">
                  {snapshot.errors.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}

function Stat({ label, value, sub, accent }: { label: string; value: number | string; sub?: string; accent?: boolean }) {
  return (
    <div>
      <p className="meta uppercase tracking-[0.08em] mb-2">{label}</p>
      <p className={`display text-[2.5rem] md:text-[3rem] tabular leading-none ${accent ? "text-[var(--accent)]" : ""}`}>
        {value}
      </p>
      {sub && <p className="meta italic mt-2">{sub}</p>}
    </div>
  );
}
