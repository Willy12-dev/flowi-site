import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#06091e] text-white">
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-baseline gap-2.5 group">
            <span className="size-2 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500" />
            <span className="font-[var(--font-playfair)] text-2xl font-extrabold tracking-tight">Flowi</span>
            <span className="text-xs uppercase tracking-[0.2em] text-white/45">AI Intelligence</span>
          </Link>
          <p className="mt-4 max-w-md text-sm text-white/55 leading-relaxed">
            The signal layer for AI builders. Daily intelligence on what&apos;s shipping, monthly atlas of every tool worth knowing, and opinionated deep-dive courses for the patterns that actually work in production.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/40 mb-3">Read</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/blog" className="text-white/75 hover:text-white">Daily AI brief</Link></li>
            <li><Link href="/atlas" className="text-white/75 hover:text-white">The Atlas (free)</Link></li>
            <li><Link href="/courses" className="text-white/75 hover:text-white">Courses</Link></li>
            <li><Link href="/about" className="text-white/75 hover:text-white">About</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/40 mb-3">Elsewhere</p>
          <ul className="space-y-2 text-sm">
            <li><a href="https://flowi.gumroad.com" target="_blank" rel="noopener" className="text-white/75 hover:text-white">Gumroad</a></li>
            <li><a href="https://twitter.com/FlowiGroup" target="_blank" rel="noopener" className="text-white/75 hover:text-white">Twitter / X</a></li>
            <li><a href="https://www.instagram.com/flowigroup" target="_blank" rel="noopener" className="text-white/75 hover:text-white">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 px-6 py-6 text-xs text-white/40 text-center">
        © {new Date().getFullYear()} Flowi · AI Intelligence · Built in public.
      </div>
    </footer>
  );
}
