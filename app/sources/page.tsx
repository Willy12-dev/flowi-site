import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';

export const metadata: Metadata = {
  title: 'Sources — Flowi AI Intelligence',
  description:
    'The 60+ platforms we track every two hours so you don\'t have to. Official AI lab blogs, GitHub trending across 22 topics and 18 orgs, the major AI publications, aggregators, and editorial newsletters.',
  alternates: { canonical: 'https://useflowi.app/sources' },
  openGraph: {
    title: 'Sources — Flowi AI Intelligence',
    description: 'The 60+ platforms we track every two hours.',
    url: 'https://useflowi.app/sources',
  },
};

interface Source {
  name: string;
  url: string;
  why: string;
}

const OFFICIAL: Source[] = [
  { name: 'OpenAI Blog',          url: 'https://openai.com/blog',                          why: 'GPT, Sora, voice APIs, agent SDK announcements.' },
  { name: 'Anthropic Research',   url: 'https://www.anthropic.com/research',                why: 'Claude releases, MCP, interpretability research.' },
  { name: 'Google AI Blog',       url: 'https://blog.google/technology/ai/',                 why: 'Gemini, Gemma, Workspace AI shipments.' },
  { name: 'DeepMind Blog',        url: 'https://deepmind.google/blog/',                     why: 'AlphaEvolve, AlphaFold, foundation research.' },
  { name: 'xAI Blog',             url: 'https://x.ai/blog',                                  why: 'Grok release notes and model cards.' },
  { name: 'Meta AI Blog',         url: 'https://ai.meta.com/blog/',                          why: 'Llama, ImageBind, Segment Anything.' },
  { name: 'Hugging Face Blog',    url: 'https://huggingface.co/blog',                       why: 'Open-source model launches, transformers updates.' },
  { name: 'NVIDIA AI Blog',       url: 'https://blogs.nvidia.com/',                          why: 'Inference, Spectrum-X, hardware-side AI.' },
  { name: 'Stability AI Blog',    url: 'https://stability.ai/news',                          why: 'Stable Diffusion family, audio, video models.' },
  { name: 'Mistral Blog',         url: 'https://mistral.ai/news/',                           why: 'Mistral Large, Mixtral, Codestral releases.' },
];

const PUBLICATIONS: Source[] = [
  { name: 'TechCrunch AI',         url: 'https://techcrunch.com/category/artificial-intelligence/', why: 'Funding, M&A, product announcements.' },
  { name: 'The Verge AI',          url: 'https://www.theverge.com/ai-artificial-intelligence',       why: 'Consumer-side AI coverage, ethics, policy.' },
  { name: 'MIT Technology Review', url: 'https://www.technologyreview.com/topic/artificial-intelligence/', why: 'Research-grade analysis, long-form.' },
  { name: 'Axios AI',              url: 'https://www.axios.com/topics/artificial-intelligence',       why: 'Policy, geopolitics, enterprise adoption.' },
  { name: 'VentureBeat AI',        url: 'https://venturebeat.com/category/ai/',                       why: 'Enterprise AI, infrastructure, deal flow.' },
  { name: 'Towards Data Science',  url: 'https://towardsdatascience.com/',                            why: 'Practitioner posts, technique walkthroughs.' },
];

const AGGREGATORS: Source[] = [
  { name: 'Hacker News (AI filter)', url: 'https://news.ycombinator.com/',                              why: 'Best-of, filtered for AI / LLM / GPT / Claude / Gemini.' },
  { name: 'Product Hunt AI',         url: 'https://www.producthunt.com/topics/artificial-intelligence', why: 'Daily AI tool launches, founder commentary.' },
];

const NEWSLETTERS: Source[] = [
  { name: 'Import AI',                url: 'https://importai.substack.com',     why: 'Jack Clark\'s research-side AI weekly.' },
  { name: 'Cerebral Valley',          url: 'https://cerebralvalley.beehiiv.com', why: 'Bay Area AI scene, founder interviews.' },
  { name: 'Simon Willison',           url: 'https://simonwillison.net',          why: 'The single most reliable individual AI commentator online.' },
  { name: 'One Useful Thing (Mollick)', url: 'https://www.oneusefulthing.org',   why: 'Wharton prof; the best AI-as-tool practitioner writing.' },
];

const COMMUNITIES: Source[] = [
  { name: 'Reddit · r/LocalLLaMA',      url: 'https://www.reddit.com/r/LocalLLaMA/',      why: 'Self-hosted LLM frontier — leak velocity, benchmarks, fine-tuning.' },
  { name: 'Reddit · r/ChatGPT',         url: 'https://www.reddit.com/r/ChatGPT/',         why: 'Mass-market AI sentiment + the prompt economy.' },
  { name: 'Reddit · r/MachineLearning', url: 'https://www.reddit.com/r/MachineLearning/', why: 'Practitioner discussion + paper threads.' },
  { name: 'Reddit · r/singularity',     url: 'https://www.reddit.com/r/singularity/',     why: 'Speculative, big-picture, where rumor first surfaces.' },
  { name: 'Reddit · r/aivideo',         url: 'https://www.reddit.com/r/aivideo/',         why: 'Video-gen scene — Sora, Runway, Pika, Kling, Wan.' },
];

const RESEARCH: Source[] = [
  { name: 'ArXiv · cs.AI',         url: 'https://arxiv.org/list/cs.AI/recent', why: 'Daily AI papers — what the labs are publishing.' },
  { name: 'ArXiv · cs.CL',         url: 'https://arxiv.org/list/cs.CL/recent', why: 'Computational linguistics — the LLM research artery.' },
  { name: 'ArXiv · cs.LG',         url: 'https://arxiv.org/list/cs.LG/recent', why: 'Machine learning broad — RL, agents, theory.' },
  { name: 'Hugging Face Posts',    url: 'https://huggingface.co/posts',        why: 'Community model launches and threads beyond the company blog.' },
];

const GITHUB_ORGS = [
  ['anthropics',           'github.com/anthropics'],
  ['openai',               'github.com/openai'],
  ['langchain-ai',         'github.com/langchain-ai'],
  ['huggingface',          'github.com/huggingface'],
  ['microsoft',            'github.com/microsoft'],
  ['unslothai',            'github.com/unslothai'],
  ['vllm-project',         'github.com/vllm-project'],
  ['ollama',               'github.com/ollama'],
  ['modelcontextprotocol', 'github.com/modelcontextprotocol'],
  ['google-deepmind',      'github.com/google-deepmind'],
  ['meta-llama',           'github.com/meta-llama'],
  ['mistralai',            'github.com/mistralai'],
  ['lmstudio-ai',          'github.com/lmstudio-ai'],
  ['ggerganov',            'github.com/ggerganov'],
  ['comfyanonymous',       'github.com/comfyanonymous'],
  ['danny-avila',          'github.com/danny-avila'],
  ['BerriAI',              'github.com/BerriAI'],
  ['stanfordnlp',          'github.com/stanfordnlp'],
];

const GITHUB_TOPICS = [
  'llm', 'language-model', 'prompt-engineering', 'ai-agents', 'agentic',
  'langchain', 'llamaindex', 'mcp', 'claude-code', 'claude-mcp',
  'ai-tools', 'generative-ai', 'rag', 'retrieval-augmented-generation',
  'fine-tuning', 'lora', 'vector-database', 'embeddings',
  'ai-automation', 'openai', 'anthropic', 'deepmind',
];

const PIPELINE = [
  { name: 'Twitter / X',                  why: 'AI launches now happen first on X. We\'re evaluating list-based scraping that respects ToS — no cold-DM mess.' },
  { name: 'Replicate trending',           why: 'Where new image/video/audio models go live first.' },
  { name: 'YouTube (release videos)',     why: 'Some launches are video-first. Pulling channel feeds for the majors.' },
  { name: 'Discord (public channels)',    why: 'A handful of AI communities still run Discord-first. Read-only RSS via bot if we add it.' },
  { name: 'Tier-2 individual bloggers',   why: 'Andrej Karpathy, Yann LeCun, Sebastian Raschka, Lilian Weng — when they post, it matters.' },
];

function totalCount() {
  return OFFICIAL.length + PUBLICATIONS.length + AGGREGATORS.length + NEWSLETTERS.length + COMMUNITIES.length + RESEARCH.length + GITHUB_ORGS.length + GITHUB_TOPICS.length;
}

function SourceList({ items, type }: { items: Source[]; type: string }) {
  return (
    <ol className="list-none p-0 m-0">
      {items.map((s, i) => (
        <li key={s.name}>
          <a href={s.url} target="_blank" rel="noopener" className="index-row no-underline">
            <span className="num">{String(i + 1).padStart(2, '0')}</span>
            <span className="source">{type}</span>
            <span className="title">
              {s.name} <span className="text-[var(--ink-soft)]">— {s.why}</span>
            </span>
            <span className="when tabular">↗</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function SourcesPage() {
  return (
    <main className="bg-[var(--bg)] text-[var(--ink)]">
      <Nav />

      <section className="page-gutter pt-16 md:pt-24 pb-12">
        <div className="page-max">
          <p className="eyebrow eyebrow-mark mb-10">Sources · Updated every 2 hours</p>
          <h1 className="display text-[3rem] sm:text-[4.5rem] md:text-[6rem] leading-[0.96]">
            <span className="tabular">{totalCount()}</span> platforms.<br />
            <span className="display-italic">One newsroom.</span>
          </h1>
          <p className="lead mt-10 measure">
            All AI news lives online — every release, every framework, every argument. Our edge isn&apos;t access. It&apos;s <em>tracking</em>. We watch every official AI lab blog, the major publications, the GitHub trending feeds across {GITHUB_TOPICS.length} topics and {GITHUB_ORGS.length} organizations, the aggregators, the newsletters worth reading. Every two hours. So you read one daily brief instead of forty tabs.
          </p>
        </div>
      </section>

      <section className="page-gutter pt-12 pb-16 border-t border-[var(--rule)]">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-3">Official AI Labs · {OFFICIAL.length}</p>
          <span className="draw-rule mb-8 block" aria-hidden="true" />
          <SourceList items={OFFICIAL} type="OFFICIAL" />
        </div>
      </section>

      <section className="page-gutter pt-16 pb-16 border-t border-[var(--rule)]">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-3">Publications · {PUBLICATIONS.length}</p>
          <span className="draw-rule mb-8 block" aria-hidden="true" />
          <SourceList items={PUBLICATIONS} type="MEDIA" />
        </div>
      </section>

      <section className="page-gutter pt-16 pb-16 border-t border-[var(--rule)]">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-3">Aggregators · {AGGREGATORS.length}</p>
          <span className="draw-rule mb-8 block" aria-hidden="true" />
          <SourceList items={AGGREGATORS} type="AGGREGATOR" />
        </div>
      </section>

      <section className="page-gutter pt-16 pb-16 border-t border-[var(--rule)]">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-3">Editorial Newsletters &amp; Individuals · {NEWSLETTERS.length}</p>
          <span className="draw-rule mb-8 block" aria-hidden="true" />
          <SourceList items={NEWSLETTERS} type="LETTER" />
        </div>
      </section>

      <section className="page-gutter pt-16 pb-16 border-t border-[var(--rule)]">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-3">Communities · {COMMUNITIES.length}</p>
          <span className="draw-rule mb-8 block" aria-hidden="true" />
          <SourceList items={COMMUNITIES} type="REDDIT" />
        </div>
      </section>

      <section className="page-gutter pt-16 pb-16 border-t border-[var(--rule)]">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-3">Research · {RESEARCH.length}</p>
          <span className="draw-rule mb-8 block" aria-hidden="true" />
          <SourceList items={RESEARCH} type="PAPERS" />
        </div>
      </section>

      <section className="page-gutter pt-16 pb-16 border-t border-[var(--rule)]">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-3">GitHub Organizations · {GITHUB_ORGS.length}</p>
          <span className="draw-rule mb-8 block" aria-hidden="true" />
          <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed measure mb-8">
            We poll the public release feed for each of these every two hours. New repos are scored against a star-velocity threshold; repos that cross it become candidates for full editorial coverage.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
            {GITHUB_ORGS.map(([org, url]) => (
              <a key={org} href={`https://${url}`} target="_blank" rel="noopener" className="text-[15px] py-1.5 border-b border-[var(--rule)] flex items-baseline justify-between">
                <span className="serif">{org}</span>
                <span className="meta">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="page-gutter pt-16 pb-16 border-t border-[var(--rule)]">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-3">GitHub Topics · {GITHUB_TOPICS.length}</p>
          <span className="draw-rule mb-8 block" aria-hidden="true" />
          <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed measure mb-8">
            For each topic below, we run a daily search for new repositories with at least 100 stars and an age under 30 days. The intersection of &ldquo;new&rdquo; and &ldquo;already noticed&rdquo; is where the interesting stories are.
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-2">
            {GITHUB_TOPICS.map((t) => (
              <a key={t} href={`https://github.com/topics/${t}`} target="_blank" rel="noopener" className="serif text-[1.0625rem] text-[var(--ink)] hover:text-[var(--accent)]">
                #{t}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="page-gutter pt-20 pb-20 border-t border-[var(--rule)]">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-3">In the Pipeline</p>
          <span className="draw-rule mb-8 block" aria-hidden="true" />
          <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed measure mb-10">
            Sources we&apos;re actively integrating next. Trackers in development; coverage incomplete until they go live.
          </p>
          <ol className="list-none p-0 m-0">
            {PIPELINE.map((s, i) => (
              <li key={s.name}>
                <div className="index-row">
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="source">QUEUED</span>
                  <span className="title">
                    {s.name} <span className="text-[var(--ink-soft)]">— {s.why}</span>
                  </span>
                  <span className="when tabular text-[var(--ink-mute)]">soon</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="page-gutter pt-20 md:pt-28 pb-12 border-t border-[var(--rule)]">
        <div className="page-max max-w-2xl text-center">
          <p className="eyebrow eyebrow-mark mb-5">The deal</p>
          <h2 className="display text-[2rem] md:text-[2.75rem] leading-[1.05] mb-4">
            We watch <span className="display-italic">all of it.</span> You read the brief.
          </h2>
          <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed measure mx-auto mb-10">
            One free email a month with the editorial picks. Daily Brief lives at /blog. Books for when one of these stories is worth a deep dive.
          </p>
          <p>
            <Link href="/dispatch" className="link-red text-[1.0625rem]">Subscribe — free →</Link>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
