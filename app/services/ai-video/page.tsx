'use client';

import type { Metadata } from 'next';
import { motion } from 'framer-motion';
import { Video, Megaphone, ShoppingBag, GraduationCap, Users, Sparkles, ArrowRight, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const videoTypes = [
  {
    icon: Megaphone,
    title: 'Marketing & Social Ads',
    description: 'Scroll-stopping video ads for Instagram, TikTok, Facebook, and YouTube. AI-generated spokesperson delivers your message with confidence.',
  },
  {
    icon: ShoppingBag,
    title: 'Product Demos',
    description: 'Showcase your product with a professional AI presenter. Perfect for e-commerce, SaaS, and physical products.',
  },
  {
    icon: GraduationCap,
    title: 'Explainer Videos',
    description: 'Break down complex services into simple, engaging videos. Great for onboarding, tutorials, and investor pitches.',
  },
  {
    icon: Users,
    title: 'Testimonial-Style Videos',
    description: 'AI-generated customer testimonials that look and feel authentic. Build social proof without the logistics.',
  },
  {
    icon: Sparkles,
    title: 'Brand Story Videos',
    description: 'Tell your brand story with cinematic AI visuals. Company culture, mission statements, and behind-the-scenes content.',
  },
  {
    icon: Video,
    title: 'Real Estate Tours',
    description: 'AI-narrated property walkthroughs and listing videos. Turn photos into professional virtual tours.',
  },
];

const pricing = [
  {
    name: 'Single Video',
    price: 'KES 15,000',
    usd: '~$120',
    features: ['1 AI video (up to 60 seconds)', 'Professional AI spokesperson', 'Custom script', 'Background music', '1 revision', 'Delivered in 24-48 hours'],
  },
  {
    name: 'Starter Pack',
    price: 'KES 50,000',
    usd: '~$400',
    features: ['5 AI videos', 'Multiple AI presenters', 'Custom scripts per video', 'Branded intros/outros', 'Background music', '2 revisions each', 'Delivered in 3-5 days'],
    popular: true,
  },
  {
    name: 'Business Pack',
    price: 'KES 120,000',
    usd: '~$960',
    features: ['15 AI videos', 'Full content strategy', 'Multiple formats (Reels, Stories, Ads)', 'Multiple AI presenters', 'Branded templates', 'Unlimited revisions', 'Delivered in 7-10 days', 'Social media calendar'],
  },
];

const process = [
  { step: '01', title: 'Brief', description: 'Tell us what you need — product, audience, platform, tone.' },
  { step: '02', title: 'Script', description: 'We write a compelling script tailored to your brand and goals.' },
  { step: '03', title: 'Production', description: 'AI generates your video with professional spokesperson and visuals.' },
  { step: '04', title: 'Delivery', description: 'Review, revise if needed, and receive final files ready to post.' },
];

export default function AIVideoPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 bg-mesh overflow-hidden">
          <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-accent/[0.08] rounded-full blur-[120px]" />
          <div className="max-w-5xl mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <span className="inline-block text-blue text-sm font-semibold tracking-widest uppercase bg-blue/10 px-4 py-1.5 rounded-full mb-4">
                AI Video Production
              </span>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Professional Videos.<br />
                <span className="text-gradient-blue">No Camera Needed.</span>
              </h1>
              <p className="text-muted text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
                AI-generated marketing videos with realistic spokespersons, product demos, and social
                content. Professional quality, delivered in days, at a fraction of traditional production costs.
              </p>
              <div className="mt-8">
                <a
                  href="https://wa.me/254714257688?text=Hi%20Flowi%2C%20I%27m%20interested%20in%20AI%20video%20production"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 bg-blue hover:bg-blue-light text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(74,123,255,0.3)]"
                >
                  Get Your AI Videos
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why AI Video */}
        <section className="py-16 border-y border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { value: '10x', label: 'Cheaper than traditional video' },
                { value: '24-48h', label: 'Average delivery time' },
                { value: '0', label: 'Cameras, studios, or crew needed' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="text-3xl font-bold text-gradient-blue">{stat.value}</div>
                  <div className="text-muted text-sm mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Types */}
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
                Videos We <span className="text-gradient-blue">Create</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoTypes.map((type, i) => (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card rounded-2xl p-7 hover:border-blue/20 transition-all duration-500"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue/10 flex items-center justify-center mb-5">
                    <type.icon className="w-5 h-5 text-blue-light" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{type.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{type.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-24 bg-mesh">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                How It <span className="text-gradient-blue">Works</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-4 gap-6">
              {process.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="relative glass-card rounded-2xl p-6"
                >
                  <span className="text-5xl font-black text-blue/[0.08] absolute top-3 right-3">{step.step}</span>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{step.description}</p>
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
                Video <span className="text-gradient-blue">Pricing</span>
              </h2>
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
                      Best Value
                    </div>
                  )}
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <div className="my-6">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted text-sm ml-2">{plan.usd}</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <Check className="w-4 h-4 text-blue-light shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://wa.me/254714257688?text=Hi%20Flowi%2C%20I%27m%20interested%20in%20AI%20video%20production"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block text-center py-3.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                      plan.popular
                        ? 'bg-blue hover:bg-blue-light text-white'
                        : 'bg-blue/10 border border-blue/20 text-blue-light hover:bg-blue/20'
                    }`}
                  >
                    Order Now
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
