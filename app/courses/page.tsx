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
  image: string;
}

interface FieldGuide {
  number: string;
  title: string;
  subtitle: string;
  blurb: string;
  price: string;
  url: string;
  meta: string;
  vertical: 'trading' | 'behavior' | 'ai-builder';
  image: string;
}

const FIELD_GUIDES: FieldGuide[] = [
  {
    number: '№01',
    title: "The Algo Trader's Playbook",
    subtitle: 'Four essays on why retail algo trading fails — and the architecture that survives.',
    blurb:
      'Compiled from the trading vertical of the daily brief. Why most retail systems blow up at month four, the six lies backtests cannot simulate, how institutional desks actually use ICT, and an honest comparison of every real platform in the category.',
    price: '$9',
    url: 'https://flowi.gumroad.com/l/algo-traders-playbook-v1',
    meta: '~5,500 words · 4 essays · PDF',
    vertical: 'trading',
    image: 'https://useflowi.app/images/blog/why-retail-algo-trading-systems-fail-at-month-four.jpg',
  },
  {
    number: '№02',
    title: 'The Behavior Change Playbook',
    subtitle: 'Four essays on why most recovery apps fail — and the relapse-aware architecture that works.',
    blurb:
      "Compiled from the behavior vertical. Why habit apps don't survive month three, the discipline-app paradox (more apps → worse outcomes), what every recovery app gets wrong about relapse, and an honest comparison of the apps actually built on Marlatt's research.",
    price: '$9',
    url: 'https://flowi.gumroad.com/l/behavior-change-playbook-v1',
    meta: '~5,500 words · 4 essays · PDF',
    vertical: 'behavior',
    image: 'https://useflowi.app/images/blog/why-habit-tracker-apps-dont-survive-the-third-month.jpg',
  },
  {
    number: '№03',
    title: "The AI Builder's Field Guide",
    subtitle: 'Four essays on what shipped in AI this month — and what the production patterns mean.',
    blurb:
      'Compiled from the AI builder vertical. Mozilla using Claude Mythos to harden Firefox, OpenAI gating Spud to defenders, what actually shipped at Code w/ Claude 2026, and an honest review of the AI engineering books worth reading.',
    price: '$9',
    url: 'https://flowi.gumroad.com/l/ai-builders-field-guide-v1',
    meta: '~5,500 words · 4 essays · PDF',
    vertical: 'ai-builder',
    image: 'https://useflowi.app/images/blog/best-books-for-building-ai-agents-in-2026.jpg',
  },
];

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
    image: 'https://useflowi.app/images/blog/best-books-for-building-ai-agents-in-2026.jpg',
  },
  {
    number: '№02',
    title: 'The AI Agent Stack: Memory, Tools, Planning, Evaluation',
    subtitle: 'The whole system, not just the components.',
    blurb:
      'Builders understand one piece — memory, or tools, or planning — but not how they fit together. This is the systems-level architecture for moving an agent from demo to production.',
    price: '$19',
    url: '#',
    meta: '5 chapters · ~5,000 words · in production',
    status: 'coming',
    image: 'https://useflowi.app/images/blog/code-with-claude-2026-what-actually-shipped.jpg',
  },
  {
    number: '№03',
    title: 'MCP in Production',
    subtitle: 'How agents connect to real tools, safely.',
    blurb:
      "Model Context Protocol gets thrown around as an acronym. Almost nobody is implementing it cleanly. This is the implementation playbook — server design, auth, sandboxing, the patterns that scale.",
    price: '$19',
    url: '#',
    meta: '5 chapters · in production',
    status: 'coming',
    image: 'https://useflowi.app/images/blog/code-with-claude-2026-what-actually-shipped.jpg',
  },
  {
    number: '№04',
    title: 'How to Evaluate AI Agents Before They Fail in Production',
    subtitle: 'The reliability discipline most teams skip.',
    blurb:
      'Most agents ship without real evaluation, then break in production with no signal of why. This book is the eval framework — the metrics, the benchmarks, the test infrastructure.',
    price: '$19',
    url: '#',
    meta: 'in production',
    status: 'coming',
    image: 'https://useflowi.app/images/blog/code-with-claude-2026-what-actually-shipped.jpg',
  },
  {
    number: '№05',
    title: 'The Open-Source Model Playbook',
    subtitle: 'Which models actually matter and how to deploy them.',
    blurb:
      'Llama, Qwen, Mistral, DeepSeek, Phi — too many models, no clarity on which to use when. This book ranks them by use case, with deployment recipes for each.',
    price: '$19',
    url: '#',
    meta: 'in production',
    status: 'coming',
    image: 'https://useflowi.app/images/blog/code-with-claude-2026-what-actually-shipped.jpg',
  },
  {
    number: '№06',
    title: 'When to Use Multi-Agent Systems (And When Not To)',
    subtitle: 'The architecture call most teams get wrong.',
    blurb:
      'Multi-agent is exciting and almost always premature. This book is the decision tree — when single agents work, when multi-agent earns its complexity, and the patterns that actually ship.',
    price: '$19',
    url: '#',
    meta: 'in production',
    status: 'coming',
    image: 'https://useflowi.app/images/blog/code-with-claude-2026-what-actually-shipped.jpg',
  },
];

/**
 * ItemList JSON-LD — exposes all field guides + books as crawlable
 * Product entries so Google can render rich product cards on /courses
 * and surface them in shopping / sitelink results.
 *
 * Required fields per Google's Merchant listings spec:
 *   - image (REQUIRED, was missing — flagged in Search Console)
 *   - offers.shippingDetails (recommended for digital products)
 *   - offers.hasMerchantReturnPolicy (recommended)
 */
const DIGITAL_SHIPPING = {
  "@type": "OfferShippingDetails",
  shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
  shippingDestination: { "@type": "DefinedRegion", geoTargetName: "Worldwide" },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 0, unitCode: "DAY" },
    transitTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 0, unitCode: "DAY" },
  },
};

const DIGITAL_RETURN_POLICY = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "US",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 30,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/FreeReturn",
};

function buildCatalogJsonLd() {
  const liveItems: Array<{
    name: string;
    url: string;
    price: string;
    description: string;
    image: string;
  }> = [];
  for (const g of FIELD_GUIDES) {
    liveItems.push({
      name: g.title,
      url: g.url,
      price: g.price.replace("$", ""),
      description: g.subtitle,
      image: g.image,
    });
  }
  for (const b of BOOKS) {
    if (b.status === "live") {
      liveItems.push({
        name: b.title,
        url: b.url,
        price: b.price.replace("$", ""),
        description: b.subtitle,
        image: b.image,
      });
    }
  }
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Flowi Catalog — books + field guides",
    description: "Opinionated, code-first deep-dives on AI patterns that ship in production.",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: liveItems.length,
    itemListElement: liveItems.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: it.name,
        description: it.description,
        url: it.url,
        image: it.image,
        brand: { "@type": "Brand", name: "Flowi" },
        category: "Digital Publication",
        offers: {
          "@type": "Offer",
          price: it.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: it.url,
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@type": "Organization", name: "Flowi", url: "https://useflowi.app" },
          shippingDetails: DIGITAL_SHIPPING,
          hasMerchantReturnPolicy: DIGITAL_RETURN_POLICY,
        },
      },
    })),
  };
}

export default function CoursesPage() {
  const jsonLd = buildCatalogJsonLd();
  return (
    <main className="bg-[var(--bg)] text-[var(--ink)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />

      {/* Hero */}
      <section className="page-gutter pt-16 md:pt-24 pb-16 md:pb-20">
        <div className="page-max">
          <p className="eyebrow eyebrow-mark mb-10">Catalog — In Print</p>
          <h1 className="display text-[3rem] sm:text-[4.5rem] md:text-[6rem] leading-[0.96]">
            For builders who <br />
            <span className="display-italic">ship</span> in production.
          </h1>
          <p className="lead mt-10 measure">
            Two tiers. Field guides at $9 — curated essay compilations, ~5,500 words each, one sitting. Books at $19 — code-first deep-dives, 4,500+ words, one weekend. Both serve the same readers: practitioners who'd rather have an opinionated map than another exhaustive survey.
          </p>
          <p className="meta mt-8 italic">A new title ships every Monday morning at 06:00 UTC.</p>
        </div>
      </section>

      {/* Field Guides — $9 entry tier */}
      <section className="page-gutter pt-16 md:pt-20 pb-16 md:pb-20 border-t border-[var(--rule)]">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-3">Field Guides — $9 each</p>
          <span className="draw-rule mb-12" aria-hidden="true" />

          {FIELD_GUIDES.map((g) => (
            <article
              key={g.number}
              className="grid grid-cols-[3.5rem,1fr,auto] gap-x-6 gap-y-3 items-baseline pb-10 border-b border-[var(--rule)] mb-10 last:mb-0"
            >
              <span className="serif text-[1.5rem] tabular text-[var(--ink-mute)]">{g.number}</span>
              <div>
                <h2 className="serif text-[1.5rem] md:text-[2rem] leading-[1.1] -tracking-[0.015em] mb-3">
                  <a href={g.url} target="_blank" rel="noopener" className="link-ink">{g.title}</a>
                </h2>
                <p className="lead measure mb-3">{g.subtitle}</p>
                <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed measure mb-4">{g.blurb}</p>
                <p className="meta">{g.meta} · vertical: {g.vertical}</p>
              </div>
              <div className="text-right whitespace-nowrap">
                <span className="serif text-[1.5rem] tabular block">{g.price}</span>
                <a href={g.url} target="_blank" rel="noopener" className="link-red text-[14px] mt-1 inline-block">
                  Get it →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Editorial type interlude */}
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
          <p className="eyebrow eyebrow-mark mb-3">Books — $19 each</p>
          <span className="draw-rule mb-12" aria-hidden="true" />

          {BOOKS.map((b) => (
            <article
              key={b.number}
              className={`grid grid-cols-[3.5rem,1fr,auto] gap-x-6 gap-y-3 items-baseline pb-10 border-b border-[var(--rule)] mb-10 last:mb-0 ${b.status === 'coming' ? 'opacity-65' : ''}`}
            >
              <span className="serif text-[1.5rem] tabular text-[var(--ink-mute)]">{b.number}</span>
              <div>
                <h2 className="serif text-[1.5rem] md:text-[2rem] leading-[1.1] -tracking-[0.015em] mb-3">
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
                <span className={`serif text-[1.5rem] tabular block ${b.status === 'coming' ? 'text-[var(--ink-mute)]' : ''}`}>{b.price}</span>
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
