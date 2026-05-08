import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';

export const metadata: Metadata = {
  title: 'About — Flowi AI Intelligence',
  description:
    'Flowi is a small editorial publisher covering the AI ecosystem. Daily brief on what shipped, monthly dispatch on what mattered, occasional deep-dive books for builders.',
  alternates: { canonical: 'https://useflowi.app/about' },
};

export default function AboutPage() {
  return (
    <main className="bg-[var(--bg)] text-[var(--ink)]">
      <Nav />

      {/* Manifesto hero */}
      <section className="page-gutter pt-16 md:pt-24 pb-20 md:pb-24">
        <div className="page-max">
          <p className="eyebrow eyebrow-mark mb-10">About</p>
          <h1 className="display text-[3rem] sm:text-[4.5rem] md:text-[6.5rem] leading-[0.96]">
            One person plus<br />
            a <span className="display-italic">content engine.</span>
          </h1>
          <p className="lead mt-10 measure">
            Flowi is a small editorial publisher covering the AI ecosystem. We watch the releases, the new skills, the open-source bravado — and turn what&apos;s happening into a daily brief, a monthly dispatch, and the occasional deep-dive book.
          </p>
        </div>
      </section>

      {/* Hero illustration */}
      <section className="page-gutter pt-4 pb-12">
        <div className="page-max-wide">
          <div className="relative aspect-[3/2] w-full bg-[var(--bg-elevated)]">
            <Image
              src="/images/about_hero.png"
              alt="A draftsman's desk with pencil, ruler, and folded paper."
              fill
              priority
              className="object-cover"
              sizes="(min-width: 768px) 90vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* Three layers */}
      <section className="page-gutter pt-20 md:pt-28 pb-20 md:pb-28 border-t border-[var(--rule)]">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-3">Three layers, one signal</p>
          <span className="draw-rule mb-12" aria-hidden="true" />

          <div className="grid md:grid-cols-3 gap-12 md:gap-10">
            {LAYERS.map((l) => (
              <div key={l.title}>
                <p className="serif text-[1.25rem] tabular text-[var(--ink-mute)] mb-2">{l.no}</p>
                <h3 className="serif text-[1.5rem] md:text-[1.75rem] leading-[1.15] mb-3">{l.title}</h3>
                <p className="meta mb-3">{l.tag}</p>
                <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed">{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it's built */}
      <section className="page-gutter pt-20 md:pt-28 pb-20 md:pb-28 border-t border-[var(--rule)]">
        <div className="page-max">
          <p className="eyebrow eyebrow-mark mb-8">How it&apos;s built</p>
          <h2 className="display text-[2rem] md:text-[3rem] leading-[1.05] -tracking-[0.02em] mb-10 measure">
            Built in public. Type-led. Honest about the tools we use.
          </h2>

          <div className="space-y-7 text-[1.0625rem] md:text-[1.125rem] text-[var(--ink-soft)] leading-relaxed measure">
            <p>
              Twenty AI sources are scanned every two hours. A flagship-aware ranker sorts every new release. A daily packager composes the Top&nbsp;10. A course factory watches GitHub for trending repos worth deep-diving.
            </p>
            <p>
              AI helps every step — drafting, formatting, generating cover art. But every claim is checked, every code sample is run, every pattern is named after a real production system. We use the tools we cover.
            </p>
            <p className="text-[var(--ink)]">
              The bar:
            </p>
          </div>

          <blockquote className="display-italic text-[1.875rem] md:text-[2.5rem] leading-[1.15] -tracking-[0.015em] mt-10 max-w-[28ch] border-l-2 border-[var(--accent)] pl-7 py-2">
            If you could ask Claude this and get the same answer, the book gets rewritten until you can&apos;t.
          </blockquote>
        </div>
      </section>

      {/* The operating thesis */}
      <section className="page-gutter pt-20 md:pt-28 pb-20 md:pb-28 border-t border-[var(--rule)]">
        <div className="page-max">
          <p className="eyebrow eyebrow-mark mb-8">The operating thesis</p>
          <h2 className="display text-[2rem] md:text-[3rem] leading-[1.05] -tracking-[0.02em] mb-10 measure">
            We are not a news site.
          </h2>
          <p className="lead measure mb-10">
            We&apos;re a technical intelligence product company. The blog is free sampling. The dispatch is a lead magnet. The books are the product. The library pass is the business. Editorial judgment is the moat.
          </p>

          <ol className="list-decimal pl-6 space-y-3 marker:font-semibold marker:text-[var(--accent)] text-[1.0625rem] md:text-[1.125rem] text-[var(--ink-soft)] leading-relaxed measure">
            <li>Detect what serious builders care about.</li>
            <li>Explain it faster than anyone else.</li>
            <li>Package the implementation into paid books.</li>
            <li>Convert readers into library customers.</li>
            <li>Repeat every week.</li>
          </ol>
        </div>
      </section>

      {/* Why this exists */}
      <section className="page-gutter pt-20 md:pt-28 pb-20 md:pb-28 border-t border-[var(--rule)]">
        <div className="page-max">
          <p className="eyebrow eyebrow-mark mb-8">Why this exists</p>
          <div className="space-y-7 text-[1.0625rem] md:text-[1.125rem] text-[var(--ink-soft)] leading-relaxed measure">
            <p>
              The AI ecosystem moves too fast for any one person to track casually. Three months from now, half the tools on every &ldquo;top 10&rdquo; list today will be obsolete or absorbed. The people shipping AI products in production need a continuously-updated map — not a one-time survey.
            </p>
            <p>
              The brief and the dispatch stay free because the editorial work should be a public good. The books are paid because writing a 4,500-word deep-dive with running code costs us a day each — and an honest specialty deserves an honest price. No subscriptions, no upsell ladders, no &ldquo;limited time&rdquo; nonsense.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-gutter pt-20 md:pt-28 pb-12 border-t border-[var(--rule)]">
        <div className="page-max max-w-3xl">
          <p className="eyebrow eyebrow-mark mb-5">Start here</p>
          <h2 className="display text-[2rem] md:text-[2.75rem] leading-[1.05] mb-4">
            Free Dispatch. <span className="display-italic">No commitment.</span>
          </h2>
          <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed measure mb-10">
            Drop your email and the May edition arrives in 90 seconds. Each first of the month, you get the next. Unsubscribe anytime — no &ldquo;wait don&apos;t leave us&rdquo; sequence.
          </p>
          <p>
            <Link href="/dispatch" className="link-red text-[1.0625rem]">
              Get The Dispatch →
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

const LAYERS = [
  {
    no: '№01',
    tag: 'Daily · 06:00 UTC',
    title: 'AI Daily Brief',
    body: 'Top 10 every morning. Six fixed flagships, four dynamic trending products. Auto-published. A 2-minute read.',
  },
  {
    no: '№02',
    tag: 'Monthly · Free',
    title: 'The Dispatch',
    body: 'Ten editorial pieces on the month’s biggest releases, skills, and arguments. Long-form, written, not aggregated.',
  },
  {
    no: '№03',
    tag: 'Weekly · Paid',
    title: 'Books',
    body: '5-chapter, 4,000+ word, code-first guides on production patterns. New title every week.',
  },
];
