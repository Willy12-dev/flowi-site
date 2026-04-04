'use client';

import type { Metadata } from 'next';
import { motion } from 'framer-motion';
import { Zap, Users, Clock, Award } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const stats = [
  { icon: Zap, value: '50+', label: 'Projects Delivered' },
  { icon: Users, value: '40+', label: 'Happy Clients' },
  { icon: Clock, value: '3 Days', label: 'Avg. Delivery' },
  { icon: Award, value: '98%', label: 'Satisfaction Rate' },
];

const values = [
  {
    title: 'Speed Without Compromise',
    description:
      'We deliver in days, not months. But fast doesn\'t mean sloppy — every pixel is intentional, every line of code is clean.',
  },
  {
    title: 'AI-First Thinking',
    description:
      'We integrate AI into everything we build — from chatbots that handle your customers to videos that sell your product. The future is now.',
  },
  {
    title: 'Built for Africa',
    description:
      'M-Pesa, WhatsApp, mobile-first — we build for how Africans actually use technology. No copy-paste from Silicon Valley.',
  },
  {
    title: 'No Templates, Ever',
    description:
      'Every project is custom-designed from scratch. Your brand deserves more than a tweaked WordPress theme.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 bg-mesh overflow-hidden">
          <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-blue/[0.08] rounded-full blur-[120px]" />
          <div className="max-w-5xl mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <span className="inline-block text-blue text-sm font-semibold tracking-widest uppercase bg-blue/10 px-4 py-1.5 rounded-full mb-4">
                About Us
              </span>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                We Build the <span className="text-gradient-blue">Future</span> of
                <br />
                African Business Online
              </h1>
              <p className="text-muted text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
                Flowi is a premium digital agency based in Nairobi, Kenya. We combine cutting-edge AI
                with world-class design to help businesses dominate online — in days, not months.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 border-y border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue/10 flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-5 h-5 text-blue-light" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gradient-blue">{stat.value}</div>
                  <div className="text-muted text-sm mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-24 bg-mesh">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-blue text-sm font-semibold tracking-widest uppercase bg-blue/10 px-4 py-1.5 rounded-full mb-4">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                From Nairobi to the <span className="text-gradient-blue">World</span>
              </h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  Flowi started with a simple observation: Kenyan businesses deserve better than
                  overpriced agencies delivering mediocre templates. We saw restaurants, furniture stores,
                  fashion brands, and tech companies struggling with websites that looked like they were
                  built in 2010.
                </p>
                <p>
                  So we built something different. An agency powered by AI — where a single developer
                  with the right tools can deliver what used to take a team of ten. Where a 3-day
                  turnaround isn&apos;t a marketing gimmick, it&apos;s how we actually work.
                </p>
                <p>
                  Today, we don&apos;t just build websites. We build AI chatbots that handle your customers
                  24/7, produce marketing videos without cameras or crews, integrate M-Pesa payments,
                  and automate your WhatsApp. Everything a modern African business needs to compete
                  globally — at a price that makes sense locally.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="inline-block text-blue text-sm font-semibold tracking-widest uppercase bg-blue/10 px-4 py-1.5 rounded-full mb-4">
                Our Values
              </span>
              <h2 className="text-3xl md:text-4xl font-bold">
                What We <span className="text-gradient-blue">Stand For</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card rounded-2xl p-7 hover:border-blue/20 transition-all duration-500"
                >
                  <h3 className="text-lg font-bold mb-3">{value.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-mesh">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Build <span className="text-gradient-blue">Something Great</span>?
              </h2>
              <p className="text-muted mb-8">
                Let&apos;s talk about your project. No commitment, no pressure — just a conversation.
              </p>
              <a
                href="https://wa.me/254714257688?text=Hi%20Flowi%2C%20I%27d%20like%20to%20discuss%20a%20project"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue hover:bg-blue-light text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(74,123,255,0.3)]"
              >
                Start a Conversation on WhatsApp
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
