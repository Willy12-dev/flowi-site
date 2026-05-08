'use client';

import Link from 'next/link';
import Image from 'next/image';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';
import EmailCapture from '@/components/site/EmailCapture';
import { getTodaysBrief } from '@/lib/today';

export default function HomeView() {
  const brief = getTodaysBrief();
  return (
    <main className="bg-[var(--bg)] text-[var(--ink)]">
      <Nav />
      <Hero />
      <DailyIndex brief={brief} />
      <AtlasSpread />
      <EditorialAside />
      <BookShelf />
      <Mission />
      <Subscribe />
      <Footer />
    </main>
  );
}

/* ─── HERO ─────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="page-gutter pt-20 md:pt-32 pb-24 md:pb-36">
      <div className="page-max">
        <p className="eyebrow eyebrow-mark mb-10 md:mb-14">
          Flowi · AI Intelligence · Issue 09 · May&nbsp;9, 2026
        </p>

        <h1 className="display hero-headline text-[3.75rem] sm:text-[5rem] md:text-[7rem] leading-[0.96] -tracking-[0.025em]">
          The signal layer<br />
          for <span className="marker">AI&nbsp;builders</span>.
        </h1>

        <p className="lead mt-10 measure">
          Twenty AI company blogs. Hacker News. Product Hunt. The major GitHub trending feeds. Distilled every morning into one usable map of what shipped, what matters, and which tools you actually need to evaluate this week.
        </p>

        <div className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-4">
          <Link href="/atlas" className="link-red text-[1.0625rem] font-medium">
            Subscribe&nbsp;—&nbsp;free →
          </Link>
          <Link href="/courses" className="link-ink text-[1.0625rem]">
            Read the books
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── DAILY INDEX (the move) ───────────────────────────────── */
function DailyIndex({ brief }: { brief: ReturnType<typeof getTodaysBrief> }) {
  return (
    <section className="page-gutter pt-20 md:pt-28 pb-20 md:pb-28 border-t border-[var(--rule)]">
      <div className="page-max-wide">
        <div className="flex items-end justify-between mb-3">
          <p className="eyebrow eyebrow-mark">The Daily Brief — {brief.edition_label}</p>
          <Link href="/blog" className="link-ink text-[14px] hidden sm:inline">View archive →</Link>
        </div>
        <span className="draw-rule mb-10" aria-hidden="true" />

        <ol className="list-none p-0 m-0">
          {brief.items.map((it) => (
            <li key={it.rank}>
              <a href={it.href} target="_blank" rel="noopener" className="index-row no-underline">
                <span className="num">{String(it.rank).padStart(2, '0')}</span>
                <span className="source">{it.source}</span>
                <span className="title">{it.headline}</span>
                <span className="when tabular">{it.when}</span>
              </a>
            </li>
          ))}
        </ol>

        <p className="meta mt-8 italic">Compiled at 06:00 UTC. Refreshed every morning.</p>
      </div>
    </section>
  );
}

/* ─── ATLAS SPREAD (lead magnet) ───────────────────────────── */
function AtlasSpread() {
  return (
    <section className="page-gutter pt-20 md:pt-28 pb-20 md:pb-28 border-t border-[var(--rule)]">
      <div className="page-max-wide grid md:grid-cols-12 gap-10 md:gap-14 items-start">
        <div className="md:col-span-5">
          <div className="relative aspect-[4/5] w-full bg-[var(--bg-elevated)]">
            <Image
              src="/images/atlas_book.png"
              alt="A leather-bound notebook resting on warm paper, with a red bookmark ribbon."
              fill
              priority
              className="object-cover"
              sizes="(min-width: 768px) 40vw, 92vw"
            />
          </div>
        </div>

        <div className="md:col-span-7 md:pt-4">
          <p className="eyebrow eyebrow-mark mb-4">The Atlas · Free · Monthly</p>
          <h2 className="serif text-[2.25rem] md:text-[2.625rem] leading-[1.1] mb-6">
            A monthly index of every AI tool worth your evaluation hour.
          </h2>
          <p className="lead mb-4 measure-tight">
            50+ curated entries across 10 chapters: frontier LLMs, agent frameworks, memory infrastructure, image and video gen, the production tooling layer.
          </p>
          <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed measure-tight mb-8">
            Refreshed every month. The Atlas is what we&apos;d send to a friend who asked &ldquo;what should I be looking at?&rdquo; It stays free because the brief should be a public good. Subscribe and the first edition arrives in your inbox in 90&nbsp;seconds.
          </p>

          <EmailCapture
            source="home-atlas"
            headline=""
            subline=""
            cta="Send me the Atlas"
            redirectTo="/atlas"
            className="!max-w-md"
          />
        </div>
      </div>
    </section>
  );
}

/* ─── EDITORIAL ASIDE ──────────────────────────────────────── */
function EditorialAside() {
  return (
    <section className="page-gutter pt-24 md:pt-32 pb-24 md:pb-32 border-t border-[var(--rule)]">
      <div className="page-max">
        <span className="rule-red block w-60 mx-auto" />
        <blockquote className="aside mt-10">
          &ldquo;If you could ask Claude this and get the same answer, the book gets rewritten until you can&apos;t.&rdquo;
        </blockquote>
        <p className="eyebrow eyebrow-mark text-center mt-10">Flowi Editorial Standard</p>
        <span className="rule-red block w-60 mx-auto mt-10" />
      </div>
    </section>
  );
}

/* ─── BOOK SHELF (courses) ─────────────────────────────────── */
function BookShelf() {
  return (
    <section className="page-gutter pt-20 md:pt-28 pb-20 md:pb-28 border-t border-[var(--rule)]">
      <div className="page-max-wide">
        <div className="flex items-end justify-between mb-3">
          <p className="eyebrow eyebrow-mark">Books — In Print</p>
          <Link href="/courses" className="link-ink text-[14px] hidden sm:inline">All books →</Link>
        </div>
        <span className="draw-rule mb-12" aria-hidden="true" />

        <article className="grid grid-cols-[3rem,1fr,auto] gap-x-6 gap-y-3 items-baseline pb-10 border-b border-[var(--rule)]">
          <span className="serif text-[1.5rem] tabular text-[var(--ink-mute)]">№01</span>
          <div>
            <h3 className="serif text-[1.875rem] md:text-[2.5rem] leading-[1.05] -tracking-[0.015em] mb-2">
              <a href="https://flowi.gumroad.com/l/sqqhvm" target="_blank" rel="noopener" className="link-ink">
                Agent Memory: The 5 Patterns That Ship in Production
              </a>
            </h3>
            <p className="lead measure mb-3">
              The decision tree, the code, and the failure modes nobody warns you about.
            </p>
            <p className="meta">5 chapters · 4,500 words · Python · Claude / GPT / Gemini compatible</p>
          </div>
          <div className="text-right">
            <span className="serif text-[1.5rem] tabular block">$19</span>
            <a href="https://flowi.gumroad.com/l/sqqhvm" target="_blank" rel="noopener" className="link-red text-[14px] mt-1 inline-block">
              Read it →
            </a>
          </div>
        </article>

        <p className="meta italic mt-8">More titles in production. The next book ships Monday morning, 06:00 UTC.</p>
      </div>
    </section>
  );
}

/* ─── MISSION ──────────────────────────────────────────────── */
function Mission() {
  return (
    <section className="page-gutter pt-24 md:pt-36 pb-24 md:pb-36 border-t border-[var(--rule)]">
      <div className="page-max">
        <p className="eyebrow eyebrow-mark mb-8">Why this exists</p>
        <h2 className="display text-[2.25rem] md:text-[3.25rem] leading-[1.05] -tracking-[0.02em] measure">
          The AI ecosystem moves too fast for any one person to track casually. Three months from now, half of today&apos;s tools will be obsolete or absorbed.
        </h2>
        <p className="lead mt-10 measure">
          Builders shipping in production need a continuously-updated map — not a one-time survey. That&apos;s the job. Flowi is that job, productized.
        </p>
        <p className="mt-6">
          <Link href="/about" className="link-red text-[1.0625rem]">
            Read the full standard →
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ─── SUBSCRIBE ────────────────────────────────────────────── */
function Subscribe() {
  return (
    <section className="page-gutter pt-20 md:pt-28 pb-12 border-t border-[var(--rule)]">
      <div className="page-max max-w-2xl text-center">
        <p className="eyebrow eyebrow-mark mb-5">Stay on the list</p>
        <h2 className="display text-[2rem] md:text-[2.75rem] leading-[1.05] -tracking-[0.02em] mb-4">
          One email a month. <span className="display-italic">Zero noise.</span>
        </h2>
        <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed mb-9 measure mx-auto">
          The new Atlas edition plus the most consequential AI development we tracked that month. Unsubscribe anytime — no &ldquo;wait don&apos;t leave&rdquo; sequence.
        </p>
        <div className="mx-auto max-w-md">
          <EmailCapture source="home-subscribe" headline="" subline="" cta="Subscribe — free" />
        </div>
      </div>
    </section>
  );
}
