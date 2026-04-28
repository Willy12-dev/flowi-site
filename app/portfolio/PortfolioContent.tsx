'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';

type Project = {
  no: string;
  year: string;
  client: string;
  category: string;
  location: string;
  brief: string;
  services: string[];
  results?: string;
  href?: string;
  external?: boolean;
  tone: 'forest' | 'clay';
};

const projects: Project[] = [
  {
    no: '01',
    year: '2026',
    client: 'King\'s & Queens Furniture',
    category: 'E-commerce / Furniture',
    location: 'Githurai, Nairobi',
    brief:
      'A flagship online showroom for a Thika Road furniture house — bringing their bespoke sofas, dining sets, and bedroom collections to a polished digital storefront with WhatsApp ordering and a working admin panel.',
    services: ['Web Design', 'E-commerce', 'WhatsApp Order Flow', 'Admin Panel'],
    results: 'Live admin operating in production',
    href: 'https://furniture-demo-zeta.vercel.app',
    external: true,
    tone: 'forest',
  },
  {
    no: '02',
    year: '2026',
    client: 'Mr Joseph — Premium Auto',
    category: 'Booking / Service',
    location: 'carXPRESS, Kiambu Road',
    brief:
      'Booking site for a premium auto specialist. Service request flow, vehicle drop-off scheduling, and a portfolio of restored builds — all from a single mobile-first interface tuned for a Kiambu Road clientele.',
    services: ['Web Design', 'Booking Flow', 'Mobile-First', 'SEO'],
    href: 'https://mrjoseph-premium.vercel.app',
    external: true,
    tone: 'clay',
  },
  {
    no: '03',
    year: '2026',
    client: 'Flowi Capital',
    category: 'Trading Platform',
    location: 'In-house product',
    brief:
      'A copy-trading and profit-sharing platform built around our own MT5 expert advisor. EA license management, real-time trade reporting, M-Pesa & crypto subscriptions, Telegram notifications, and a live performance dashboard.',
    services: ['Product Design', 'Full-stack', 'MT5 API', 'M-Pesa & Crypto'],
    results: '847% monthly returns tracked in production',
    href: 'https://flowicapital.com',
    external: true,
    tone: 'forest',
  },
  {
    no: '04',
    year: '2026',
    client: 'Nimoo POS',
    category: 'Mobile App / Retail',
    location: 'In-house product',
    brief:
      'A point-of-sale Android app for Kenyan retailers. Camera-driven product scanning, M-Pesa till integration, offline-first sync — designed for a duka, not a Starbucks.',
    services: ['Mobile App', 'Product Design', 'Camera AI', 'M-Pesa'],
    results: 'v1.0.0 shipped to Play Store',
    href: '/nimoo',
    external: false,
    tone: 'clay',
  },
  {
    no: '05',
    year: '2025',
    client: 'Woyuduin',
    category: 'Recovery App',
    location: 'In-house product',
    brief:
      'Recovery app with VPN-based content blocker, AI counselor chatbot, accountability partners, community feed, therapist marketplace, and crypto payments. 22 screens, full backend.',
    services: ['React Native', 'AI/ML', 'Supabase', 'Crypto Payments', 'VPN'],
    href: 'https://woyuduin.com',
    external: true,
    tone: 'forest',
  },
  {
    no: '06',
    year: '2025',
    client: 'TrendyAirdrops',
    category: 'Web App + Mobile',
    location: 'Crypto / Global',
    brief:
      'Crypto airdrop aggregator with live prices, DEX swap, wallet checker, and premium subscription features. Built with Next.js, React Native, and Supabase. M-Pesa for the local subscription tier.',
    services: ['Next.js', 'React Native', 'Supabase', 'Crypto'],
    results: '5K+ users in first month',
    href: 'https://trendyairdrops.com',
    external: true,
    tone: 'clay',
  },
];

export default function PortfolioContent() {
  return (
    <div className="preview-scope min-h-screen overflow-x-hidden">
      <Nav variant="page" />

      <main>
        {/* Hero */}
        <section className="px-8 md:px-12 lg:px-16 pt-24 md:pt-36 pb-20 md:pb-28">
          <div className="max-w-[1400px] mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="eyebrow mb-10"
            >
              — Selected work, 2025–2026
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.2, 0, 0, 1] }}
              className="display text-[44px] sm:text-[64px] md:text-[88px] lg:text-[112px] leading-[1] max-w-[16ch]"
            >
              Real projects.
              <br />
              <span className="display-italic" style={{ color: 'var(--clay)' }}>
                Real results.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-12 text-[16px] md:text-[18px] leading-[1.55] max-w-[52ch]"
              style={{ color: 'var(--ash)' }}
            >
              A small studio doing three or four projects a quarter. Furniture, auto, fintech, retail, recovery, crypto — every project hand-built from scratch in our Westlands office. Click any row to see the live work.
            </motion.p>
          </div>
        </section>

        {/* Projects list */}
        <section className="px-8 md:px-12 lg:px-16 pb-24 md:pb-36">
          <div className="max-w-[1400px] mx-auto flex flex-col">
            {projects.map((p, i) => (
              <motion.a
                key={p.no}
                href={p.href ?? '/#contact'}
                {...(p.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: i * 0.04 }}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 py-10 md:py-14 border-t hover:bg-[rgba(15,15,15,0.02)] transition-colors duration-500"
                style={{ borderColor: 'var(--rule)' }}
              >
                <div className="lg:col-span-1 meta flex lg:flex-col gap-3 lg:gap-1">
                  <span>{p.no}</span>
                  <span style={{ color: 'var(--ash-light)' }}>{p.year}</span>
                </div>

                <div className="lg:col-span-5">
                  <p className="meta mb-2" style={{ color: p.tone === 'forest' ? 'var(--forest)' : 'var(--clay)' }}>
                    {p.category}
                  </p>
                  <h3 className="display text-[28px] md:text-[40px] lg:text-[52px] leading-[1.05] mb-3 group-hover:translate-x-1 transition-transform duration-500 ease-out">
                    {p.client}
                  </h3>
                  <p className="meta">{p.location}</p>
                </div>

                <div className="lg:col-span-5">
                  <p className="text-[15px] md:text-[16px] leading-[1.6] mb-5" style={{ color: 'var(--ash)' }}>
                    {p.brief}
                  </p>
                  {p.results && (
                    <p
                      className="display-italic text-[18px] mb-5"
                      style={{ color: p.tone === 'forest' ? 'var(--forest)' : 'var(--clay)' }}
                    >
                      &mdash; {p.results}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {p.services.map((s) => (
                      <span
                        key={s}
                        className="text-[11px] tracking-[0.08em] uppercase border rounded-full px-3 py-1.5"
                        style={{
                          borderColor: 'var(--rule-strong)',
                          color: p.tone === 'forest' ? 'var(--forest)' : 'var(--clay)',
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
        </section>

        {/* CTA */}
        <section className="px-8 md:px-12 lg:px-16 py-24 md:py-36 border-t" style={{ borderColor: 'var(--rule)' }}>
          <div className="max-w-[1400px] mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="display text-[40px] md:text-[72px] lg:text-[96px] leading-[0.95] max-w-[14ch] mb-12"
            >
              Want to be{' '}
              <span className="display-italic" style={{ color: 'var(--clay)' }}>
                next?
              </span>
            </motion.h2>
            <p className="text-[18px] md:text-[20px] leading-[1.55] max-w-[40ch] mb-10" style={{ color: 'var(--ash)' }}>
              We&apos;re booking April–June 2026 now. Send a few sentences about your business and what
              you&apos;re hoping to launch — we&apos;ll come back within four working hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <a
                href="https://wa.me/254714257688?text=Hi%20Flowi%2C%20I%20saw%20the%20portfolio%20and%20want%20to%20talk%20about%20a%20project."
                target="_blank"
                rel="noopener"
                className="ink-pill"
                style={{ background: 'var(--forest)' }}
              >
                WhatsApp the studio
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a href="/about" className="ghost-link self-center">More about Flowi</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
