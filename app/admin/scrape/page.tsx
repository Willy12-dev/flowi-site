import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthed, VERTICALS } from "@/lib/admin";
import ScrapeForm from "./ScrapeForm";

export const metadata: Metadata = {
  title: "Scrape — Flowi Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ScrapePage() {
  if (!(await isAuthed())) {
    redirect("/admin/login");
  }

  return (
    <main>
      <section className="page-gutter pt-10 md:pt-12 pb-8">
        <div className="page-max">
          <p className="eyebrow eyebrow-mark mb-4">Newsroom · Drop a link</p>
          <h1 className="display text-[2.5rem] md:text-[4rem] leading-[1.0] -tracking-[0.02em] mb-3">
            Bring it <span className="display-italic">in.</span>
          </h1>
          <p className="lead measure">
            Paste a Twitter, X, or Threads URL. The system fetches it (Jina Reader → Nitter → direct), tags it for a vertical, and parks it in the queue. When you have a batch, tell Claude Code to process them.
          </p>
        </div>
      </section>

      <section className="page-gutter pb-16 md:pb-24 border-t border-[var(--rule)]">
        <div className="page-max pt-10">
          <ScrapeForm verticals={[...VERTICALS]} />

          <div className="mt-14 pt-8 border-t border-[var(--rule)]">
            <p className="eyebrow eyebrow-mark mb-4">After scraping</p>
            <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed mb-4 measure">
              Open Claude Code in <span className="tabular">C:\Users\User\FlowiLeads</span> and say:
            </p>
            <pre className="text-[13px] bg-[var(--bg-elevated)] border-l-2 border-[var(--accent)] p-4 overflow-x-auto whitespace-pre-wrap">
{`process today's ai_trading scrapes -> 10 X posts + 10 IG carousels + 10 LI posts`}
            </pre>
            <p className="meta italic mt-4">Or check the <Link href="/admin" className="link-red">dashboard</Link> for the queue.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
