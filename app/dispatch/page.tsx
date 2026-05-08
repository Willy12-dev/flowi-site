import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';
import EmailCapture from '@/components/site/EmailCapture';

export const metadata: Metadata = {
  title: 'The Dispatch — Flowi AI Intelligence',
  description:
    'A monthly long-form on the AI ecosystem. Editorial coverage of the month\'s biggest releases, skills, and patterns — written, not aggregated. Free.',
  alternates: { canonical: 'https://useflowi.app/dispatch' },
  openGraph: {
    title: 'The Dispatch — Flowi AI Intelligence',
    description: 'Monthly long-form coverage of the AI ecosystem. Free.',
    url: 'https://useflowi.app/dispatch',
  },
};

const GUMROAD_FREE = 'https://flowi.gumroad.com';

export default function DispatchPage() {
  return (
    <main className="bg-[var(--bg)] text-[var(--ink)]">
      <Nav />

      <section className="page-gutter pt-16 md:pt-24 pb-20 md:pb-24">
        <div className="page-max">
          <p className="eyebrow eyebrow-mark mb-10">The Dispatch · Free · Monthly</p>
          <h1 className="display text-[3rem] sm:text-[4.5rem] md:text-[6rem] leading-[0.96]">
            The month in <br />
            <span className="display-italic">AI</span>, written down.
          </h1>
          <p className="lead mt-10 measure">
            A monthly long-form essay on the AI ecosystem. Not a tool directory. Not aggregated headlines. Editorial coverage of the releases, the skills, and the arguments that actually moved this month.
          </p>
        </div>
      </section>

      <section className="page-gutter pt-16 pb-20 border-t border-[var(--rule)]">
        <div className="page-max-wide grid md:grid-cols-12 gap-10 md:gap-14 items-start">
          <div className="md:col-span-6">
            <div className="relative aspect-[3/2] w-full bg-[var(--bg-elevated)]">
              <Image
                src="/images/atlas_hero.png"
                alt="A vintage topographical map fragment with a single red ink mark."
                fill
                priority
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 92vw"
              />
            </div>
          </div>

          <div className="md:col-span-6 md:pt-6">
            <p className="eyebrow eyebrow-mark mb-4">Issue №09 · May 2026</p>
            <h2 className="serif text-[2rem] md:text-[2.5rem] leading-[1.1] mb-6">
              The reading the brief doesn&apos;t have room for.
            </h2>
            <p className="lead measure-tight mb-4">Ten editorial pieces. One issue. Free.</p>
            <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed measure-tight mb-10">
              The Daily Brief is breaking news. The Dispatch is the long form — what those releases actually mean, which skills are worth picking up, and the editorial calls about where the field is heading. Drop your email and the May issue arrives in your inbox in 90&nbsp;seconds.
            </p>
            <EmailCapture
              source="dispatch"
              cta="Send me The Dispatch"
              redirectTo={GUMROAD_FREE}
            />
          </div>
        </div>
      </section>

      <section className="page-gutter pt-20 md:pt-28 pb-20 md:pb-28 border-t border-[var(--rule)]">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-3">Inside Issue №09</p>
          <span className="draw-rule mb-12" aria-hidden="true" />

          <ol className="list-none p-0 m-0">
            {PIECES.map((p, i) => (
              <li key={p.title}>
                <div className="index-row">
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="source">{p.kind}</span>
                  <span className="title">
                    {p.title} <span className="text-[var(--ink-soft)]">— {p.body}</span>
                  </span>
                  <span className="when tabular">{p.length}</span>
                </div>
              </li>
            ))}
          </ol>

          <p className="meta italic mt-8">All ten pieces in one PDF. ~12,000 words. Read in an evening.</p>
        </div>
      </section>

      <section className="page-gutter pt-20 md:pt-28 pb-20 md:pb-28 border-t border-[var(--rule)]">
        <div className="page-max">
          <span className="rule-red block w-60 mx-auto" />
          <blockquote className="aside mt-10">
            &ldquo;The Dispatch is what we&apos;d write a friend at the end of the month, asking what mattered.&rdquo;
          </blockquote>
          <p className="eyebrow eyebrow-mark text-center mt-10">Why it&apos;s free</p>
          <span className="rule-red block w-60 mx-auto mt-10" />
        </div>
      </section>

      <section className="page-gutter pt-20 md:pt-28 pb-12 border-t border-[var(--rule)]">
        <div className="page-max max-w-2xl text-center">
          <p className="eyebrow eyebrow-mark mb-5">One more thing</p>
          <h2 className="display text-[2rem] md:text-[2.75rem] leading-[1.05] mb-4">
            We make our money on the <span className="display-italic">books.</span>
          </h2>
          <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed measure mx-auto mb-10">
            The Dispatch is free. It&apos;s the editorial layer — same beat we cover daily, written long. The books are paid: 4,500-word deep-dives on a single technique, with code that runs. The Dispatch makes you better-informed. The books make you better-equipped.
          </p>
          <p>
            <Link href="/courses" className="link-red text-[1.0625rem]">See the books →</Link>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

const PIECES = [
  { kind: 'Essay',     title: 'The Memory Wall',                       body: 'Why every agent demo dies at message four, and the four-axis framework that fixes it.', length: '1.4k' },
  { kind: 'Analysis',  title: 'AlphaEvolve, in context',               body: 'DeepMind’s coding agent isn’t Cursor with better marketing. What it actually proves.', length: '1.2k' },
  { kind: 'Brief',     title: 'OpenAI’s Voice Intelligence API',  body: 'What changes for transcription startups, customer support, and the latency floor.', length: '900'  },
  { kind: 'Survey',    title: 'The MCP gold rush',                     body: 'Twelve servers worth installing, three patterns worth studying, and the trap to avoid.', length: '1.6k' },
  { kind: 'Notes',     title: 'The agent-framework consolidation',     body: 'LangGraph vs Letta vs Agno vs CrewAI vs the dozen we’re tracking. Where it’s heading.', length: '1.1k' },
  { kind: 'Reading',   title: 'Cross-LLM memory: a survey',            body: 'Buffer, vector, graph, and paged memory across providers. What ships in production.', length: '1.8k' },
  { kind: 'Editorial', title: 'On AI bravado',                         body: 'Most launch posts are theatre. A short essay on reading them past the headline.', length: '700'  },
  { kind: 'Picks',     title: 'Twelve repos worth your weekend',       body: 'The standout open-source AI projects from this month. Why each one matters.', length: '900'  },
  { kind: 'Letter',    title: 'From the editor',                       body: 'What we got wrong last month and what we’re going to cover deeper next month.', length: '600'  },
  { kind: 'Index',     title: 'The reading list',                      body: 'Every consequential link from the daily briefs this month, organized by theme.', length: '500'  },
];
