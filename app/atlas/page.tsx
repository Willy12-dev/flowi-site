import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';
import EmailCapture from '@/components/site/EmailCapture';

export const metadata: Metadata = {
  title: 'The Atlas — Flowi AI Intelligence',
  description:
    'A free monthly index of every AI tool and open-source repo worth your evaluation hour. 50+ entries across 10 categories. Refreshed every month.',
  alternates: { canonical: 'https://useflowi.app/atlas' },
  openGraph: {
    title: 'The Atlas — Flowi AI Intelligence',
    description: 'A monthly index of every AI tool worth evaluating. Free, refreshed monthly.',
    url: 'https://useflowi.app/atlas',
  },
};

const GUMROAD_FREE = 'https://flowi.gumroad.com';

export default function AtlasPage() {
  return (
    <main className="bg-[var(--bg)] text-[var(--ink)]">
      <Nav />

      {/* Manifesto hero */}
      <section className="page-gutter pt-16 md:pt-24 pb-20 md:pb-24">
        <div className="page-max">
          <p className="eyebrow eyebrow-mark mb-10">The Atlas · Free · Monthly</p>
          <h1 className="display text-[3rem] sm:text-[4.5rem] md:text-[6rem] leading-[0.96]">
            An index of every <br />
            <span className="display-italic">AI tool</span> worth your<br />
            evaluation hour.
          </h1>
          <p className="lead mt-10 measure">
            Curated from twenty AI company blogs, Hacker News, Product Hunt, and the major GitHub trending feeds. Refreshed every month. Free.
          </p>
        </div>
      </section>

      {/* Spread: illustration + email capture */}
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
            <p className="eyebrow eyebrow-mark mb-4">May 2026 Edition</p>
            <h2 className="serif text-[2rem] md:text-[2.5rem] leading-[1.1] mb-6">
              The map most builders wish they had time to make themselves.
            </h2>
            <p className="lead measure-tight mb-4">
              Fifty entries. Ten categories. Twenty sources. Zero noise.
            </p>
            <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed measure-tight mb-10">
              Drop your email. The May edition arrives in your inbox within 90&nbsp;seconds. Each first of the month, you get the next edition automatically. Unsubscribe with one click — we keep the door open.
            </p>

            <EmailCapture
              source="atlas"
              cta="Send me the Atlas"
              redirectTo={GUMROAD_FREE}
            />
          </div>
        </div>
      </section>

      {/* What's in this edition (Index style) */}
      <section className="page-gutter pt-20 md:pt-28 pb-20 md:pb-28 border-t border-[var(--rule)]">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-3">Inside this edition</p>
          <span className="draw-rule mb-12" aria-hidden="true" />

          <ol className="list-none p-0 m-0">
            {CHAPTERS.map((c, i) => (
              <li key={c.title}>
                <div className="index-row">
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="source">{c.flag}</span>
                  <span className="title">{c.title} <span className="text-[var(--ink-soft)]">— {c.body}</span></span>
                  <span className="when tabular">{c.count}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Editorial aside */}
      <section className="page-gutter pt-20 md:pt-28 pb-20 md:pb-28 border-t border-[var(--rule)]">
        <div className="page-max">
          <span className="rule-red block w-60 mx-auto" />
          <blockquote className="aside mt-10">
            &ldquo;The Atlas is what we&apos;d send to a friend who asked &lsquo;what should I be looking at?&rsquo;&rdquo;
          </blockquote>
          <p className="eyebrow eyebrow-mark text-center mt-10">Why it stays free</p>
          <span className="rule-red block w-60 mx-auto mt-10" />
        </div>
      </section>

      {/* Closer */}
      <section className="page-gutter pt-20 md:pt-28 pb-12 border-t border-[var(--rule)]">
        <div className="page-max max-w-2xl text-center">
          <p className="eyebrow eyebrow-mark mb-5">One last thing</p>
          <h2 className="display text-[2rem] md:text-[2.75rem] leading-[1.05] mb-4">
            The brief should be <span className="display-italic">a public good.</span>
          </h2>
          <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed measure mx-auto mb-10">
            We make our money on the deep-dive books, not on the Atlas. The Atlas keeps you from having to write your own monthly tracker. The books are for when you want to actually master one of the patterns inside.
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

const CHAPTERS = [
  { flag: 'CHAPTER', title: 'Frontier LLMs',                    body: 'GPT-5.5, Claude, Gemini, Grok, Llama 4, Mistral, DeepSeek, Qwen.', count: '10' },
  { flag: 'CHAPTER', title: 'AI Coding Agents',                 body: 'Claude Code, Cursor, Trae, Aider, Copilot, AlphaEvolve.',          count: '08' },
  { flag: 'CHAPTER', title: 'Agent Frameworks',                 body: 'LangChain, LangGraph, LlamaIndex, CrewAI, Letta, Agno.',           count: '09' },
  { flag: 'CHAPTER', title: 'Memory, RAG &amp; Knowledge Graphs', body: 'Mem0, Letta, Zep, Graphiti, vector stores worth evaluating.',     count: '08' },
  { flag: 'CHAPTER', title: 'MCP &amp; Integrations',             body: 'Model Context Protocol servers, skills, and bridges.',            count: '06' },
  { flag: 'CHAPTER', title: 'Image, Video, Audio Gen',          body: 'Flux, Midjourney, Runway, Pika, Suno, Udio, ElevenLabs.',          count: '07' },
  { flag: 'CHAPTER', title: 'AI Dev Tools &amp; Observability',   body: 'LangSmith, evals, guardrails, tracing — the production layer.',   count: '06' },
  { flag: 'CHAPTER', title: 'Open-Source LLMs &amp; Inference',   body: 'Ollama, vLLM, llama.cpp — running your own.',                     count: '05' },
  { flag: 'CHAPTER', title: 'Trending This Month',              body: 'What just shipped that you probably have not heard of yet.',       count: '07' },
  { flag: 'CHAPTER', title: '6 Flagship Primers',               body: 'ChatGPT, Claude, Gemini, Grok, Midjourney, Suno.',                  count: '06' },
];
