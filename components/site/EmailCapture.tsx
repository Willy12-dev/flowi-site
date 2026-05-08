'use client';

import { useState } from 'react';

interface Props {
  source: string;
  headline?: string;
  subline?: string;
  cta?: string;
  redirectTo?: string;
  className?: string;
}

type State = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'ok' } | { kind: 'error'; message: string };

export default function EmailCapture({
  source,
  headline = '',
  subline = '',
  cta = 'Subscribe — free',
  redirectTo,
  className = '',
}: Props) {
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [email, setEmail] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setState({ kind: 'error', message: 'Enter a valid email.' });
      return;
    }
    setState({ kind: 'submitting' });
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), source }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      setState({ kind: 'ok' });
      if (redirectTo) {
        setTimeout(() => { window.location.href = redirectTo; }, 1100);
      }
    } catch (err) {
      setState({ kind: 'error', message: err instanceof Error ? err.message : 'Something went wrong.' });
    }
  }

  const disabled = state.kind === 'submitting' || state.kind === 'ok';

  return (
    <div className={`w-full max-w-lg ${className}`}>
      {headline && <h3 className="serif text-[1.5rem] mb-2">{headline}</h3>}
      {subline && <p className="text-[15px] text-[var(--ink-soft)] mb-5">{subline}</p>}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6"
      >
        <label className="flex-1 block">
          <span className="meta block mb-2">Email address</span>
          <input
            type="email"
            required
            inputMode="email"
            autoComplete="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={disabled}
            className="w-full bg-transparent border-0 border-b border-[var(--rule-strong)] py-2 text-[1.0625rem] text-[var(--ink)] placeholder:text-[var(--ink-mute)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-60"
          />
        </label>

        <button
          type="submit"
          disabled={disabled}
          className="link-red text-[1.0625rem] font-medium pb-2 whitespace-nowrap text-left disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {state.kind === 'submitting' ? 'Sending…' : state.kind === 'ok' ? '✓ On the list' : `${cta} →`}
        </button>
      </form>

      {state.kind === 'ok' && (
        <p className="mt-3 text-[14px] text-[var(--ink-soft)] italic">
          {redirectTo ? "On the list. Sending you to the download…" : "On the list. The first edition lands at 06:00 UTC tomorrow."}
        </p>
      )}
      {state.kind === 'error' && (
        <p className="mt-3 text-[14px] text-[var(--accent)]">{state.message}</p>
      )}
    </div>
  );
}
