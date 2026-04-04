'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-mesh">
      {/* Background orbs */}
      <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-blue/[0.08] rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-accent/[0.06] rounded-full blur-[120px]" />

      {/* Full background hero image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero.png"
          alt=""
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e27] via-[#0a0e27]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-transparent to-[#0a0e27]/60" />
      </div>

      <div className="relative w-full px-8 sm:px-12 md:px-20 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side — text content */}
          <div className="flex-1 max-w-xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight"
            >
              <span className="text-foreground">Innovate.</span>
              <br />
              <span className="text-gradient-blue">Transform.</span>
              <br />
              <span className="text-foreground">Thrive.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-muted text-lg mt-6 max-w-md leading-relaxed"
            >
              We build premium websites, AI-powered chatbots, mobile apps, and marketing videos that take your brand to the next level. Delivered in days, not months.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 bg-blue hover:bg-blue-light text-white px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(74,123,255,0.3)]"
              >
                Explore our services
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-14 flex gap-10"
            >
              {[
                { value: '50+', label: 'Projects' },
                { value: '98%', label: 'Satisfaction' },
                { value: '3 Day', label: 'Delivery' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl font-bold text-gradient-blue">{stat.value}</div>
                  <div className="text-muted text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right side — laptop mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex-1 hidden lg:flex justify-center items-center"
          >
            <div className="relative w-full max-w-[700px]">
              <img
                src="/images/laptop.png"
                alt="Professional website on laptop"
                className="w-full scale-110 opacity-90 mask-edges"
              />
              {/* Glow behind laptop */}
              <div className="absolute inset-0 -z-10 bg-blue/[0.15] rounded-full blur-[100px]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
