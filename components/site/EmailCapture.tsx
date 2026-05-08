'use client';

import { useState } from 'react';

interface Props {
  /** Tag stored alongside the email so we know which page captured it */
  source: string;
  /** Headline shown above the form */
  headline?: string;
  /** Sub-copy below the headline */
  subline?: string;
  /** Button label */
  cta?: string;
  /** Where to send the user after they subscribe (e.g. Gumroad free product) */
  redirectTo?: string;
  /** Override Tailwind classes on the wrapping <div> */
  className?: string;
}

type State = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'ok'; email: string } | { kind: 'error'; message: string };

export default function EmailCapture({
  source,
  headline = 'Get the Atlas free, every month',
  subline = 'One email per month. The new edition + the highest-leverage AI tool we found that month. Unsubscribe anytime.',
  cta = 'Get the Atlas',
  redirectTo,
  className = '',
}: Props) {
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [email, setEmail] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setState({ kind: 'error', message: 'Enter a valid email' });
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
      setState({ kind: 'ok', email });
      if (redirectTo) {
        // Slight delay so the user sees the success state before redirect
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 1200);
      }
    } catch (err) {
      setState({ kind: 'error', message: err instanceof Error ? err.message : 'Something went wrong' });
    }
  }

  return (
    <div className={`w-full max-w-lg ${className}`}>
      {headline && <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">{headline}</h3>}
      {subline && <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 mb-5">{subline}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          inputMode="email"
          autoComplete="email"
          placeholder="you@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state.kind === 'submitting' || state.kind === 'ok'}
          className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 transition disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={state.kind === 'submitting' || state.kind === 'ok'}
          className="px-6 py-3 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 text-white font-semibold tracking-tight shadow-lg shadow-violet-600/20 hover:shadow-violet-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {state.kind === 'submitting' ? 'Sending…' : state.kind === 'ok' ? '✓ Subscribed' : cta}
        </button>
      </form>

      {state.kind === 'ok' && (
        <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">
          You&apos;re on the list. {redirectTo ? 'Sending you to the download…' : 'Check your inbox for the first edition.'}
        </p>
      )}
      {state.kind === 'error' && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{state.message}</p>
      )}
    </div>
  );
}
