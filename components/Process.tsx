'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Lightbulb, Code2, Rocket } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    step: '01',
    title: 'Discovery Call',
    description: 'Quick WhatsApp chat to understand your business, goals, and vision. No jargon — just a real conversation.',
  },
  {
    icon: Lightbulb,
    step: '02',
    title: 'Design & Strategy',
    description: 'Premium visuals tailored to your brand. You review, we refine. No templates, no compromises.',
  },
  {
    icon: Code2,
    step: '03',
    title: 'Build & Integrate',
    description: 'Modern tech — fast, secure, scalable. M-Pesa, WhatsApp, booking systems — all wired up.',
  },
  {
    icon: Rocket,
    step: '04',
    title: 'Launch & Support',
    description: 'Deploy live, set up analytics, hand over everything. Plus ongoing support to keep things running.',
  },
];

export default function Process() {
  return (
    <section id="process" className="py-32 relative bg-mesh">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-blue text-sm font-semibold tracking-widest uppercase bg-blue/10 px-4 py-1.5 rounded-full mb-4">
            Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold">
            How We <span className="text-gradient-blue">Work</span>
          </h2>
          <p className="text-muted mt-4 max-w-xl mx-auto">
            From idea to launch in as little as 3 days.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative glass-card rounded-2xl p-7 hover:border-blue/20 transition-all duration-500 hover:glow-blue"
            >
              <span className="text-6xl font-black text-blue/[0.06] absolute top-4 right-4">
                {step.step}
              </span>
              <div className="w-11 h-11 rounded-xl bg-blue/10 flex items-center justify-center mb-5">
                <step.icon className="w-5 h-5 text-blue-light" />
              </div>
              <h3 className="text-lg font-bold mb-3">{step.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
