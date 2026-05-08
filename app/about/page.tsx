import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';

export const metadata: Metadata = {
  title: 'About Flowi — AI Intelligence Pipeline',
  description:
    'Flowi is the signal layer for AI builders. We track 20+ official AI sources, GitHub trending, and Hacker News every two hours and turn it into a daily brief, a monthly atlas, and opinionated deep-dive courses.',
  alternates: { canonical: 'https://useflowi.app/about' },
  openGraph: {
    title: 'About Flowi — AI Intelligence Pipeline',
    description: 'How we turn AI signal into a daily brief, monthly atlas, and deep-dive courses.',
    url: 'https://useflowi.app/about',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#0e1335] to-[#06091e] text-white">
      <Nav />

      <div className="relative mx-auto max-w-4xl px-6 pt-32 pb-32">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
          <span className="size-1.5 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500" />
          About
        </p>

        <h1 className="font-[var(--font-playfair)] text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight">
          The signal layer <br />
          for{' '}
          <span className="bg-gradient-to-br from-cyan-400 to-violet-500 bg-clip-text text-transparent">
            AI builders
          </span>
          .
        </h1>

        <div className="mt-10 space-y-7 text-lg md:text-xl text-white/80 leading-relaxed">
          <p>
            Every day, dozens of new AI tools, models, and frameworks ship. Most are noise. A few will reshape how you build. The job of distinguishing one from the other is itself a full-time job — and most builders don&apos;t have it.
          </p>
          <p>
            <strong className="text-white">Flowi is that job, productized.</strong> We track every official AI company blog, the major GitHub trending feeds, Hacker News, Product Hunt, and a curated set of newsletters every two hours. Then we distill it into three layers, each calibrated to a different depth of attention.
          </p>
        </div>

        <section className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            { tag: 'Daily',          title: 'AI Daily Brief',     body: 'Top 10 every morning. 6 fixed flagships, 4 dynamic trending products. Auto-published. 2-minute read.' },
            { tag: 'Monthly · Free', title: 'The Atlas',          body: '50+ curated AI tools and repos worth your evaluation hour this month. 10 categories. Refreshed monthly.' },
            { tag: 'Weekly · Paid',  title: 'Deep-Dive Courses',  body: '5-chapter, 4,000+ word, code-first guides on production patterns. New course every week.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <span className="text-xs uppercase tracking-[0.18em] font-bold text-cyan-300">{item.tag}</span>
              <h3 className="font-[var(--font-playfair)] text-2xl font-bold mt-2 mb-2">{item.title}</h3>
              <p className="text-sm text-white/65 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-20">
          <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold tracking-tight mb-4">How it&apos;s built</h2>
          <p className="text-white/75 text-lg leading-relaxed mb-4">
            Built in public. The same tracking pipeline that scores the daily brief also auto-detects which new tools are worth a deep-dive course. AI assists every step — drafting, formatting, generating cover art — but every claim is checked, every code sample run, every pattern named after a real production system. The bar:
          </p>
          <blockquote className="border-l-4 border-cyan-400 pl-6 py-2 text-xl md:text-2xl text-white/90 italic font-[var(--font-playfair)]">
            If you could ask Claude this and get the same answer, the course gets rewritten until you can&apos;t.
          </blockquote>
        </section>

        <section className="mt-20">
          <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold tracking-tight mb-4">Why this exists</h2>
          <p className="text-white/75 text-lg leading-relaxed mb-4">
            The AI ecosystem moves too fast for any one person to track casually. Three months from now, half the tools on every &ldquo;top 10&rdquo; list today will be obsolete or absorbed. The people shipping AI products in production need a continuously-updated map — not a one-time survey.
          </p>
          <p className="text-white/75 text-lg leading-relaxed">
            The Atlas stays free because the brief should be a public good. The courses are paid because the depth costs us a day each to write properly and an honest specialty deserves an honest price. No subscriptions, no upsell ladders, no &ldquo;limited time&rdquo; nonsense.
          </p>
        </section>

        <section className="mt-20 rounded-2xl border border-white/10 bg-white/[0.04] p-8 md:p-10">
          <h2 className="font-[var(--font-playfair)] text-3xl font-bold tracking-tight mb-3">Start here</h2>
          <p className="text-white/75 mb-6">Free Atlas, no commitment. Unsubscribe anytime, no &ldquo;wait don&apos;t leave&rdquo; sequence.</p>
          <Link href="/atlas" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 px-6 py-3 font-semibold hover:from-violet-500 hover:to-blue-500 transition">
            Get the Atlas →
          </Link>
        </section>
      </div>

      <Footer />
    </main>
  );
}
