'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const projects = [
  {
    title: 'TrendyAirdrops',
    category: 'Web App + Mobile',
    description:
      'Crypto airdrop aggregator with live prices, DEX swap, wallet checker, and premium features.',
    tags: ['Next.js', 'React Native', 'Supabase', 'Crypto'],
    url: 'https://trendyairdrops.com',
    image: '/images/portfolio-trendy.png',
    color: 'from-blue-500/30 to-purple-500/30',
  },
  {
    title: 'Woyuduin',
    category: 'Web App + Mobile',
    description:
      'Recovery app with VPN blocker, AI counselor, accountability partners, and therapist marketplace.',
    tags: ['Next.js', 'AI/ML', 'VPN', 'Health'],
    url: 'https://woyuduin.com',
    image: '/images/portfolio-woyuduin.png',
    color: 'from-violet-500/30 to-pink-500/30',
  },
  {
    title: 'Nairobi Furniture Co.',
    category: 'E-Commerce',
    description:
      'Premium furniture e-commerce with M-Pesa integration, WhatsApp ordering, and delivery tracking.',
    tags: ['E-Commerce', 'M-Pesa', 'WhatsApp', 'Delivery'],
    image: '/images/portfolio-furniture.png',
    color: 'from-cyan-500/30 to-blue-500/30',
  },
  {
    title: 'Luna & Ember',
    category: 'Restaurant Booking',
    description:
      'Online menu, table reservations, and food ordering system with WhatsApp notifications.',
    tags: ['Bookings', 'Menu', 'WhatsApp', 'Payments'],
    image: '/images/portfolio-restaurant.png',
    color: 'from-emerald-500/30 to-teal-500/30',
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-32 relative">
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-blue text-sm font-semibold tracking-widest uppercase bg-blue/10 px-4 py-1.5 rounded-full mb-4">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-bold">
            Featured <span className="text-gradient-blue">Projects</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
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
                {!project.image && (
                  <div className="text-5xl font-bold text-white/10">{project.title.charAt(0)}</div>
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
  );
}
