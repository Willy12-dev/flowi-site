'use client';

import type { Metadata } from 'next';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const projects = [
  {
    title: 'TrendyAirdrops',
    category: 'Web App + Mobile',
    description:
      'Crypto airdrop aggregator with live prices, DEX swap, wallet checker, and premium subscription features. Built with Next.js, React Native, and Supabase.',
    tags: ['Next.js', 'React Native', 'Supabase', 'Crypto', 'M-Pesa'],
    url: 'https://trendyairdrops.com',
    image: '/images/portfolio-trendy.png',
    color: 'from-blue-500/30 to-purple-500/30',
    results: '5K+ users in first month',
  },
  {
    title: 'Woyuduin',
    category: 'Web App + Mobile',
    description:
      'Recovery app with VPN-based content blocker, AI counselor chatbot, accountability partners, community feed, therapist marketplace, and crypto payments.',
    tags: ['React Native', 'AI/ML', 'Supabase', 'Crypto Payments', 'VPN'],
    url: 'https://woyuduin.com',
    image: '/images/portfolio-woyuduin.png',
    color: 'from-violet-500/30 to-pink-500/30',
    results: '22 screens, full backend',
  },
  {
    title: 'Flowi Capital',
    category: 'Trading Platform',
    description:
      'Automated copy-trading platform with EA license management, real-time trade reporting, crypto & M-Pesa payments, and Telegram notifications.',
    tags: ['Next.js', 'TypeScript', 'Turso DB', 'MT5 API', 'Crypto'],
    url: 'https://flowicapital.com',
    image: '/images/portfolio-trendy.png',
    color: 'from-amber-500/30 to-orange-500/30',
    results: '847% monthly returns tracked',
  },
  {
    title: 'Nairobi Furniture Co.',
    category: 'E-Commerce',
    description:
      'Premium furniture e-commerce with product catalog, M-Pesa payment integration, WhatsApp ordering, and delivery tracking. Mobile-first design.',
    tags: ['E-Commerce', 'M-Pesa', 'WhatsApp', 'Delivery Tracking'],
    image: '/images/portfolio-furniture.png',
    color: 'from-cyan-500/30 to-blue-500/30',
    results: 'Orders from day 1',
  },
  {
    title: 'Luna & Ember',
    category: 'Restaurant Booking',
    description:
      'Restaurant website with online menu, table reservations, food ordering system, and WhatsApp notifications for order updates.',
    tags: ['Bookings', 'Menu System', 'WhatsApp', 'M-Pesa'],
    image: '/images/portfolio-restaurant.png',
    color: 'from-emerald-500/30 to-teal-500/30',
    results: '3x reservations increase',
  },
  {
    title: 'StyleHouse Kenya',
    category: 'Fashion E-Commerce',
    description:
      'Fashion brand e-commerce with AI-powered WhatsApp chatbot handling 80% of customer inquiries automatically. Integrated with M-Pesa.',
    tags: ['AI Chatbot', 'WhatsApp', 'E-Commerce', 'M-Pesa'],
    image: '/images/portfolio-furniture.png',
    color: 'from-pink-500/30 to-rose-500/30',
    results: '80% inquiries automated',
  },
];

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 bg-mesh overflow-hidden">
          <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-blue/[0.08] rounded-full blur-[120px]" />
          <div className="max-w-5xl mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <span className="inline-block text-blue text-sm font-semibold tracking-widest uppercase bg-blue/10 px-4 py-1.5 rounded-full mb-4">
                Portfolio
              </span>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Work That <span className="text-gradient-blue">Speaks</span>
              </h1>
              <p className="text-muted text-lg mt-6 max-w-2xl mx-auto">
                Real projects. Real results. See what we&apos;ve built for businesses like yours.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, i) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group glass-card rounded-2xl overflow-hidden hover:border-blue/20 transition-all duration-500"
                >
                  <div className={`h-56 bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}>
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                      />
                    )}
                  </div>
                  <div className="p-7">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xs font-medium text-blue-light">{project.category}</span>
                        <h3 className="text-xl font-bold mt-1">{project.title}</h3>
                      </div>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:border-blue/30 hover:bg-blue/10 transition-all"
                        >
                          <ExternalLink className="w-4 h-4 text-muted" />
                        </a>
                      )}
                    </div>
                    <p className="text-muted text-sm leading-relaxed mb-4">{project.description}</p>
                    {project.results && (
                      <div className="text-xs font-semibold text-blue-light bg-blue/10 inline-block px-3 py-1 rounded-full mb-4">
                        {project.results}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-white/[0.04] text-muted border border-white/[0.06] px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
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
                Want to Be <span className="text-gradient-blue">Next</span>?
              </h2>
              <p className="text-muted mb-8">
                Your project could be here. Let&apos;s build something your competitors will envy.
              </p>
              <a
                href="https://wa.me/254714257688?text=Hi%20Flowi%2C%20I%20saw%20your%20portfolio%20and%20want%20to%20discuss%20a%20project"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 bg-blue hover:bg-blue-light text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(74,123,255,0.3)]"
              >
                Start Your Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
