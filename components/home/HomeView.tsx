'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';

export default function HomeView() {
  return (
    <div className="preview-scope min-h-screen overflow-x-hidden">
      <Nav variant="over-hero" />
      <Hero />
      <Manifesto />
      <ValueBand />
      <Services />
      <Work />
      <Process />
      <Pricing />
      <Testimonials />
      <Studio />
      <Contact />
      <Footer />
    </div>
  );
}

/* ─────────────────────────── HERO ─────────────────────────── */
function Hero() {
  return (
    <section className="hero-cinema hero-cream-paper hero-grain relative min-h-screen flex flex-col justify-end pb-24 md:pb-32 px-8 md:px-12 lg:px-16 pt-44">
      {/* Background video — drop /public/videos/hero.mp4 to activate */}
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero.png"
        preload="metadata"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />

      {/* Eyebrow */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="eyebrow mb-10 md:mb-14"
      >
        Flowi — Digital studio, Nairobi
      </motion.p>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.2, 0, 0, 1] }}
        className="display text-[48px] sm:text-[68px] md:text-[96px] lg:text-[120px] xl:text-[140px] max-w-[20ch]"
      >
        Boutique websites
        <br />
        for brands that refuse
        <br />
        to look like{' '}
        <span className="display-italic" style={{ color: 'var(--clay-light)' }}>
          everyone else.
        </span>
      </motion.h1>

      {/* Bottom row: sub + meta + CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="mt-16 md:mt-20 flex flex-col lg:flex-row gap-10 lg:gap-20 lg:items-end"
      >
        <p
          className="text-[16px] md:text-[18px] leading-[1.55] max-w-[44ch]"
          style={{ color: 'rgba(245, 240, 230, 0.78)' }}
        >
          We design and build custom websites, mobile apps, and AI tools for
          ambitious furniture, hospitality, fashion, and service businesses
          across Kenya. No templates. No filler. Delivered in days, not months.
        </p>

        <div className="flex flex-col gap-5 lg:ml-auto">
          <div className="meta flex flex-col gap-1.5">
            <span>Est. 2024 · Westlands, Nairobi</span>
            <span style={{ color: 'var(--clay-light)' }}>● Booking April – June 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#contact" className="ink-pill">
              Start a project
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a href="#work" className="ghost-link">
              See recent work
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────── MANIFESTO ─────────────────────── */
function Manifesto() {
  return (
    <section className="px-8 md:px-12 lg:px-16 py-24 md:py-36 border-t" style={{ borderColor: 'var(--rule)' }}>
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <p className="eyebrow lg:col-span-3">— What we believe</p>
        <div className="lg:col-span-9">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="display text-[36px] md:text-[52px] lg:text-[64px] leading-[1.05] max-w-[20ch]"
          >
            A great website should feel like walking into a{' '}
            <span className="display-italic" style={{ color: 'var(--forest)' }}>
              well-considered space
            </span>
            — not a stock photo of one.
          </motion.h2>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── VALUE BAND ─────────────────────── */
function ValueBand() {
  const items = [
    'Portfolio-quality',
    'Delivered in days',
    'WhatsApp-ready',
    'M-Pesa integrated',
    'No templates',
    'Crafted in Nairobi',
    'Built to convert',
    'Honest pricing',
  ];
  return (
    <section
      className="py-6 overflow-hidden border-y"
      style={{ background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' }}
    >
      <div className="flex marquee-track whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="display-italic text-[28px] md:text-[36px] mx-8 flex items-center gap-8"
            style={{ fontVariationSettings: '"SOFT" 100, "opsz" 72' }}
          >
            {item}
            <span className="text-[28px]" style={{ color: 'var(--clay)' }}>
              ✦
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── WORK ─────────────────────────── */
function Work() {
  const cases = [
    {
      no: '01',
      year: '2026',
      client: 'King\'s & Queens Furniture',
      location: 'Githurai, Nairobi',
      brief:
        'A flagship online showroom for a Thika Road furniture house — bringing their bespoke sofas, dining sets, and bedroom collections to a polished digital storefront with WhatsApp ordering.',
      services: ['Web Design', 'E-commerce', 'WhatsApp Order Flow'],
      tone: 'forest',
      href: 'https://furniture-demo-zeta.vercel.app',
      external: true,
    },
    {
      no: '02',
      year: '2026',
      client: 'Mr Joseph — Premium Auto',
      location: 'carXPRESS, Kiambu Road',
      brief:
        'Booking site for a premium auto specialist. Service request flow, vehicle drop-off scheduling, and a portfolio of restored builds — all from a single mobile-first interface.',
      services: ['Web Design', 'Booking Flow', 'SEO'],
      tone: 'clay',
      href: 'https://mrjoseph-premium.vercel.app',
      external: true,
    },
    {
      no: '03',
      year: '2026',
      client: 'Flowi Capital',
      location: 'In-house product',
      brief:
        'A copy-trading and profit-sharing platform built around our own MT5 expert advisor. Client dashboards, performance tracking, M-Pesa subscriptions, and live signal delivery — all from a single Next.js stack.',
      services: ['Product Design', 'Full-stack', 'Trading Tech'],
      tone: 'forest',
      href: 'https://flowicapital.com',
      external: true,
    },
    {
      no: '04',
      year: '2026',
      client: 'Nimoo POS',
      location: 'In-house product',
      brief:
        'A point-of-sale Android app for Kenyan retailers. Camera-driven product scanning, M-Pesa till integration, and offline-first sync — designed for a duka, not a Starbucks.',
      services: ['Mobile App', 'Product Design', 'M-Pesa'],
      tone: 'clay',
      href: '/nimoo',
      external: false,
    },
  ];

  return (
    <section id="work" className="px-8 md:px-12 lg:px-16 py-24 md:py-36">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-16 md:mb-24 flex-wrap gap-6">
          <div>
            <p className="eyebrow mb-4">— Selected work</p>
            <h2 className="display text-[40px] md:text-[64px] lg:text-[80px] leading-[1]">
              Recent commissions.
            </h2>
          </div>
          <p className="meta max-w-[20ch]">
            A small studio. Three or four projects a quarter. Hand-crafted, every time.
          </p>
        </div>

        <div className="flex flex-col">
          {cases.map((c, i) => (
            <motion.a
              key={c.no}
              href={c.href}
              {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.05 }}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 py-10 md:py-14 border-t hover:bg-[rgba(15,15,15,0.02)] transition-colors duration-500"
              style={{ borderColor: 'var(--rule)' }}
            >
              <div className="lg:col-span-1 meta flex lg:flex-col gap-3 lg:gap-1">
                <span>{c.no}</span>
                <span style={{ color: 'var(--ash-light)' }}>{c.year}</span>
              </div>

              <div className="lg:col-span-5">
                <h3
                  className="display text-[28px] md:text-[40px] lg:text-[52px] leading-[1.05] mb-3 group-hover:translate-x-1 transition-transform duration-500 ease-out"
                >
                  {c.client}
                </h3>
                <p className="meta">{c.location}</p>
              </div>

              <div className="lg:col-span-5">
                <p className="text-[15px] md:text-[16px] leading-[1.6] mb-5" style={{ color: 'var(--ash)' }}>
                  {c.brief}
                </p>
                <div className="flex flex-wrap gap-2">
                  {c.services.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] tracking-[0.08em] uppercase border rounded-full px-3 py-1.5"
                      style={{
                        borderColor: 'var(--rule-strong)',
                        color: c.tone === 'forest' ? 'var(--forest)' : 'var(--clay)',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1 flex lg:justify-end items-start">
                <ArrowUpRight
                  className="w-7 h-7 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500 ease-out"
                  strokeWidth={1.25}
                />
              </div>
            </motion.a>
          ))}
          <div className="hairline" />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── PRICING ─────────────────────────── */
function Pricing() {
  const tiers = [
    {
      name: 'Essential',
      price: 'KES 50,000',
      sub: 'For new ventures',
      includes: [
        'Custom 5-page website',
        'Mobile-first build',
        'WhatsApp & M-Pesa wiring',
        'Basic SEO',
        'Delivered in 5 days',
      ],
    },
    {
      name: 'Signature',
      price: 'KES 120,000',
      sub: 'Most chosen',
      includes: [
        'Custom 8–12 page site',
        'Bespoke design system',
        'CMS + content workflow',
        'Booking / order flow',
        'Advanced SEO + analytics',
        'Delivered in 10 days',
      ],
      featured: true,
    },
    {
      name: 'Bespoke',
      price: 'From KES 300,000',
      sub: 'For ambitious brands',
      includes: [
        'End-to-end product build',
        'Mobile app or AI agent',
        'Custom integrations',
        'Brand identity refresh',
        'Ongoing studio retainer',
      ],
    },
  ];

  return (
    <section id="pricing" className="px-8 md:px-12 lg:px-16 py-24 md:py-36 border-t" style={{ borderColor: 'var(--rule)' }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          <p className="eyebrow lg:col-span-3">— Engagement</p>
          <div className="lg:col-span-9">
            <h2 className="display text-[40px] md:text-[64px] lg:text-[80px] leading-[1] max-w-[16ch]">
              Honest rates.
              <br />
              <span className="display-italic" style={{ color: 'var(--forest)' }}>
                No surprises.
              </span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--rule)] border" style={{ borderColor: 'var(--rule)' }}>
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`p-8 md:p-10 flex flex-col gap-6 ${tier.featured ? 'bg-[var(--ink)] text-[var(--paper)]' : 'bg-[var(--paper)]'}`}
            >
              <div className="flex items-baseline justify-between">
                <h3
                  className="display text-[28px]"
                  style={{ fontVariationSettings: '"SOFT" 60, "WONK" 1, "opsz" 100' }}
                >
                  {tier.name}
                </h3>
                <span
                  className="meta"
                  style={{ color: tier.featured ? 'var(--clay-light)' : 'var(--clay)' }}
                >
                  {tier.sub}
                </span>
              </div>

              <p
                className="display text-[36px] md:text-[44px]"
                style={{
                  color: tier.featured ? 'var(--paper)' : 'var(--ink)',
                  fontVariationSettings: '"SOFT" 30, "opsz" 144',
                }}
              >
                {tier.price}
              </p>

              <ul className="flex flex-col gap-3 text-[14px] leading-[1.5]" style={{ color: tier.featured ? 'var(--ash-light)' : 'var(--ash)' }}>
                {tier.includes.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span style={{ color: tier.featured ? 'var(--clay-light)' : 'var(--clay)' }}>—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-auto pt-6 border-t inline-flex items-center justify-between text-[13px] font-medium ${
                  tier.featured ? 'border-[rgba(255,255,255,0.15)] text-[var(--paper)]' : 'border-[var(--rule)]'
                }`}
              >
                Start this brief
                <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
          ))}
        </div>
        <p className="meta mt-6 text-center" style={{ color: 'var(--ash)' }}>
          All tiers include source code, hosting setup, and one round of revisions. Maintenance from KES 3K/month.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────── STUDIO ─────────────────────────── */
function Studio() {
  return (
    <section
      id="studio"
      className="px-8 md:px-12 lg:px-16 py-24 md:py-36"
      style={{ background: 'var(--forest-deep)', color: 'var(--paper)' }}
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <p className="eyebrow lg:col-span-3" style={{ color: 'var(--clay-light)' }}>
          — The studio
        </p>
        <div className="lg:col-span-9 flex flex-col gap-10">
          <h2 className="display text-[36px] md:text-[52px] lg:text-[68px] leading-[1.05] max-w-[22ch]">
            Flowi is a small studio in Westlands. We answer our own phones, write our own code, and finish what we start.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
            <div>
              <p className="display text-[44px]" style={{ fontVariationSettings: '"SOFT" 60, "opsz" 100' }}>
                3 day
              </p>
              <p className="meta mt-2" style={{ color: 'var(--ash-light)' }}>Typical turnaround</p>
            </div>
            <div>
              <p className="display text-[44px]" style={{ fontVariationSettings: '"SOFT" 60, "opsz" 100' }}>
                100%
              </p>
              <p className="meta mt-2" style={{ color: 'var(--ash-light)' }}>Built from scratch</p>
            </div>
            <div>
              <p className="display text-[44px]" style={{ fontVariationSettings: '"SOFT" 60, "opsz" 100' }}>
                4 / qtr
              </p>
              <p className="meta mt-2" style={{ color: 'var(--ash-light)' }}>Active commissions cap</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── SERVICES ─────────────────────────── */
function Services() {
  const items = [
    {
      no: '01',
      title: 'Custom Websites',
      body:
        'Marketing sites, e-commerce, booking flows, member portals. Built from scratch in Next.js — never copy-pasted from a WordPress theme. Lightning-fast on patchy 4G.',
    },
    {
      no: '02',
      title: 'Mobile Apps',
      body:
        'iOS and Android. React Native for cross-platform speed, native modules where it matters (camera, M-Pesa SDK, offline storage). Shipped to Play Store and App Store.',
    },
    {
      no: '03',
      title: 'AI Chatbots & Agents',
      body:
        'WhatsApp bots and on-site assistants trained on your products, prices, and policies. Handle inquiries, take orders, send M-Pesa STK pushes — 24 / 7.',
    },
    {
      no: '04',
      title: 'AI Video Production',
      body:
        'Marketing videos generated without crews, cameras, or studio fees. Cinematic, on-brand, ready for TikTok, Instagram, or your homepage hero. Days, not months.',
    },
    {
      no: '05',
      title: 'M-Pesa & Payments',
      body:
        'STK push, paybills, till numbers, recurring billing, crypto. Wired into your site or app with proper webhook handling and reconciliation that actually balances.',
    },
    {
      no: '06',
      title: 'SEO & Performance',
      body:
        'Schema markup, sitemaps, Core Web Vitals, structured data, ranking strategy. We make sure Google can read you — and that your site loads before your competitor\'s.',
    },
  ];

  return (
    <section id="services" className="px-8 md:px-12 lg:px-16 py-24 md:py-36 border-t" style={{ borderColor: 'var(--rule)' }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-16 md:mb-24 flex-wrap gap-6">
          <div>
            <p className="eyebrow mb-4">— What we do</p>
            <h2 className="display text-[40px] md:text-[64px] lg:text-[80px] leading-[1]">
              Six disciplines.
              <br />
              <span className="display-italic" style={{ color: 'var(--clay)' }}>
                One studio.
              </span>
            </h2>
          </div>
          <p className="meta max-w-[24ch]">
            We don&apos;t outsource. Everything below is built in-house, by the same hands.
          </p>
        </div>

        <div className="flex flex-col">
          {items.map((s, i) => (
            <motion.div
              key={s.no}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.04 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 py-10 md:py-14 border-t"
              style={{ borderColor: 'var(--rule)' }}
            >
              <div className="lg:col-span-1 meta">{s.no}</div>
              <h3 className="lg:col-span-5 display text-[26px] md:text-[36px] lg:text-[44px] leading-[1.05]">
                {s.title}
              </h3>
              <p className="lg:col-span-6 text-[15px] md:text-[16px] leading-[1.65]" style={{ color: 'var(--ash)' }}>
                {s.body}
              </p>
            </motion.div>
          ))}
          <div className="hairline" />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── PROCESS ─────────────────────────── */
function Process() {
  const steps = [
    {
      no: '01',
      title: 'Brief',
      body:
        'A 30-minute call. We listen. You describe the brand, the audience, and the outcome you actually need — more orders, more bookings, more credibility, fewer phone calls.',
    },
    {
      no: '02',
      title: 'Direction',
      body:
        'Within 48 hours: an aesthetic moodboard, type direction, sample layout, and a project plan with dates. You approve before we touch any code.',
    },
    {
      no: '03',
      title: 'Build',
      body:
        'We build. Daily Loom updates so you see the work form, not arrive. Feedback over WhatsApp, revisions overnight. No silent two-week stretches.',
    },
    {
      no: '04',
      title: 'Launch',
      body:
        'Goes live with proper analytics, SEO, and performance baselines. Source code, hosting access, and a one-page runbook handed over. Optional retainer for ongoing care.',
    },
  ];

  return (
    <section
      id="process"
      className="px-8 md:px-12 lg:px-16 py-24 md:py-36"
      style={{ background: 'var(--paper-warm)' }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          <p className="eyebrow lg:col-span-3">— How we work</p>
          <div className="lg:col-span-9">
            <h2 className="display text-[40px] md:text-[64px] lg:text-[80px] leading-[1] max-w-[16ch]">
              Four steps.
              <br />
              <span className="display-italic" style={{ color: 'var(--forest)' }}>
                Roughly two weeks.
              </span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--rule)] border" style={{ borderColor: 'var(--rule)' }}>
          {steps.map((s, i) => (
            <motion.div
              key={s.no}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="p-8 md:p-12 flex flex-col gap-5"
              style={{ background: 'var(--paper-warm)' }}
            >
              <div className="flex items-center justify-between">
                <span className="meta">{s.no}</span>
                <span
                  className="display-italic text-[20px]"
                  style={{ color: i % 2 === 0 ? 'var(--forest)' : 'var(--clay)' }}
                >
                  {i === 0 ? 'Day 0' : i === 1 ? 'Day 2' : i === 2 ? 'Days 3–10' : 'Day 12+'}
                </span>
              </div>
              <h3
                className="display text-[36px] md:text-[48px]"
                style={{ fontVariationSettings: '"SOFT" 60, "WONK" 1, "opsz" 100' }}
              >
                {s.title}
              </h3>
              <p className="text-[15px] md:text-[16px] leading-[1.65]" style={{ color: 'var(--ash)' }}>
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── TESTIMONIALS ─────────────────────────── */
/* TODO: Replace placeholder quotes below with real client testimonials. */
function Testimonials() {
  const quotes = [
    {
      quote:
        'They built our online showroom in a week. Customers now WhatsApp their orders straight from the site — we don\'t miss enquiries when the shop is closed.',
      author: 'King\'s & Queens Furniture',
      role: 'Furniture house, Githurai',
    },
    {
      quote:
        'Everyone else wanted three months and a quarter-million shillings. Flowi shipped a working booking site in five days, and it actually looks like our brand.',
      author: 'Mr Joseph',
      role: 'Premium Auto, carXPRESS Kiambu Road',
    },
    {
      quote:
        'They speak founder, not agency. We launched our trading platform with M-Pesa, crypto, and live performance reporting — all from one team.',
      author: 'Flowi Capital',
      role: 'In-house product · flowicapital.com',
    },
  ];

  return (
    <section
      id="words"
      className="px-8 md:px-12 lg:px-16 py-24 md:py-36 border-t"
      style={{ borderColor: 'var(--rule)' }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 md:mb-24">
          <p className="eyebrow lg:col-span-3">— Words</p>
          <div className="lg:col-span-9">
            <h2 className="display text-[40px] md:text-[64px] lg:text-[80px] leading-[1] max-w-[18ch]">
              What clients{' '}
              <span className="display-italic" style={{ color: 'var(--clay)' }}>
                say.
              </span>
            </h2>
          </div>
        </div>

        <div className="flex flex-col">
          {quotes.map((q, i) => (
            <motion.figure
              key={q.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 py-12 md:py-20 border-t"
              style={{ borderColor: 'var(--rule)' }}
            >
              <div className="lg:col-span-1 meta">{String(i + 1).padStart(2, '0')}</div>
              <blockquote className="lg:col-span-8">
                <p
                  className="display text-[28px] md:text-[44px] lg:text-[56px] leading-[1.15]"
                  style={{ fontVariationSettings: '"SOFT" 60, "WONK" 1, "opsz" 96' }}
                >
                  <span style={{ color: 'var(--clay)' }}>“</span>
                  {q.quote}
                  <span style={{ color: 'var(--clay)' }}>”</span>
                </p>
              </blockquote>
              <figcaption className="lg:col-span-3 lg:pt-2">
                <p className="display-italic text-[18px]" style={{ color: 'var(--forest)' }}>
                  — {q.author}
                </p>
                <p className="meta mt-2">{q.role}</p>
              </figcaption>
            </motion.figure>
          ))}
          <div className="hairline" />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── CONTACT ─────────────────────────── */
function Contact() {
  return (
    <section id="contact" className="px-8 md:px-12 lg:px-16 py-24 md:py-36">
      <div className="max-w-[1400px] mx-auto">
        <p className="eyebrow mb-8">— Begin a project</p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="display text-[48px] md:text-[80px] lg:text-[112px] leading-[0.95] max-w-[14ch] mb-16"
        >
          Tell us about
          <br />
          <span className="display-italic" style={{ color: 'var(--clay)' }}>
            your brand.
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <p className="text-[18px] md:text-[20px] leading-[1.55] max-w-[40ch] mb-10" style={{ color: 'var(--ash)' }}>
              We respond within four working hours. The fastest way to reach us
              is WhatsApp — send a few sentences about your business and what
              you&apos;re hoping to launch.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <a
                href="https://wa.me/254714257688?text=Hi%20Flowi%2C%20I%27d%20like%20to%20talk%20about%20a%20project."
                target="_blank"
                rel="noopener"
                className="ink-pill"
                style={{ background: 'var(--forest)' }}
              >
                WhatsApp the studio
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a href="mailto:hello@useflowi.app" className="ghost-link self-center">
                hello@useflowi.app
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-8 pt-2">
            <div>
              <p className="meta mb-2">Studio</p>
              <p className="text-[16px]">
                Westlands, Nairobi
                <br />
                <span style={{ color: 'var(--ash)' }}>By appointment only</span>
              </p>
            </div>
            <div>
              <p className="meta mb-2">Direct line</p>
              <p className="text-[16px]">
                +254 714 257 688
                <br />
                <span style={{ color: 'var(--ash)' }}>Mon–Fri · 8 AM – 6 PM EAT</span>
              </p>
            </div>
            <div>
              <p className="meta mb-2">Currently</p>
              <p className="text-[16px]">
                Booking briefs for{' '}
                <span style={{ color: 'var(--clay)' }}>April – June 2026</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

