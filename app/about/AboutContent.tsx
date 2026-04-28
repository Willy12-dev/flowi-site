'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';

const principles = [
  {
    no: '01',
    title: 'Speed without compromise',
    body:
      'We deliver in days, not months. But fast doesn\'t mean sloppy — every pixel is intentional, every line of code is clean. Our pipeline is the work of a single thoughtful operator with the right tools, not a relay race between five disengaged contractors.',
  },
  {
    no: '02',
    title: 'AI-first, but never AI-slop',
    body:
      'We integrate AI where it earns its place — chatbots that handle real conversations, marketing videos without crews, content engines that respect your brand voice. We never let AI strip the soul out of the work.',
  },
  {
    no: '03',
    title: 'Built for the way Africans actually use the web',
    body:
      'M-Pesa, WhatsApp-first, mobile-first, tolerant of patchy 4G. We build for how your customer is actually going to find you, browse you, and pay you — not for how a Silicon Valley designer thinks they should.',
  },
  {
    no: '04',
    title: 'No templates. Ever.',
    body:
      'Every project is custom-designed from scratch. Your brand deserves more than a tweaked WordPress theme that 10,000 other businesses are already running.',
  },
];

export default function AboutContent() {
  return (
    <div className="preview-scope min-h-screen overflow-x-hidden">
      <Nav variant="page" />

      <main>
        {/* Hero */}
        <section className="px-8 md:px-12 lg:px-16 pt-24 md:pt-36 pb-24 md:pb-36">
          <div className="max-w-[1400px] mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="eyebrow mb-10"
            >
              — The studio
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.2, 0, 0, 1] }}
              className="display text-[44px] sm:text-[64px] md:text-[88px] lg:text-[112px] leading-[1] max-w-[18ch]"
            >
              A small Nairobi studio
              <br />
              building the digital
              <br />
              face of{' '}
              <span className="display-italic" style={{ color: 'var(--clay)' }}>
                ambitious brands.
              </span>
            </motion.h1>
          </div>
        </section>

        {/* Story */}
        <section className="px-8 md:px-12 lg:px-16 py-24 md:py-36 border-t" style={{ borderColor: 'var(--rule)' }}>
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
            <p className="eyebrow lg:col-span-3">— Why we exist</p>
            <div className="lg:col-span-9 flex flex-col gap-8 max-w-[68ch]">
              <p className="text-[20px] md:text-[24px] leading-[1.5] display" style={{ fontVariationSettings: '"SOFT" 30, "opsz" 36', fontWeight: 400 }}>
                Flowi started with a simple observation: Kenyan businesses deserve better than overpriced agencies delivering mediocre templates.
              </p>
              <p className="text-[16px] md:text-[18px] leading-[1.7]" style={{ color: 'var(--ash)' }}>
                We saw furniture houses, restaurants, fashion brands, and tech companies all struggling with websites that looked like they were built in 2010 — slow, generic, expensive to update, and embarrassed of their own audience. We thought there was a better way.
              </p>
              <p className="text-[16px] md:text-[18px] leading-[1.7]" style={{ color: 'var(--ash)' }}>
                So we built Flowi: an AI-augmented studio where a single craftsperson with the right tools can deliver what used to take a team of ten. A 3-day turnaround isn&apos;t a marketing gimmick — it&apos;s how we actually work, on every project, every quarter.
              </p>
              <p className="text-[16px] md:text-[18px] leading-[1.7]" style={{ color: 'var(--ash)' }}>
                Today we don&apos;t just build websites. We build AI chatbots that handle your customers, marketing videos generated without crews, mobile apps for the Kenyan retail floor, and trading platforms with M-Pesa wired in. Everything a modern African business needs to compete globally — at a price that makes sense locally.
              </p>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="px-8 md:px-12 lg:px-16 py-24 md:py-36 border-t" style={{ borderColor: 'var(--rule)' }}>
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
              <div>
                <p className="eyebrow mb-4">— What we believe</p>
                <h2 className="display text-[40px] md:text-[64px] lg:text-[80px] leading-[1]">
                  Four principles.
                </h2>
              </div>
              <p className="meta max-w-[20ch]">
                The reasons clients keep coming back, and the reasons we say no.
              </p>
            </div>

            <div className="flex flex-col">
              {principles.map((p, i) => (
                <motion.div
                  key={p.no}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, delay: i * 0.05 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 py-10 md:py-14 border-t"
                  style={{ borderColor: 'var(--rule)' }}
                >
                  <div className="lg:col-span-1 meta">{p.no}</div>
                  <h3 className="lg:col-span-5 display text-[26px] md:text-[36px] lg:text-[44px] leading-[1.05]">
                    {p.title}
                  </h3>
                  <p className="lg:col-span-6 text-[15px] md:text-[16px] leading-[1.65]" style={{ color: 'var(--ash)' }}>
                    {p.body}
                  </p>
                </motion.div>
              ))}
              <div className="hairline" />
            </div>
          </div>
        </section>

        {/* Studio strip */}
        <section className="px-8 md:px-12 lg:px-16 py-24 md:py-36" style={{ background: 'var(--forest-deep)', color: 'var(--paper)' }}>
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
            <p className="eyebrow lg:col-span-3" style={{ color: 'var(--clay-light)' }}>
              — The team
            </p>
            <div className="lg:col-span-9 flex flex-col gap-12">
              <h2 className="display text-[36px] md:text-[52px] lg:text-[64px] leading-[1.05] max-w-[22ch]">
                We answer our own phones, write our own code, and finish what we start.
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
                <div>
                  <p className="display text-[44px]" style={{ fontVariationSettings: '"SOFT" 60, "opsz" 100' }}>3 day</p>
                  <p className="meta mt-2" style={{ color: 'var(--ash-light)' }}>Typical turnaround</p>
                </div>
                <div>
                  <p className="display text-[44px]" style={{ fontVariationSettings: '"SOFT" 60, "opsz" 100' }}>100%</p>
                  <p className="meta mt-2" style={{ color: 'var(--ash-light)' }}>Built from scratch</p>
                </div>
                <div>
                  <p className="display text-[44px]" style={{ fontVariationSettings: '"SOFT" 60, "opsz" 100' }}>4 / qtr</p>
                  <p className="meta mt-2" style={{ color: 'var(--ash-light)' }}>Active commissions cap</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-8 md:px-12 lg:px-16 py-24 md:py-36">
          <div className="max-w-[1400px] mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="display text-[40px] md:text-[72px] lg:text-[96px] leading-[0.95] max-w-[16ch] mb-12"
            >
              Got a project worth
              <br />
              <span className="display-italic" style={{ color: 'var(--clay)' }}>
                building well?
              </span>
            </motion.h2>
            <div className="flex flex-col sm:flex-row gap-5">
              <a
                href="https://wa.me/254714257688?text=Hi%20Flowi%2C%20I%27d%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener"
                className="ink-pill"
                style={{ background: 'var(--forest)' }}
              >
                WhatsApp the studio
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a href="/portfolio" className="ghost-link self-center">See recent work</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
