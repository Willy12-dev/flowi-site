import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import EmailCapture from "@/components/site/EmailCapture";

export const metadata: Metadata = {
  title: "Launch week — three field guides at $9 each (until Sunday)",
  description:
    "We just published three editorial field guides — trading, behavior change, and AI builders. $9 each through Sunday, then $14 each. The honest reason to buy now is the price moves.",
  alternates: { canonical: "https://useflowi.app/launch" },
  openGraph: {
    title: "Launch week — three field guides at $9 (until Sunday)",
    description:
      "Trading, behavior change, AI builders. Three editorial field guides at launch pricing through Sunday.",
    type: "website",
    url: "https://useflowi.app/launch",
    siteName: "Flowi",
  },
};

interface Guide {
  no: string;
  title: string;
  pitch: string;
  proofs: string[];
  url: string;
  audience: string;
}

const GUIDES: Guide[] = [
  {
    no: "№01",
    title: "The Algo Trader's Playbook",
    pitch:
      "Why retail algo trading systems blow up at month four — and the architecture that survives. Four essays. The patterns institutional desks use. The lies backtests can't simulate. The platforms that actually deliver versus the ones that don't.",
    proofs: [
      "~5,500 words, four essays, one weekend",
      "Names six specific failure modes most retail builds skip",
      "Honest comparison of TradeStation, NinjaTrader, MultiCharts, QuantConnect, TradingView, FlowiAI Trader",
    ],
    url: "https://flowi.gumroad.com/l/algo-traders-playbook",
    audience: "Retail traders who hit drawdown they can't survive. Builders shipping AI trading bots.",
  },
  {
    no: "№02",
    title: "The Behavior Change Playbook",
    pitch:
      "Why most recovery apps fail at month three — and the relapse-aware architecture that works. Four essays. The Abstinence Violation Effect. The discipline-app paradox (more apps → worse outcomes). The apps actually built on Marlatt's research.",
    proofs: [
      "~5,500 words, four essays, one sitting",
      "Names the single cognitive distortion that destroys 70% of recovery attempts",
      "Honest comparison of Habitica, Streaks, Brick, Fortify, Woyuduin",
    ],
    url: "https://flowi.gumroad.com/l/behavior-change-playbook",
    audience: "Anyone fighting a compulsive habit who has tried 3+ apps and watched them fail. Builders working on habit, focus, or recovery products.",
  },
  {
    no: "№03",
    title: "The AI Builder's Field Guide",
    pitch:
      "What shipped in AI this month — and what the production patterns mean if you're building agents. Four essays. The triage shift Mozilla just published. OpenAI's vetted-defender tier. What actually shipped at Code w/ Claude 2026. The books worth reading.",
    proofs: [
      "~5,500 words, four essays, one weekend",
      "Names the bottleneck pattern across every production-grade AI system right now",
      "Honest review of Huyen, Pai, Alammar — and the gap none of them fills",
    ],
    url: "https://flowi.gumroad.com/l/ai-builders-field-guide",
    audience: "Engineers shipping AI agents to production this year. CTOs choosing where to invest engineering hours.",
  },
];

export default function LaunchPage() {
  return (
    <main className="bg-[var(--bg)] text-[var(--ink)]">
      <Nav />

      {/* Hero */}
      <section className="page-gutter pt-12 md:pt-20 pb-12 md:pb-16">
        <div className="page-max">
          <p className="eyebrow eyebrow-mark mb-8">
            Launch week · prices move Sunday at midnight UTC
          </p>
          <h1 className="display text-[3rem] sm:text-[4.5rem] md:text-[6rem] leading-[0.96] -tracking-[0.025em]">
            Three field guides. <br />
            <span className="display-italic">$9 each.</span>
          </h1>
          <p className="lead mt-10 measure">
            We just published three editorial field guides — one each for traders, for people doing behavior change, and for AI builders. Each is the compiled, curated, offline-readable version of work originally published free on the blog. Each is ~5,500 words across four essays.
          </p>
          <p className="lead measure mt-6">
            Launch pricing is <strong>$9</strong> through Sunday. From Monday they go to <strong>$14</strong> permanently. The honest reason to buy now is the price moves — not a fake countdown, the real announced change.
          </p>
        </div>
      </section>

      {/* The three guides */}
      <section className="page-gutter pb-16 md:pb-20 border-t border-[var(--rule)]">
        <div className="page-max-wide pt-12">
          <p className="eyebrow eyebrow-mark mb-3">The three</p>
          <span className="draw-rule mb-12" aria-hidden="true" />

          {GUIDES.map((g) => (
            <article
              key={g.no}
              className="grid grid-cols-[3.5rem,1fr,auto] gap-x-6 gap-y-4 items-baseline pb-12 mb-12 border-b border-[var(--rule)] last:border-b-0 last:mb-0"
            >
              <span className="serif text-[1.625rem] tabular text-[var(--ink-mute)]">{g.no}</span>
              <div>
                <h2 className="serif text-[1.75rem] md:text-[2.25rem] leading-[1.1] -tracking-[0.015em] mb-4">
                  <a href={g.url} target="_blank" rel="noopener" className="link-ink">
                    {g.title}
                  </a>
                </h2>
                <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed measure mb-5">
                  {g.pitch}
                </p>
                <ul className="list-none pl-0 m-0 mb-5 space-y-1">
                  {g.proofs.map((p) => (
                    <li key={p} className="text-[1rem] text-[var(--ink-soft)] leading-relaxed pl-6 relative">
                      <span className="absolute left-0 top-0 text-[var(--accent)]">—</span>
                      {p}
                    </li>
                  ))}
                </ul>
                <p className="meta italic">For: {g.audience}</p>
              </div>
              <div className="text-right whitespace-nowrap">
                <span className="serif text-[2rem] tabular block leading-none">$9</span>
                <span className="meta italic mt-1 mb-3 block">
                  <s>$14</s> through Sunday
                </span>
                <a
                  href={g.url}
                  target="_blank"
                  rel="noopener"
                  className="link-red text-[1.0625rem] font-medium"
                >
                  Get it →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Founder's note */}
      <section className="page-gutter pt-16 md:pt-20 pb-16 md:pb-20 border-t border-[var(--rule)]">
        <div className="page-max">
          <p className="eyebrow eyebrow-mark mb-8">A note from the desk</p>
          <h2 className="display text-[2rem] md:text-[3rem] leading-[1.05] -tracking-[0.02em] mb-10 measure">
            Why launch pricing, why a real change.
          </h2>
          <div className="space-y-7 text-[1.0625rem] md:text-[1.125rem] text-[var(--ink-soft)] leading-relaxed measure">
            <p>
              These field guides exist because the essays inside them were good enough that several readers asked for a downloadable, ad-free, offline version. The compilation work — typesetting, layout, editorial pass, PDF rendering, hero images — took a real week. $9 is calibrated for the value of the curation work, not the cost.
            </p>
            <p>
              The price moves to $14 on Monday because it&apos;s an honest reflection of what the next batch of readers will pay once the launch attention fades. Early buyers help validate that the format works and pay back the production week. That&apos;s the deal, plain.
            </p>
            <p>
              Every page on this site, including this one, is hand-written and hand-edited. No content mills, no AI-generated filler, no scraped summaries. If you buy one of these and it doesn&apos;t deliver what you came for, send the receipt and a one-line note to <a href="mailto:hello@useflowi.app" className="link-red">hello@useflowi.app</a> and we refund — no form, no hoops.
            </p>
          </div>
        </div>
      </section>

      {/* Bundle pricing (for those who want all 3) */}
      <section className="page-gutter pt-16 md:pt-20 pb-16 md:pb-20 border-t border-[var(--rule)]">
        <div className="page-max">
          <p className="eyebrow eyebrow-mark mb-5">Reading all three</p>
          <h2 className="display text-[2rem] md:text-[2.75rem] leading-[1.05] -tracking-[0.02em] mb-6">
            $27 for the set.
          </h2>
          <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed measure mb-8">
            Some readers will sit at the intersection of all three (the trader working on focus, the AI builder thinking about their habits). For them: just buy all three above. $27 total. The set covers about 16,500 words of curated work across the three domains, one weekend per guide.
          </p>
          <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed measure mb-10">
            No combined-bundle SKU yet — the simplest version is three individual purchases. Saves us writing more code; saves you waiting for it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {GUIDES.map((g) => (
              <a
                key={g.no}
                href={g.url}
                target="_blank"
                rel="noopener"
                className="block border-l-2 border-[var(--rule)] pl-4 hover:border-[var(--accent)] transition-colors"
              >
                <p className="meta uppercase tracking-[0.08em] mb-2">{g.no}</p>
                <p className="serif text-[1.125rem] leading-tight mb-2">{g.title}</p>
                <p className="link-red text-[14px]">Get it →</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Email capture for those not buying today */}
      <section className="page-gutter pt-16 md:pt-20 pb-20 md:pb-28 border-t border-[var(--rule)]">
        <div className="page-max">
          <p className="eyebrow eyebrow-mark mb-5">Not buying today?</p>
          <h2 className="display text-[2rem] md:text-[2.75rem] leading-[1.05] -tracking-[0.02em] mb-6">
            Get the free monthly Dispatch.
          </h2>
          <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed measure mb-10">
            Once a month, ten editorial pieces on what shipped in AI and the patterns that matter — trading, behavior, builders. Free. The next edition lands on the first of the month.
          </p>
          <div className="max-w-md">
            <EmailCapture source="launch-page" cta="Subscribe — free" />
          </div>
          <p className="meta italic mt-8">
            Or <Link href="/blog" className="link-red">read what we&apos;ve already published</Link> — the essays in the guides are individually available there, free.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
