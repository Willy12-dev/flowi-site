import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Courses — Flowi AI Intelligence',
  description:
    'Deep-dive courses on AI tools and patterns that ship in production. Each course is opinionated, code-first, and 4,000+ words.',
  alternates: { canonical: 'https://useflowi.app/courses' },
};

interface Course {
  slug: string;
  title: string;
  subtitle: string;
  blurb: string;
  price: string;
  gumroadUrl: string;
  tags: string[];
  status: 'live' | 'coming_soon';
}

const COURSES: Course[] = [
  {
    slug: 'agent-memory',
    title: 'Agent Memory: The 5 Patterns That Ship in Production',
    subtitle: 'The decision tree, the code, and the failure modes nobody warns you about.',
    blurb:
      'Most AI agent demos fail at message four because the agent forgets the user. This 5-chapter guide covers the 4 axes of memory, 5 production patterns with copy-paste-ready code, and the 5 failure modes (cost creep, memory poisoning, PII compliance, schema drift, eval gap) — with concrete fixes for each.',
    price: '$19',
    gumroadUrl: 'https://flowi.gumroad.com/l/sqqhvm',
    tags: ['ai-agents', 'llm', 'memory', 'rag', 'production'],
    status: 'live',
  },
];

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#0e1335] to-[#06091e] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[50vh] opacity-30 [background-image:radial-gradient(rgba(74,123,255,0.18)_0%,transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-32 md:pt-32">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
          <span className="size-1.5 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500" />
          AI Intelligence · Premium Courses
        </p>

        <h1 className="font-[var(--font-playfair)] text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight">
          Courses for engineers who <br className="hidden md:block" />
          <span className="bg-gradient-to-br from-cyan-400 to-violet-500 bg-clip-text text-transparent">
            ship AI in production
          </span>
          .
        </h1>

        <p className="mt-6 max-w-2xl text-lg md:text-xl text-white/75 leading-relaxed">
          Opinionated, code-first deep-dives on the AI tools and patterns that actually work in production.
          Each course is 4,000+ words, with code samples for Claude / GPT / Gemini / local models, plus the
          failure modes nobody else writes about.
        </p>

        <p className="mt-3 max-w-2xl text-sm text-white/55">
          New courses ship weekly — driven by what&apos;s actually trending in the AI ecosystem (not what&apos;s easy to write about).
        </p>

        {/* Course grid */}
        <section className="mt-16 grid gap-8">
          {COURSES.map((c) => (
            <CourseCard key={c.slug} course={c} />
          ))}
        </section>

        {/* Lead magnet upsell */}
        <section className="mt-20 rounded-2xl border border-white/10 bg-white/[0.04] p-8 md:p-10">
          <p className="text-sm uppercase tracking-[0.2em] text-white/55 mb-3">Free</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
            Not ready to buy? Start with the Atlas.
          </h2>
          <p className="text-white/75 max-w-2xl mb-6">
            The free monthly index of every AI tool and repo worth evaluating this month. 50+ curated picks,
            10 categories, refreshed every month. No spam, unsubscribe anytime.
          </p>
          <Link
            href="/atlas"
            className="inline-flex items-center gap-2 rounded-lg bg-white text-[#0a0e27] px-6 py-3 text-sm font-semibold hover:bg-white/90 transition"
          >
            Get the free Atlas →
          </Link>
        </section>
      </div>
    </main>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <article className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10 hover:border-white/20 hover:bg-white/[0.05] transition">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="flex-1 min-w-[280px]">
          {course.status === 'live' ? (
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-emerald-400 mb-3">
              ● Live
            </span>
          ) : (
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-amber-300 mb-3">
              ○ Coming soon
            </span>
          )}
          <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            {course.title}
          </h2>
          <p className="mt-3 text-base md:text-lg text-white/75">{course.subtitle}</p>
          <p className="mt-4 text-sm md:text-base text-white/65 leading-relaxed max-w-2xl">{course.blurb}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {course.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-white/70 border border-white/10"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3 min-w-[180px]">
          <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-cyan-300 to-violet-400 bg-clip-text text-transparent">
            {course.price}
          </div>
          {course.status === 'live' ? (
            <a
              href={course.gumroadUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 text-white px-6 py-3 text-sm font-semibold shadow-lg shadow-violet-600/20 hover:shadow-violet-600/40 hover:-translate-y-0.5 transition-all"
            >
              Buy on Gumroad →
            </a>
          ) : (
            <button
              disabled
              className="inline-flex items-center gap-2 rounded-lg bg-white/[0.06] border border-white/10 text-white/50 px-6 py-3 text-sm font-semibold cursor-not-allowed"
            >
              Notify me →
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
