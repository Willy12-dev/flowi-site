'use client';

import { ArrowRight } from 'lucide-react';

type Variant = 'over-hero' | 'page';

export default function Nav({ variant = 'page' }: { variant?: Variant }) {
  const overHero = variant === 'over-hero';
  const textColor = overHero ? 'var(--paper)' : 'var(--ink)';
  const subColor = overHero ? 'rgba(245, 240, 230, 0.5)' : 'var(--ash-light)';
  const pillBg = overHero ? 'var(--paper)' : 'var(--ink)';
  const pillText = overHero ? 'var(--ink)' : 'var(--paper)';

  return (
    <nav
      className={`${overHero ? 'absolute' : 'relative'} top-0 left-0 right-0 z-40 px-8 md:px-12 lg:px-16 pt-8 flex items-center justify-between`}
      style={{ color: textColor }}
    >
      <a href="/" className="flex items-baseline gap-2">
        <span
          className="display text-[28px] tracking-[-0.02em]"
          style={{ fontVariationSettings: '"SOFT" 60, "WONK" 1, "opsz" 144' }}
        >
          Flowi
        </span>
        <span className="meta hidden sm:inline" style={{ color: subColor }}>
          / studio
        </span>
      </a>

      <div className="hidden md:flex items-center gap-10">
        <a href="/portfolio" className="text-[14px] hover:opacity-60 transition-opacity">
          Work
        </a>
        <a href="/about" className="text-[14px] hover:opacity-60 transition-opacity">
          Studio
        </a>
        <a href="/#pricing" className="text-[14px] hover:opacity-60 transition-opacity">
          Rates
        </a>
        <a href="/#contact" className="text-[14px] hover:opacity-60 transition-opacity">
          Contact
        </a>
      </div>

      <a
        href="/#contact"
        className="text-[13px] inline-flex items-center gap-2 rounded-full font-medium transition-all duration-400"
        style={{
          background: pillBg,
          color: pillText,
          padding: '12px 20px',
        }}
      >
        Start a project
        <ArrowRight className="w-3.5 h-3.5" />
      </a>
    </nav>
  );
}
