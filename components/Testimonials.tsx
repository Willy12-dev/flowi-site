'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'James Mwangi',
    role: 'Owner, Prestige Furniture',
    text: 'Flowi transformed our furniture business. We went from zero online presence to a professional e-commerce site with M-Pesa in just 4 days. Orders started coming in the first week.',
    rating: 5,
  },
  {
    name: 'Grace Wanjiku',
    role: 'Manager, Savanna Bistro',
    text: "Our restaurant's online reservations tripled after Flowi built our website. The WhatsApp integration means customers can book a table in seconds. Best investment we've made.",
    rating: 5,
  },
  {
    name: 'David Ochieng',
    role: 'CEO, NairobiTech Solutions',
    text: 'We needed a client portal with automated invoicing and M-Pesa payments. Flowi delivered in under a week. Design quality on par with international agencies at a fraction of the cost.',
    rating: 5,
  },
  {
    name: 'Sarah Kimani',
    role: 'Founder, StyleHouse Kenya',
    text: 'The WhatsApp chatbot Flowi built handles 80% of our customer inquiries automatically. Our team can finally focus on growing the business instead of answering the same questions.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-32 relative bg-mesh">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-blue text-sm font-semibold tracking-widest uppercase bg-blue/10 px-4 py-1.5 rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold">
            What Our <span className="text-gradient-blue">Clients</span> Say
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-7 hover:border-blue/20 transition-all duration-500"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue/10 flex items-center justify-center text-blue-light font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-muted text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
