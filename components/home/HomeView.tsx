import Link from 'next/link';
import Image from 'next/image';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';
import EmailCapture from '@/components/site/EmailCapture';
import { getAllPosts } from '@/lib/blog';

export default function HomeView() {
  const posts = getAllPosts();
  const featured = posts[0];
  const latest = posts.slice(1, 9);

  return (
    <main className="bg-[var(--bg)] text-[var(--ink)]">
      <Nav />
      <Hero totalCount={posts.length} />
      {featured && <Featured post={featured} />}
      {latest.length > 0 && <LatestArticles posts={latest} />}
      <DispatchSpread />
      <EditorialAside />
      <BookShelf />
      <Mission />
      <Subscribe />
      <Footer />
    </main>
  );
}

/* ─── HERO ─────────────────────────────────────────────────── */
function Hero({ totalCount }: { totalCount: number }) {
  return (
    <section className="page-gutter pt-16 md:pt-24 pb-14 md:pb-20">
      <div className="page-max">
        <p className="eyebrow eyebrow-mark mb-8 md:mb-10">
          Flowi · AI Intelligence · Issue №09 · May&nbsp;9, 2026
        </p>

        <h1 className="display hero-headline text-[3rem] sm:text-[4.25rem] md:text-[6rem] leading-[0.98] -tracking-[0.025em]">
          The daily paper <br />
          for <span className="marker">AI&nbsp;builders</span>.
        </h1>

        <p className="lead mt-8 measure">
          A small editorial publisher covering the AI ecosystem. We watch the releases, the new skills, the open-source bravado online — and turn it into a daily brief, a monthly dispatch, and books you can read in an evening.
        </p>

        <div className="mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-3">
          <Link href="/dispatch" className="link-red text-[1.0625rem] font-medium">
            Subscribe&nbsp;—&nbsp;free →
          </Link>
          <Link href="/courses" className="link-ink text-[1.0625rem]">Read the books</Link>
          <span className="meta">{totalCount} articles in the archive</span>
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURED ARTICLE ─────────────────────────────────────── */
function Featured({ post }: { post: ReturnType<typeof getAllPosts>[0] }) {
  const readTime = Math.max(1, Math.ceil(post.wordCount / 200));
  const dateLong = new Date(post.date).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  return (
    <section className="page-gutter pt-12 md:pt-16 pb-20 md:pb-24 border-t border-[var(--rule)]">
      <div className="page-max-wide">
        <p className="eyebrow eyebrow-mark mb-3">Today&apos;s lead story</p>
        <span className="draw-rule mb-10 block" aria-hidden="true" />

        <article>
          <p className="meta mb-4">
            {(post.category || "Article").replace(/_/g, " ").toUpperCase()} · <span className="tabular">{dateLong}</span> · <span className="tabular">{readTime} min read</span>
          </p>
          <h2 className="display text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] leading-[1.02] -tracking-[0.02em] max-w-[18ch] mb-6">
            <Link href={`/blog/${post.slug}`} className="text-[var(--ink)] hover:text-[var(--accent)] transition-colors">
              {post.title}
            </Link>
          </h2>
          {post.description && (
            <p className="lead measure mb-6">{post.description}</p>
          )}
          <Link href={`/blog/${post.slug}`} className="link-red text-[1.0625rem] font-medium">
            Read the full piece →
          </Link>
        </article>
      </div>
    </section>
  );
}

/* ─── LATEST ARTICLES (Index style) ────────────────────────── */
function LatestArticles({ posts }: { posts: ReturnType<typeof getAllPosts> }) {
  return (
    <section className="page-gutter pt-12 md:pt-16 pb-20 md:pb-24 border-t border-[var(--rule)]">
      <div className="page-max-wide">
        <div className="flex items-end justify-between mb-3">
          <p className="eyebrow eyebrow-mark">Latest from Daily AI</p>
          <Link href="/blog" className="link-ink text-[14px] hidden sm:inline">Full archive →</Link>
        </div>
        <span className="draw-rule mb-10 block" aria-hidden="true" />

        <ol className="list-none p-0 m-0">
          {posts.map((p, i) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="index-row no-underline">
                <span className="num">{String(i + 2).padStart(2, "0")}</span>
                <span className="source">{(p.category || "Article").replace(/_/g, " ")}</span>
                <span className="title">{p.title}</span>
                <span className="when tabular">
                  {new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <p className="meta italic mt-8">A new piece lands every morning at 06:00 UTC.</p>
      </div>
    </section>
  );
}

/* ─── DISPATCH SPREAD (lead magnet) ─────────────────────────── */
function DispatchSpread() {
  return (
    <section className="page-gutter pt-20 md:pt-28 pb-20 md:pb-28 border-t border-[var(--rule)]">
      <div className="page-max-wide grid md:grid-cols-12 gap-10 md:gap-14 items-start">
        <div className="md:col-span-5">
          <div className="relative aspect-[4/5] w-full bg-[var(--bg-elevated)]">
            <Image
              src="/images/atlas_book.png"
              alt="A leather-bound notebook resting on warm paper, with a red bookmark ribbon."
              fill
              className="object-cover"
              sizes="(min-width: 768px) 40vw, 92vw"
            />
          </div>
        </div>

        <div className="md:col-span-7 md:pt-4">
          <p className="eyebrow eyebrow-mark mb-4">The Dispatch · Free · Monthly</p>
          <h2 className="serif text-[2.25rem] md:text-[2.625rem] leading-[1.1] mb-6">
            The reading the brief doesn&apos;t have room for.
          </h2>
          <p className="lead mb-4 measure-tight">
            Ten editorial pieces. One issue. Free.
          </p>
          <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed measure-tight mb-8">
            The Daily Brief is breaking news. The Dispatch is the long form — what those releases actually mean, which skills are worth picking up, and the editorial calls about where the field is heading. Drop your email and the May issue arrives in 90&nbsp;seconds.
          </p>

          <EmailCapture
            source="home-dispatch"
            cta="Send me The Dispatch"
            redirectTo="/dispatch"
            className="!max-w-md"
          />
        </div>
      </div>
    </section>
  );
}

/* ─── EDITORIAL ASIDE ──────────────────────────────────────── */
function EditorialAside() {
  return (
    <section className="page-gutter pt-24 md:pt-32 pb-24 md:pb-32 border-t border-[var(--rule)]">
      <div className="page-max">
        <span className="rule-red block w-60 mx-auto" />
        <blockquote className="aside mt-10">
          &ldquo;If you could ask Claude this and get the same answer, the book gets rewritten until you can&apos;t.&rdquo;
        </blockquote>
        <p className="eyebrow eyebrow-mark text-center mt-10">Flowi Editorial Standard</p>
        <span className="rule-red block w-60 mx-auto mt-10" />
      </div>
    </section>
  );
}

/* ─── BOOK SHELF (compact, demoted to sidecar) ─────────────── */
function BookShelf() {
  return (
    <section className="page-gutter pt-20 md:pt-28 pb-20 md:pb-28 border-t border-[var(--rule)]">
      <div className="page-max-wide">
        <div className="flex items-end justify-between mb-3">
          <p className="eyebrow eyebrow-mark">Books — In Print</p>
          <Link href="/courses" className="link-ink text-[14px] hidden sm:inline">All books →</Link>
        </div>
        <span className="draw-rule mb-12 block" aria-hidden="true" />

        <article className="grid grid-cols-[3rem,1fr,auto] gap-x-6 gap-y-3 items-baseline pb-10 border-b border-[var(--rule)]">
          <span className="serif text-[1.5rem] tabular text-[var(--ink-mute)]">№01</span>
          <div>
            <h3 className="serif text-[1.875rem] md:text-[2.5rem] leading-[1.05] -tracking-[0.015em] mb-2">
              <a href="https://flowi.gumroad.com/l/sqqhvm" target="_blank" rel="noopener" className="link-ink">
                Agent Memory: The 5 Patterns That Ship in Production
              </a>
            </h3>
            <p className="lead measure mb-3">
              The decision tree, the code, and the failure modes nobody warns you about.
            </p>
            <p className="meta">5 chapters · 4,500 words · Python · Claude / GPT / Gemini compatible</p>
          </div>
          <div className="text-right">
            <span className="serif text-[1.5rem] tabular block">$19</span>
            <a href="https://flowi.gumroad.com/l/sqqhvm" target="_blank" rel="noopener" className="link-red text-[14px] mt-1 inline-block">
              Read it →
            </a>
          </div>
        </article>

        <p className="meta italic mt-8">More titles in production. The next book ships Monday morning, 06:00 UTC.</p>
      </div>
    </section>
  );
}

/* ─── MISSION ──────────────────────────────────────────────── */
function Mission() {
  return (
    <section className="page-gutter pt-24 md:pt-36 pb-24 md:pb-36 border-t border-[var(--rule)]">
      <div className="page-max">
        <p className="eyebrow eyebrow-mark mb-8">Why this exists</p>
        <h2 className="display text-[2.25rem] md:text-[3.25rem] leading-[1.05] -tracking-[0.02em] measure">
          Builders ship. We write about what&apos;s shipping. The AI ecosystem moves too fast for any one person to keep up with — so we made keeping up with it the job.
        </h2>
        <p className="lead mt-10 measure">
          Daily brief, monthly dispatch, weekly book. One editorial line, three depths. Pick how deep you want to read.
        </p>
        <p className="mt-6">
          <Link href="/about" className="link-red text-[1.0625rem]">Read the full standard →</Link>
        </p>
      </div>
    </section>
  );
}

/* ─── SUBSCRIBE ────────────────────────────────────────────── */
function Subscribe() {
  return (
    <section className="page-gutter pt-20 md:pt-28 pb-12 border-t border-[var(--rule)]">
      <div className="page-max max-w-2xl text-center">
        <p className="eyebrow eyebrow-mark mb-5">Stay on the list</p>
        <h2 className="display text-[2rem] md:text-[2.75rem] leading-[1.05] -tracking-[0.02em] mb-4">
          One email a month. <span className="display-italic">Zero noise.</span>
        </h2>
        <p className="text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed mb-9 measure mx-auto">
          The new Dispatch issue plus the single most consequential AI release we covered that month. Unsubscribe anytime — no &ldquo;wait don&apos;t leave&rdquo; sequence.
        </p>
        <div className="mx-auto max-w-md">
          <EmailCapture source="home-subscribe" cta="Subscribe — free" />
        </div>
      </div>
    </section>
  );
}
