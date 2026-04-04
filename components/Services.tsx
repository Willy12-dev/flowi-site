'use client';

import { motion } from 'framer-motion';
import {
  Globe,
  Smartphone,
  MessageCircle,
  CreditCard,
  Bot,
  Video,
  Palette,
  Search,
} from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: 'Website Development',
    description:
      'High-performance Next.js websites with premium design. Fast, SEO-optimized, and mobile-first.',
    features: ['Custom Design', 'Responsive', 'CMS Integration', 'Analytics'],
    image: '/images/service-web.png',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    description:
      'Cross-platform mobile apps for iOS and Android. Native performance with a single codebase.',
    features: ['iOS & Android', 'Push Notifications', 'Offline Mode', 'App Store Launch'],
    image: '/images/service-app.png',
  },
  {
    icon: Bot,
    title: 'AI Chatbots & Automation',
    description:
      'Intelligent AI assistants for your website and WhatsApp. Handle customer inquiries, take orders, and close sales 24/7.',
    features: ['AI-Powered Responses', 'WhatsApp Bot', 'Website Chat', 'Lead Capture'],
    image: '/images/service-automation.png',
  },
  {
    icon: Video,
    title: 'AI Video Production',
    description:
      'Professional AI-generated videos for marketing, product demos, and social media. No cameras, no crew — just results.',
    features: ['AI Spokespersons', 'Product Demos', 'Social Ads', 'Explainer Videos'],
    image: '/images/service-uiux.png',
  },
  {
    icon: CreditCard,
    title: 'M-Pesa Integration',
    description:
      'Seamless M-Pesa payment integration. STK push, C2B, B2C, and auto-confirmation.',
    features: ['STK Push', 'Auto Confirmation', 'Dashboard', 'Reconciliation'],
    image: '/images/service-mpesa.png',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Automation',
    description:
      'Automated chatbots that handle inquiries, take orders, and process payments 24/7.',
    features: ['Auto-Reply', 'Order Taking', 'Payment Links', 'CRM Integration'],
    image: '/images/service-automation.png',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description:
      'Premium interface design that converts visitors to customers. No templates — ever.',
    features: ['Brand-Aligned', 'User Research', 'Prototyping', 'Design System'],
    image: '/images/service-uiux.png',
  },
  {
    icon: Search,
    title: 'SEO & Digital Growth',
    description:
      'Get found on Google. Technical SEO, content strategy, and local search optimization.',
    features: ['Technical SEO', 'Content Strategy', 'Local SEO', 'Analytics Setup'],
    image: '/images/service-seo.png',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-32 relative bg-mesh">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-blue text-sm font-semibold tracking-widest uppercase bg-blue/10 px-4 py-1.5 rounded-full mb-4">
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl font-bold">
            What We <span className="text-gradient-blue">Build</span>
          </h2>
          <p className="text-muted mt-4 max-w-xl mx-auto">
            Everything your business needs to dominate online. Built fast, built right.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group glass-card rounded-2xl overflow-hidden hover:border-blue/20 transition-all duration-500 hover:glow-blue"
            >
              {service.image && (
                <div className="h-44 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                  />
                </div>
              )}
              <div className="p-7">
                <div className="w-11 h-11 rounded-xl bg-blue/10 flex items-center justify-center mb-5 group-hover:bg-blue/20 transition-colors duration-300">
                  <service.icon className="w-5 h-5 text-blue-light" />
                </div>
                <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                <p className="text-muted text-sm leading-relaxed mb-5">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((f) => (
                    <span
                      key={f}
                      className="text-xs bg-blue/[0.06] text-blue-light border border-blue/10 px-3 py-1 rounded-full"
                    >
                      {f}
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
