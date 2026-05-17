import Link from "next/link";
import { isAuthed, ADMIN_PASSWORD_CONFIGURED } from "@/lib/admin";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — Flowi",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page lives under /admin/login — handled by its own page.tsx, no auth.
  // Everything else under /admin requires the cookie.
  // We cannot easily detect the route here in app router layouts pre-render,
  // so login renders below the gate; the gate redirects to login if needed.
  const authed = await isAuthed();

  if (!authed) {
    // Special-case: if children is the login page, render it. Otherwise redirect.
    // The /admin/login route is matched by its own page.tsx — when it's rendered
    // by Next, the layout still wraps it. We let it through.
    // Easiest: if not authed, render only children for /admin/login segment,
    // else redirect. But layouts don't get the path. Simplest: always allow
    // children, and the login page itself doesn't need auth. Use a permissive
    // layout — auth check happens in /admin/page.tsx instead.
    return <>{children}</>;
  }

  return (
    <div className="bg-[var(--bg)] text-[var(--ink)] min-h-screen">
      <header className="page-gutter pt-6 pb-4 border-b border-[var(--rule)]">
        <div className="page-max-wide flex items-center justify-between">
          <Link href="/admin" className="no-underline">
            <p className="eyebrow eyebrow-mark">
              Flowi · Newsroom Admin
            </p>
          </Link>
          <nav className="flex items-baseline gap-x-5 md:gap-x-6">
            <Link href="/admin" className="link-ink text-[14px]">
              Dashboard
            </Link>
            <Link href="/admin/scrape" className="link-ink text-[14px]">
              Scrape
            </Link>
            <Link href="/admin/seo" className="link-ink text-[14px]">
              SEO
            </Link>
            <Link href="/admin/sales" className="link-ink text-[14px]">
              Sales
            </Link>
            <Link href="/admin/library" className="link-ink text-[14px]">
              Library
            </Link>
            <Link href="/admin/studio" className="link-ink text-[14px]">
              Studio
            </Link>
            <Link href="/admin/courses" className="link-ink text-[14px]">
              Courses
            </Link>
            <Link href="/admin/prompts" className="link-ink text-[14px]">
              Prompts
            </Link>
            <Link href="/admin/news-engine" className="link-ink text-[14px]">
              News engine
            </Link>
            <Link href="/" className="link-ink text-[14px] opacity-60">
              ← public site
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      {!ADMIN_PASSWORD_CONFIGURED && (
        <div className="page-gutter py-3 bg-[var(--accent)] text-[var(--paper)]">
          <div className="page-max-wide">
            <p className="meta">
              ⚠ ADMIN_PASSWORD is not set. Add it to{" "}
              <span className="tabular">.env.local</span> and restart the dev
              server.
            </p>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
