'use client';

import type { Metadata } from 'next';
import { motion } from 'framer-motion';
import { Bot, MessageCircle, Globe, ShoppingCart, Clock, Brain, Shield, TrendingUp, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const features = [
  {
    icon: Brain,
    title: 'Trained on Your Business',
    description: 'Your chatbot knows your products, prices, policies, and FAQs. It answers like your best employee — but never sleeps.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Integration',
    description: 'Meet your customers where they are. AI chatbot on WhatsApp handles inquiries, takes orders, and sends payment links.',
  },
  {
    icon: Globe,
    title: 'Website Chat Widget',
    description: 'Beautiful chat widget embedded on your site. Captures leads, answers questions, and books appointments automatically.',
  },
  {
    icon: ShoppingCart,
    title: 'Order & Booking Automation',
    description: 'Customers can browse products, place orders, and book services — all through natural conversation with your AI.',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Your AI assistant never takes a day off. Handle customer inquiries at 3 AM on a Sunday — no extra staff needed.',
  },
  {
    icon: Shield,
    title: 'Human Handoff',
    description: 'Complex issues get escalated to your team automatically. The AI knows when to step back and let a human take over.',
  },
];

const useCases = [
  { business: 'Restaurants', use: 'Take orders, share menu, handle reservations via WhatsApp' },
  { business: 'E-Commerce', use: 'Product recommendations, order tracking, returns processing' },
  { business: 'Real Estate', use: 'Property inquiries, schedule viewings, qualify leads' },
  { business: 'Healthcare', use: 'Appointment booking, symptom pre-screening, follow-up reminders' },
  { business: 'Professional Services', use: 'Lead qualification, quote requests, consultation booking' },
  { business: 'Education', use: 'Course info, enrollment, student support' },
];

const pricing = [
  {
    name: 'Starter Bot',
    price: 'KES 30,000',
    usd: '~$240',
    period: 'one-time setup',
    features: ['Basic FAQ chatbot', 'Up to 50 trained responses', 'Website chat widget', 'Email notifications', '1 month support'],
    popular: false,
  },
  {
    name: 'Business Bot',
    price: 'KES 80,000',
    usd: '~$640',
    period: 'one-time setup',
    features: ['AI-powered responses', 'WhatsApp + Website', 'Order/booking automation', 'M-Pesa payment links', 'CRM integration', 'Lead capture & scoring', '3 months support'],
    popular: true,
  },
  {
    name: 'Enterprise Bot',
    price: 'KES 200,000+',
    usd: '~$1,600+',
    period: 'custom build',
    features: ['Fully custom AI assistant', 'Multi-channel (WhatsApp, Web, SMS)', 'Advanced integrations (ERP, CRM)', 'Custom training pipeline', 'Analytics dashboard', 'Dedicated support', '6 months support + training'],
    popular: false,
  },
];

export default function AIChatbotsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 bg-mesh overflow-hidden">
          <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-blue/[0.08] rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-accent/[0.06] rounded-full blur-[120px]" />
          <div className="max-w-5xl mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <span className="inline-block text-blue text-sm font-semibold tracking-widest uppercase bg-blue/10 px-4 py-1.5 rounded-full mb-4">
                AI Chatbots
              </span>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Your Business, <span className="text-gradient-blue">Always On</span>
              </h1>
              <p className="text-muted text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
                AI-powered chatbots that handle customer inquiries, take orders, and close sales — on
                WhatsApp and your website. 24/7, no extra staff.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/254714257688?text=Hi%20Flowi%2C%20I%27m%20interested%20in%20an%20AI%20chatbot%20for%20my%20business"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 bg-blue hover:bg-blue-light text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(74,123,255,0.3)]"
                >
                  Get Your AI Chatbot
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                What Your AI <span className="text-gradient-blue">Can Do</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card rounded-2xl p-7 hover:border-blue/20 transition-all duration-500"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue/10 flex items-center justify-center mb-5">
                    <feature.icon className="w-5 h-5 text-blue-light" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-24 bg-mesh">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                Built for <span className="text-gradient-blue">Every Industry</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-4">
              {useCases.map((uc, i) => (
                <motion.div
                  key={uc.business}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex items-start gap-4 glass-card rounded-xl p-5"
                >
                  <div className="w-2 h-2 rounded-full bg-blue mt-2 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">{uc.business}</div>
                    <div className="text-muted text-xs mt-1">{uc.use}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                Chatbot <span className="text-gradient-blue">Pricing</span>
              </h2>
              <p className="text-muted mt-4">One-time setup. Your AI, your rules.</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {pricing.map((plan, i) => (
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
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <p className="text-muted text-xs mt-1">{plan.period}</p>
                  <div className="my-6">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted text-sm ml-2">{plan.usd}</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <TrendingUp className="w-4 h-4 text-blue-light shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://wa.me/254714257688?text=Hi%20Flowi%2C%20I%27m%20interested%20in%20an%20AI%20chatbot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block text-center py-3.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                      plan.popular
                        ? 'bg-blue hover:bg-blue-light text-white'
                        : 'bg-blue/10 border border-blue/20 text-blue-light hover:bg-blue/20'
                    }`}
                  >
                    Get Started
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
