import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import EmailCapture from "@/components/site/EmailCapture";
import { getPostsByCategory } from "@/lib/blog";

export const metadata: Metadata = {
  title: "FlowiAI Trader — institutional-grade algo trading",
  description:
    "ICT methodology + multi-agent risk validation + 5 trading modes. Forex, crypto, stocks, indices. Built for traders who care about month four, not just the first backtest.",
  alternates: { canonical: "https://useflowi.app/trader" },
  openGraph: {
    title: "FlowiAI Trader — institutional-grade algo trading",
    description:
      "ICT methodology + multi-agent risk validation + 5 trading modes. Built for traders who care about month four.",
    type: "website",
    url: "https://useflowi.app/trader",
    siteName: "Flowi",
  },
};

export default function TraderPage() {
  const tradingPosts = getPostsByCategory("ai_trading").slice(0, 4);

  return (
    <main className="bg-[var(--bg)] text-[var(--ink)]">
      <Nav />

      {/* Hero */}
      <section className="page-gutter pt-16 md:pt-24 pb-12">
        <div className="page-max">
          <p className="eyebrow eyebrow-mark mb-10">FlowiAI Trader · Launching Q3 2026</p>
          <h1 className="display text-[3rem] sm:text-[4.5rem] md:text-[6rem] leading-[0.96] -tracking-[0.025em]">
            The trading system <br />
            for <span className="display-italic">month&nbsp;four.</span>
          </h1>
          <p className="lead mt-10 measure">
            Institutional-grade algorithmic trading built on ICT methodology and multi-agent risk validation. Forex, crypto, stocks, indices — across every major platform. Engineered to survive the regime shift retail systems break on.
          </p>
        </div>
      </section>

      {/* The architecture */}
      <section className="page-gutter pt-12 md:pt-16 pb-20 md:pb-24 border-t border-[var(--rule)]">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-3">The architecture</p>
          <span className="draw-rule mb-12" aria-hidden="true" />

          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {PILLARS.map((p) => (
              <div key={p.title}>
                <p className="serif text-[1.25rem] tabular text-[var(--ink-mute)] mb-2">{p.no}</p>
                <h3 className="serif text-[1.625rem] md:text-[1.875rem] leading-[1.15] mb-3">{p.title}</h3>
                <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The 5 modes */}
      <section className="page-gutter pt-16 md:pt-20 pb-16 md:pb-20 border-t border-[var(--rule)]">
        <div className="page-max">
          <p className="eyebrow eyebrow-mark mb-8">The 5 trading modes</p>
          <h2 className="display text-[2rem] md:text-[3rem] leading-[1.05] -tracking-[0.02em] mb-10 measure">
            Automatic transitions. <span className="display-italic">One-directional under stress.</span>
          </h2>
          <p className="lead measure mb-10">
            The system drops to a more defensive mode the moment drawdown thresholds trigger. It only returns to aggressive after <em>sustained</em> recovery — not after one good day. That asymmetry is the whole point.
          </p>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--rule)]">
                <th className="meta uppercase tracking-[0.08em] py-3 pr-6">Mode</th>
                <th className="meta uppercase tracking-[0.08em] py-3 pr-6">Trigger</th>
                <th className="meta uppercase tracking-[0.08em] py-3">Behavior</th>
              </tr>
            </thead>
            <tbody>
              {MODES.map((m) => (
                <tr key={m.name} className="border-b border-[var(--rule)] align-top">
                  <td className="serif text-[1.0625rem] py-4 pr-6 font-medium">{m.name}</td>
                  <td className="text-[1rem] text-[var(--ink-soft)] py-4 pr-6">{m.trigger}</td>
                  <td className="text-[1rem] text-[var(--ink-soft)] py-4">{m.behavior}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Email capture */}
      <section className="page-gutter pt-20 md:pt-28 pb-20 md:pb-28 border-t border-[var(--rule)]">
        <div className="page-max">
          <p className="eyebrow eyebrow-mark mb-5">Launch list · Q3 2026</p>
          <h2 className="display text-[2rem] md:text-[3rem] leading-[1.05] -tracking-[0.02em] mb-6">
            First access. <span className="display-italic">Founding pricing.</span>
          </h2>
          <p className="lead measure mb-10">
            Drop your email and you&apos;ll be on the launch list. When FlowiAI Trader opens to early users, you&apos;ll get access first — and at founding pricing, not retail. Roughly one update per month leading up to launch. Unsubscribe anytime.
          </p>
          <div className="max-w-md">
            <EmailCapture source="trader-landing" cta="Get on the launch list" />
          </div>
        </div>
      </section>

      {/* Editorial — articles on the methodology */}
      {tradingPosts.length > 0 && (
        <section className="page-gutter pt-20 md:pt-28 pb-20 md:pb-28 border-t border-[var(--rule)]">
          <div className="page-max-wide">
            <p className="eyebrow eyebrow-mark mb-3">Read the methodology</p>
            <span className="draw-rule mb-10 block" aria-hidden="true" />
            <p className="lead measure mb-10">
              Editorial coverage of the trading patterns FlowiAI Trader is built on. The full archive lives in the <Link href="/blog/category/ai_trading" className="link-red">trading vertical</Link>.
            </p>
            <ol className="list-none p-0 m-0">
              {tradingPosts.map((p, i) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="index-row no-underline">
                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="source">trading</span>
                    <span className="title">{p.title}</span>
                    <span className="when tabular">
                      {new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

const PILLARS = [
  {
    no: "№01",
    title: "ICT-first market structure",
    body: "Order blocks, fair value gaps, liquidity sweeps — the institutional concepts retail platforms paper over. Multi-timeframe confluence across D1 / H4 / H1 before any setup qualifies. Single-timeframe ICT is noise; the system filters for the 3-5 setups per week with real structural weight.",
  },
  {
    no: "№02",
    title: "Multi-agent risk validation",
    body: "Before any trade executes, three agents have to agree. A strategy agent checks the setup. A risk agent checks position sizing against current account state. A psychology agent checks for over-trading patterns. If any block, the trade doesn't happen. Single-agent systems blow up at the regime shift; this doesn't.",
  },
  {
    no: "№03",
    title: "5 trading modes with one-way transitions",
    body: "Aggressive → Normal → Cautious → Defensive → Preservation. The system can drop to a more defensive mode anytime. It can only return to aggressive after sustained recovery — not one good day. The asymmetry defends against grinding losing streaks more than against single bad days.",
  },
  {
    no: "№04",
    title: "Hard drawdown circuit breakers",
    body: "5% drawdown → no new positions. 8% → close all positions, lock the account for 24 hours. 12% → lock until a human authenticates and explicitly re-enables. The trader doesn't get to override the bot during the storm. That's the entire point.",
  },
];

const MODES = [
  { name: "Aggressive",   trigger: "Account at high water mark, edge confirmed",   behavior: "Full sizing, multiple concurrent trades, all setups taken" },
  { name: "Normal",       trigger: "No drawdown, mixed signals",                   behavior: "Standard sizing, A and B grade setups only" },
  { name: "Cautious",     trigger: "Drawdown 3–5%, choppy regime",                 behavior: "Half sizing, A grade setups only" },
  { name: "Defensive",    trigger: "Drawdown 5–8% or 3 losing days in a row",      behavior: "Quarter sizing, manage existing positions, no new entries" },
  { name: "Preservation", trigger: "Drawdown 8%+",                                 behavior: "Close all, lock trading until manual re-enable" },
];
