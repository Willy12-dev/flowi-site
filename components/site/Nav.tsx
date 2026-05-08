'use client';

import Link from 'next/link';
import { useState } from 'react';

type Variant = 'over-hero' | 'page';

const LINKS = [
  { href: '/atlas', label: 'Atlas', tag: 'free' },
  { href: '/courses', label: 'Courses' },
  { href: '/blog', label: 'Daily AI' },
  { href: '/about', label: 'About' },
];

export default function Nav({ variant: _variant = 'page' }: { variant?: Variant } = {}) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="absolute top-0 left-0 right-0 z-40 px-6 md:px-10 pt-6 flex items-center justify-between text-white">
      <Link href="/" className="flex items-baseline gap-2.5 group">
        <span className="size-2 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 group-hover:scale-125 transition" />
        <span className="font-[var(--font-playfair)] text-2xl font-extrabold tracking-tight">
          Flowi
        </span>
        <span className="hidden sm:inline text-xs uppercase tracking-[0.2em] text-white/45">
          AI Intelligence
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-sm text-white/75 hover:text-white transition flex items-center gap-1.5"
          >
            {l.label}
            {l.tag && (
              <span className="text-[10px] uppercase tracking-wider text-cyan-300/80 border border-cyan-400/30 rounded-full px-1.5 py-0.5">
                {l.tag}
              </span>
            )}
          </Link>
        ))}
        <Link
          href="/atlas"
          className="text-sm font-semibold rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 px-4 py-2 hover:from-violet-500 hover:to-blue-500 transition"
        >
          Subscribe →
        </Link>
      </div>

      <button
        type="button"
        aria-label="Toggle menu"
        onClick={() => setOpen(!open)}
        className="md:hidden text-white/80 p-2 -m-2"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? (
            <path d="M6 6L18 18M6 18L18 6" />
          ) : (
            <>
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mx-4 mt-3 rounded-xl border border-white/10 bg-[#0a0e27]/95 backdrop-blur-xl p-4 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-white/85 border-b border-white/5 last:border-0"
            >
              {l.label}
              {l.tag && <span className="text-[10px] uppercase ml-2 text-cyan-300">{l.tag}</span>}
            </Link>
          ))}
          <Link
            href="/atlas"
            onClick={() => setOpen(false)}
            className="block mt-3 text-center font-semibold rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 py-3"
          >
            Subscribe →
          </Link>
        </div>
      )}
    </nav>
  );
}
