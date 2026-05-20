import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="page-gutter mt-32 md:mt-44 pb-10 border-t border-[var(--rule)]">
      <div className="page-max-wide pt-14 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-baseline gap-3">
            <span className="size-1.5 rounded-full bg-[var(--accent)] translate-y-[-2px]" />
            <span className="display text-[1.625rem] leading-none">Flowi</span>
            <span className="meta">/ AI Intelligence</span>
          </div>
          <p className="mt-5 max-w-md text-[15px] text-[var(--ink-soft)] leading-relaxed">
            A small editorial publisher covering the AI ecosystem. We watch the releases, skills, and arguments online, and turn them into a daily brief, a monthly dispatch, and books you can read in an evening.
          </p>
        </div>

        <div className="md:col-span-2">
          <p className="eyebrow eyebrow-mark mb-3">Read</p>
          <ul className="space-y-2 text-[15px]">
            <li><Link href="/blog"     className="link-ink">Daily brief</Link></li>
            <li><Link href="/posts"    className="link-ink">Posts (visual)</Link></li>
            <li><Link href="/dispatch" className="link-ink">The Dispatch</Link></li>
            <li><Link href="/courses"  className="link-ink">Books</Link></li>
            <li><Link href="/about"    className="link-ink">About</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="eyebrow eyebrow-mark mb-3">Elsewhere</p>
          <ul className="space-y-2 text-[15px]">
            <li><a href="https://flowi.gumroad.com"          target="_blank" rel="noopener" className="link-ink">Gumroad</a></li>
            <li><a href="https://twitter.com/FlowiGroup"     target="_blank" rel="noopener" className="link-ink">Twitter / X</a></li>
            <li><a href="https://www.instagram.com/flowigroup" target="_blank" rel="noopener" className="link-ink">Instagram</a></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow eyebrow-mark mb-3">Issue</p>
          <p className="serif text-[1.125rem] leading-tight">№09</p>
          <p className="meta mt-1">May 2026</p>
          <p className="meta mt-3">Compiled at 06:00 UTC</p>
        </div>
      </div>

      <div className="page-max-wide mt-14 pt-5 border-t border-[var(--rule)] flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
        <p className="meta">© {year} Flowi. Independent. Built in public.</p>
        <div className="flex items-center gap-3">
          <p className="meta">Set in Fraunces &amp; Inter. Printed on the open web.</p>
          <span className="meta" aria-hidden="true">·</span>
          <Link href="/admin/login" className="meta link-ink">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
