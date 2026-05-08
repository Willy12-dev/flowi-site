import type { Metadata } from 'next';
import Link from 'next/link';
import EmailCapture from '@/components/site/EmailCapture';

export const metadata: Metadata = {
  title: 'The Flowi AI Atlas — Free Monthly Edition',
  description:
    'A free, continuously-updated index of every AI tool and open-source repo worth evaluating this month. 50+ entries across 10 categories. Refreshed monthly. Zero spam.',
  alternates: { canonical: 'https://useflowi.app/atlas' },
  openGraph: {
    title: 'The Flowi AI Atlas — Free Monthly Edition',
    description:
      'The continuously-updated map of every AI tool worth evaluating this month. Free PDF, refreshed monthly.',
    url: 'https://useflowi.app/atlas',
  },
};

const GUMROAD_FREE_PRODUCT_URL = 'https://flowi.gumroad.com'; // placeholder — replace once the free product is live

export default function AtlasPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#0e1335] to-[#06091e] text-white">
      {/* Decorative background grid */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] opacity-30 [background-image:radial-gradient(rgba(124,58,237,0.18)_0%,transparent_60%)]" />

      <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-32 md:pt-32">
        {/* Eyebrow */}
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
          <span className="size-1.5 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500" />
          Free · Updated Monthly
        </p>

        {/* Headline */}
        <h1 className="font-[var(--font-playfair)] text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight">
          The Flowi <span className="bg-gradient-to-br from-cyan-400 to-violet-500 bg-clip-text text-transparent">AI Atlas</span>.
        </h1>

        <p className="mt-6 max-w-2xl text-lg md:text-xl text-white/75 leading-relaxed">
          The continuously-updated index of every AI tool, model, and open-source repo worth evaluating
          this month. Auto-curated from 20+ official AI company blogs, Hacker News, Product Hunt, and
          GitHub trending — across all major AI topics.
        </p>

        {/* Quick facts */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
          {[
            { num: '50+', label: 'Curated tools / month' },
            { num: '10', label: 'Categories covered' },
            { num: '20', label: 'AI signal sources' },
            { num: '$0', label: 'Forever free' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-cyan-300 to-violet-400 bg-clip-text text-transparent">
                {s.num}
              </div>
              <div className="text-xs uppercase tracking-wider text-white/55 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Email capture */}
        <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.04] p-8 md:p-10 backdrop-blur">
          <EmailCapture
            source="atlas"
            headline="Get this month's edition free."
            subline="Drop your email — we'll send the PDF immediately and the new edition every month. Unsubscribe anytime."
            cta="Send me the Atlas"
            redirectTo={GUMROAD_FREE_PRODUCT_URL}
            className="text-white"
          />
        </div>

        {/* What's inside */}
        <section className="mt-20">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">What&apos;s inside</h2>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
            {[
              ['6 flagship AI primers', 'ChatGPT, Claude, Gemini, Grok, Midjourney, Suno — what each one is best at this quarter.'],
              ['Frontier LLMs & foundation models', 'GPT-5, Claude 4, Gemini, Llama, Mistral, DeepSeek, Qwen — sizes, strengths, when to use which.'],
              ['AI coding agents', 'Claude Code, Cursor, Trae, Aider, Copilot, AlphaEvolve — what to use when.'],
              ['Agent frameworks', 'LangChain, LangGraph, LlamaIndex, CrewAI, AutoGen, Letta, Agno — production-ready picks.'],
              ['Memory, RAG & knowledge graphs', 'Mem0, Letta, Zep, Graphiti, vector stores worth evaluating.'],
              ['MCP & integrations', 'The Model Context Protocol ecosystem and what is shipping.'],
              ['Image, video, audio gen', 'Flux, Midjourney, Runway, Pika, Suno, Udio, ElevenLabs — current best-in-class.'],
              ['AI dev tools & observability', 'LangSmith, evals, guardrails, tracing — the production layer.'],
              ['Open-source LLMs & inference', 'Ollama, vLLM, llama.cpp — running your own.'],
              ['Trending this month', 'What just shipped that you probably have not heard of yet.'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="text-sm text-white/65 mt-1.5 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust / social proof */}
        <section className="mt-20 rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
          <p className="text-sm uppercase tracking-[0.2em] text-white/55 mb-3">Why this exists</p>
          <p className="text-lg md:text-xl text-white/85 leading-relaxed max-w-3xl">
            New AI tools ship every day. Most are noise. The Atlas filters the signal: an editor's pick of
            what's actually shipping and worth your evaluation hour. Same intelligence layer that powers our
            paid deep-dive courses — but the index itself stays free.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-cyan-300 hover:text-cyan-200"
          >
            See the deep-dive courses →
          </Link>
        </section>
      </div>
    </main>
  );
}
