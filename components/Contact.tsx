'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Mail, MapPin, ArrowRight } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <img src="/images/contact-bg.png" alt="Contact Flowi agency for web design and AI services" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27] via-transparent to-[#0a0e27]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-blue text-sm font-semibold tracking-widest uppercase bg-blue/10 px-4 py-1.5 rounded-full mb-4">
            Contact
          </span>
          <h2 className="text-4xl md:text-5xl font-bold">
            Let&apos;s Build <span className="text-gradient-blue">Together</span>
          </h2>
          <p className="text-muted mt-4 max-w-xl mx-auto">
            Ready to transform your business? Reach out and let&apos;s talk about your project.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <a
              href="https://wa.me/254714257688"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 glass-card rounded-2xl p-5 hover:border-green-500/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <MessageCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">WhatsApp</div>
                <div className="text-muted text-xs">+254 714 257688</div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
            </a>

            <a
              href="mailto:flowigroup@gmail.com"
              className="group flex items-center gap-4 glass-card rounded-2xl p-5 hover:border-blue/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue/10 flex items-center justify-center group-hover:bg-blue/20 transition-colors">
                <Mail className="w-5 h-5 text-blue-light" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">Email</div>
                <div className="text-muted text-xs">flowigroup@gmail.com</div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-blue group-hover:translate-x-1 transition-all" />
            </a>

            <div className="flex items-center gap-4 glass-card rounded-2xl p-5">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-accent-light" />
              </div>
              <div>
                <div className="font-semibold text-sm">Based in Nairobi</div>
                <div className="text-muted text-xs">Serving clients worldwide</div>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card rounded-2xl p-7 space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label className="text-sm text-muted mb-1.5 block">Your Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-blue/30 transition-colors"
              />
            </div>
            <div>
              <label className="text-sm text-muted mb-1.5 block">Email or Phone</label>
              <input
                type="text"
                placeholder="you@email.com or +254..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-blue/30 transition-colors"
              />
            </div>
            <div>
              <label className="text-sm text-muted mb-1.5 block">What do you need?</label>
              <select className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-blue/30 transition-colors">
                <option>Website Development</option>
                <option>Mobile App</option>
                <option>AI Chatbot</option>
                <option>AI Video Production</option>
                <option>E-Commerce Store</option>
                <option>WhatsApp Automation</option>
                <option>M-Pesa Integration</option>
                <option>Full Digital Package</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted mb-1.5 block">Tell us more</label>
              <textarea
                rows={3}
                placeholder="Briefly describe your project..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-blue/30 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue hover:bg-blue-light text-white py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(74,123,255,0.2)]"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
