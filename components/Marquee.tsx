'use client';

import { motion } from 'framer-motion';

const items = [
  'Web Design',
  'Mobile Apps',
  'AI Chatbots',
  'AI Video Production',
  'WhatsApp Bots',
  'M-Pesa Integration',
  'UI/UX Design',
  'SEO Optimization',
  'E-Commerce',
  'Automation',
  'Dashboards',
];

export default function Marquee() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative border-y border-white/[0.06] py-5 overflow-hidden bg-white/[0.02]"
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center mx-8 text-sm font-medium text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-blue mr-3" />
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
