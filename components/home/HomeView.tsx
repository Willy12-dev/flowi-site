'use client';

import Link from 'next/link';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';
import EmailCapture from '@/components/site/EmailCapture';

export default function HomeView() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#0e1335] to-[#06091e] text-white">
      <Nav variant="over-hero" />
      <Hero />
      <ValueBand />
      <FeaturedCourse />
      <Mission />
      <Subscribe />
      <Footer />
    </div>
  );
}

/* ─── HERO ────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative pt-32 md:pt-44 pb-20 md:pb-32 px-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(ellipse_at_25%_30%,rgba(124,58,237,0.30)_0%,transparent_55%),radial-gradient(ellipse_at_80%_60%,rgba(74,123,255,0.22)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:repeating-linear-gradient(135deg,transparent_0_40px,white_40px_41px)]" />

      <div className="relative mx-auto max-w-5xl">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
          <span className="size-1.5 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500" />
          Daily AI Intelligence · Updated Every Morning
        </p>

        <h1 className="font-[var(--font-playfair)] text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.02] tracking-tight">
          The signal layer <br />
          for{' '}
          <span className="bg-gradient-to-br from-cyan-400 via-violet-400 to-violet-600 bg-clip-text text-transparent">
            AI builders
          </span>
          .
        </h1>

        <p className="mt-7 max-w-2xl text-lg md:text-2xl text-white/75 leading-relaxed">
          Twenty official AI company blogs, every major GitHub trending feed, and Hacker News — distilled
          every morning into a usable map of what shipped, what matters, and which tools you actually need
          to evaluate this week.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/atlas"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 px-7 py-4 text-base font-semibold shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:-translate-y-0.5 transition-all"
          >
            Get the free Atlas →
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-7 py-4 text-base font-semibold hover:bg-white/10 transition"
          >
            Browse courses
          </Link>
        </div>

        <p className="mt-7 text-xs text-white/45 uppercase tracking-wider">
          Free monthly atlas · No spam · Unsubscribe anytime
        </p>
      </div>
    </section>
  );
}

/* ─── VALUE BAND ────────────────────────────────────────────── */
function ValueBand() {
  const items = [
    {
      tag: 'Daily',
      title: 'AI Daily Brief',
      body: 'Top 10 AIs every morning — 6 flagships (ChatGPT, Claude, Gemini, Grok, Midjourney, Suno) plus 4 dynamic trending products. Auto-published to the blog every 24h.',
      cta: { href: '/blog', label: "Today's brief →" },
    },
    {
      tag: 'Monthly · Free',
      title: 'The AI Atlas',
      body: '50+ curated AI tools and open-source repos worth evaluating this month, categorized across 10 chapters. Refreshed every month. One email.',
      cta: { href: '/atlas', label: 'Get the Atlas →' },
    },
    {
      tag: 'Weekly · Paid',
      title: 'Deep-dive courses',
      body: 'Code-first 4,000+ word guides on the patterns that ship in production. New course every week, driven by what is actually trending — not what is easy to write about.',
      cta: { href: '/courses', label: 'Browse courses →' },
    },
  ];
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight max-w-2xl mb-12">
          Three layers of AI signal — pick what fits your stack.
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 hover:bg-white/[0.05] hover:border-white/20 transition flex flex-col"
            >
              <span className="text-xs uppercase tracking-[0.18em] font-bold text-cyan-300 mb-3">{it.tag}</span>
              <h3 className="font-[var(--font-playfair)] text-2xl font-bold tracking-tight mb-3">{it.title}</h3>
              <p className="text-sm md:text-base text-white/65 leading-relaxed flex-1">{it.body}</p>
              <Link
                href={it.cta.href}
                className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-cyan-300 hover:text-cyan-200"
              >
                {it.cta.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURED COURSE ────────────────────────────────────────── */
function FeaturedCourse() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.2em] text-white/45 mb-3">Latest course</p>
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-8 md:p-12 grid md:grid-cols-[1fr,auto] gap-10 items-center">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-emerald-400 mb-4">
              ● Live now
            </span>
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-5xl font-extrabold leading-tight tracking-tight max-w-3xl">
              Agent Memory: The 5 Patterns That Ship in Production
            </h2>
            <p className="mt-4 text-base md:text-lg text-white/75 max-w-2xl leading-relaxed">
              Most AI agent demos fail at message four because the agent forgets the user. The decision tree, the code, and the failure modes nobody warns you about. 5 chapters · ~4,500 words.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['ai-agents', 'llm', 'memory', 'rag', 'production'].map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-white/[0.06] border border-white/10 px-3 py-1 text-xs text-white/70"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="text-5xl md:text-6xl font-extrabold bg-gradient-to-br from-cyan-300 to-violet-400 bg-clip-text text-transparent">
              $19
            </div>
            <a
              href="https://flowi.gumroad.com/l/sqqhvm"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 px-7 py-4 text-base font-semibold shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 transition"
            >
              Buy on Gumroad →
            </a>
            <Link href="/courses" className="text-sm text-cyan-300 hover:text-cyan-200">
              All courses →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── MISSION ───────────────────────────────────────────────── */
function Mission() {
  return (
    <section className="px-6 py-20 md:py-28 border-t border-white/5">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-[0.2em] text-white/45 mb-4">How this works</p>
        <h2 className="font-[var(--font-playfair)] text-3xl md:text-5xl font-bold leading-tight tracking-tight">
          Built so the signal compounds, not the noise.
        </h2>
        <div className="mt-10 grid md:grid-cols-2 gap-x-12 gap-y-8 text-white/75 text-base md:text-lg leading-relaxed">
          <div>
            <h3 className="font-bold text-white text-xl mb-2">The pipeline</h3>
            <p>
              Twenty official AI sources are scanned every two hours. A flagship-aware ranker categorizes every release. A daily packager composes the Top 10. A course factory watches GitHub for trending repos worth deep-diving.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white text-xl mb-2">The product</h3>
            <p>
              Each detection becomes either a paragraph in tomorrow&apos;s brief, an entry in the monthly Atlas, or a 5-chapter course on Gumroad. One signal, three depths — pick how deep you want to go.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white text-xl mb-2">The bar</h3>
            <p>
              Every course must pass the &ldquo;could you have asked Claude this and gotten the same thing&rdquo; test. If yes, it gets rewritten until no. Opinions, code, and named patterns from production — not generic explainers.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white text-xl mb-2">The honesty</h3>
            <p>
              Built in public. Failure modes flagged. AI tools used to draft, but every claim checked, every code sample run, every pattern named after a real production system. No spam, no swipe files, no AI-slop.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SUBSCRIBE ──────────────────────────────────────────────── */
function Subscribe() {
  return (
    <section className="px-6 py-20 md:py-28 border-t border-white/5">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-white/45 mb-4">Stay in the loop</p>
        <h2 className="font-[var(--font-playfair)] text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
          One email a month. <span className="bg-gradient-to-br from-cyan-400 to-violet-500 bg-clip-text text-transparent">Zero noise.</span>
        </h2>
        <p className="text-white/65 max-w-xl mx-auto mb-10">
          The new Atlas edition + the most consequential AI development we tracked that month. Unsubscribe anytime — no questions, no &ldquo;wait don&apos;t leave us&rdquo; sequence.
        </p>
        <div className="mx-auto max-w-lg">
          <EmailCapture
            source="home"
            headline=""
            subline=""
            cta="Subscribe"
            redirectTo="/atlas"
          />
        </div>
      </div>
    </section>
  );
}
