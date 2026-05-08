'use client';

import Link from 'next/link';
import { useState } from 'react';

const LINKS = [
  { href: '/dispatch', label: 'Dispatch', tag: 'free' },
  { href: '/courses', label: 'Books' },
  { href: '/blog',    label: 'Daily'  },
  { href: '/about',   label: 'About'  },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="page-gutter relative z-40 pt-7 md:pt-9 pb-4 flex items-baseline justify-between">
      <Link href="/" className="flex items-baseline gap-3 group">
        <span className="size-1.5 rounded-full bg-[var(--accent)] translate-y-[-2px]" />
        <span className="display text-[1.625rem] leading-none">Flowi</span>
        <span className="hidden sm:inline meta">/ AI Intelligence</span>
      </Link>

      <div className="hidden md:flex items-baseline gap-9">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="relative text-[15px] text-[var(--ink)] hover:text-[var(--accent)] transition-colors"
          >
            {l.label}
            {l.tag && (
              <span className="ml-1.5 align-baseline text-[10px] tracking-[0.12em] uppercase text-[var(--ink-mute)]">
                {l.tag}
              </span>
            )}
          </Link>
        ))}
        <Link href="/dispatch" className="link-red text-[15px] font-medium">
          Subscribe&nbsp;—&nbsp;free
        </Link>
      </div>

      <button
        type="button"
        aria-label="Toggle menu"
        onClick={() => setOpen(!open)}
        className="md:hidden text-[var(--ink)] p-2 -m-2"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          {open ? (
            <path d="M6 6L18 18M6 18L18 6" />
          ) : (
            <>
              <path d="M4 7h16" />
              <path d="M4 13h16" />
              <path d="M4 19h16" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-4 right-4 mt-2 border-t border-b border-[var(--rule-strong)] bg-[var(--bg)] py-4 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-[var(--ink)] border-b border-[var(--rule)] last:border-0"
            >
              {l.label}
              {l.tag && <span className="meta ml-2">{l.tag}</span>}
            </Link>
          ))}
          <Link
            href="/dispatch"
            onClick={() => setOpen(false)}
            className="link-red block mt-4 text-[15px] font-medium"
          >
            Subscribe&nbsp;—&nbsp;free →
          </Link>
        </div>
      )}
    </nav>
  );
}
