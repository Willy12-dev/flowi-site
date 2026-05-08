import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';

export const metadata: Metadata = {
  title: 'Books — Flowi AI Intelligence',
  description:
    'Opinionated, code-first deep-dives on AI patterns that ship in production. Each book is 4,000+ words, with code samples for Claude, GPT, Gemini, and local models.',
  alternates: { canonical: 'https://useflowi.app/courses' },
};

interface Book {
  number: string;
  title: string;
  subtitle: string;
  blurb: string;
  price: string;
  url: string;
  meta: string;
  status: 'live' | 'coming';
}

const BOOKS: Book[] = [
  {
    number: '№01',
    title: 'Agent Memory: The 5 Patterns That Ship in Production',
    subtitle: 'The decision tree, the code, and the failure modes nobody warns you about.',
    blurb:
      'Most AI agent demos fail at message four because the agent forgets the user. Five chapters covering the four axes of agent memory, the five production patterns with copy-paste-ready code, and the five failure modes nobody warns you about.',
    price: '$19',
    url: 'https://flowi.gumroad.com/l/sqqhvm',
    meta: '5 chapters · 4,500 words · Python · Claude / GPT / Gemini compatible',
    status: 'live',
  },
];

export default function CoursesPage() {
  return (
    <main className="bg-[var(--bg)] text-[var(--ink)]">
      <Nav />

      {/* Hero */}
      <section className="page-gutter pt-16 md:pt-24 pb-16 md:pb-20">
        <div className="page-max">
          <p className="eyebrow eyebrow-mark mb-10">Books — In Print</p>
          <h1 className="display text-[3rem] sm:text-[4.5rem] md:text-[6rem] leading-[0.96]">
            For builders who <br />
            <span className="display-italic">ship&nbsp;AI</span> in production.
          </h1>
          <p className="lead mt-10 measure">
            Opinionated, code-first deep-dives on the patterns that actually work in production. Each book is 4,000+ words with code samples for Claude, GPT, Gemini, and local models — plus the failure modes nobody else writes about.
          </p>
          <p className="meta mt-8 italic">A new title ships every Monday morning at 06:00 UTC.</p>
        </div>
      </section>

      {/* Editorial type interlude (no image — type-as-image per spec) */}
      <section className="page-gutter pt-4 pb-16 md:pb-20">
        <div className="page-max">
          <p className="display-italic text-[1.5rem] md:text-[2rem] leading-[1.25] text-[var(--ink-soft)] measure-tight">
            Each book is one weekend of reading, one Monday of shipping.
          </p>
        </div>
      </section>

      {/* The shelf (Index treatment) */}
      <section className="page-gutter pt-20 md:pt-28 pb-20 md:pb-28 border-t border-[var(--rule)]">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-3">The Shelf</p>
          <span className="draw-rule mb-12" aria-hidden="true" />

          {BOOKS.map((b) => (
            <article
              key={b.number}
              className="grid grid-cols-[3.5rem,1fr,auto] gap-x-6 gap-y-3 items-baseline pb-10 border-b border-[var(--rule)] mb-10 last:mb-0"
            >
              <span className="serif text-[1.5rem] tabular text-[var(--ink-mute)]">{b.number}</span>
              <div>
                <h2 className="serif text-[1.875rem] md:text-[2.5rem] leading-[1.05] -tracking-[0.015em] mb-3">
                  {b.status === 'live' ? (
                    <a href={b.url} target="_blank" rel="noopener" className="link-ink">{b.title}</a>
                  ) : (
                    b.title
                  )}
                </h2>
                <p className="lead measure mb-3">{b.subtitle}</p>
                <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed measure mb-4">{b.blurb}</p>
                <p className="meta">{b.meta}</p>
              </div>
              <div className="text-right whitespace-nowrap">
                <span className="serif text-[1.5rem] tabular block">{b.price}</span>
                {b.status === 'live' ? (
                  <a href={b.url} target="_blank" rel="noopener" className="link-red text-[14px] mt-1 inline-block">
                    Read it →
                  </a>
                ) : (
                  <span className="meta mt-1 inline-block italic">In production</span>
                )}
              </div>
            </article>
          ))}

          <div className="grid grid-cols-[3.5rem,1fr,auto] gap-x-6 gap-y-3 items-baseline opacity-60">
            <span className="serif text-[1.5rem] tabular text-[var(--ink-mute)]">№02</span>
            <div>
              <h2 className="serif text-[1.5rem] leading-[1.1] mb-2 italic text-[var(--ink-soft)]">
                In production — ships Monday
              </h2>
              <p className="meta">Topic locked Sunday. Subscribe to be notified.</p>
            </div>
            <div className="text-right">
              <span className="meta italic">soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial aside */}
      <section className="page-gutter pt-20 md:pt-28 pb-20 md:pb-28 border-t border-[var(--rule)]">
        <div className="page-max">
          <span className="rule-red block w-60 mx-auto" />
          <blockquote className="aside mt-10">
            &ldquo;If you could ask Claude this and get the same answer, the book gets rewritten until you can&apos;t.&rdquo;
          </blockquote>
          <p className="eyebrow eyebrow-mark text-center mt-10">Editorial Standard</p>
          <span className="rule-red block w-60 mx-auto mt-10" />
        </div>
      </section>

      {/* Lead magnet upsell */}
      <section className="page-gutter pt-20 md:pt-28 pb-12 border-t border-[var(--rule)]">
        <div className="page-max max-w-3xl">
          <p className="eyebrow eyebrow-mark mb-5">Not buying yet?</p>
          <h2 className="display text-[2rem] md:text-[2.75rem] leading-[1.05] mb-4">
            Start with <span className="display-italic">the Dispatch.</span>
          </h2>
          <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed measure mb-8">
            Free monthly long-form on the AI ecosystem. Ten editorial pieces — the releases, skills, and arguments that moved this month. Refreshed every month, sent to your inbox. Cancel with one click.
          </p>
          <p>
            <Link href="/dispatch" className="link-red text-[1.0625rem]">
              Get the free Dispatch →
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
