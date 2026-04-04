'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 'KES 50,000',
    usd: '~$400',
    description: 'Perfect for small businesses getting online',
    features: [
      'Single-page website',
      'Mobile responsive',
      'Contact form + WhatsApp CTA',
      'Basic SEO setup',
      'Google Analytics',
      'AI chatbot (basic)',
      '1 month support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Professional',
    price: 'KES 120,000',
    usd: '~$950',
    description: 'For businesses ready to dominate online',
    features: [
      'Multi-page website (up to 8 pages)',
      'Premium custom design',
      'M-Pesa payment integration',
      'WhatsApp automation',
      'AI chatbot (website + WhatsApp)',
      'AI promo video (1 video)',
      'Advanced SEO + blog setup',
      'Admin dashboard',
      'Speed optimization',
      '3 months support',
    ],
    cta: 'Most Popular',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'KES 300,000+',
    usd: '~$2,400+',
    description: 'Full-scale digital transformation',
    features: [
      'Custom web app or platform',
      'Mobile app (iOS + Android)',
      'Full M-Pesa + payment suite',
      'AI chatbot (fully custom, trained on your business)',
      'AI video package (5 videos)',
      'WhatsApp AI automation',
      'Custom admin panel',
      'API integrations',
      'Booking/ordering system',
      '6 months support + training',
    ],
    cta: 'Talk to Us',
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue/[0.04] rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-blue text-sm font-semibold tracking-widest uppercase bg-blue/10 px-4 py-1.5 rounded-full mb-4">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold">
            Transparent <span className="text-gradient-blue">Pricing</span>
          </h2>
          <p className="text-muted mt-4 max-w-xl mx-auto">
            No hidden fees. No surprises. You know exactly what you're paying for.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.popular
                  ? 'glass-card-light border-blue/30 glow-blue'
                  : 'glass-card hover:border-blue/20'
              } transition-all duration-500`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue text-white text-xs font-bold px-4 py-1.5 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="text-muted text-sm mt-1">{plan.description}</p>
              </div>
              <div className="mb-8">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted text-sm ml-2">{plan.usd}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-blue-light shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`block text-center py-3.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                  plan.popular
                    ? 'bg-blue hover:bg-blue-light text-white hover:shadow-[0_0_30px_rgba(74,123,255,0.3)]'
                    : 'bg-blue/10 border border-blue/20 text-blue-light hover:bg-blue/20'
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
