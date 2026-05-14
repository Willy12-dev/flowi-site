import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin";
import { loadCourses } from "@/lib/carousel/courses";

export const metadata: Metadata = {
  title: "Courses — Flowi Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function CoursesAdmin() {
  if (!(await isAuthed())) redirect("/admin/login");

  const registry = await loadCourses();

  const byStatus = {
    live: registry.courses.filter((c) => c.status === "live"),
    waitlist: registry.courses.filter((c) => c.status === "waitlist"),
    coming_soon: registry.courses.filter((c) => c.status === "coming_soon"),
  };

  const totalArr = registry.courses;
  const livePriceTotal = byStatus.live.reduce((s, c) => s + c.price_usd, 0);
  const projectedWaitlistTotal = byStatus.waitlist.reduce(
    (s, c) => s + c.price_usd,
    0
  );

  return (
    <main>
      <section className="page-gutter pt-10 md:pt-12 pb-8">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-4">
            Course inventory · the monetization layer
          </p>
          <h1 className="display text-[2.5rem] md:text-[4rem] leading-[1.0] -tracking-[0.02em] mb-3">
            What we&apos;re <span className="display-italic">selling.</span>
          </h1>
          <p className="lead measure">
            Carousels funnel into these. Edit{" "}
            <code className="tabular">content/courses.json</code> to change pricing,
            status, or add a course. Status drives the CTA language in every platform export.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="page-gutter pb-12 border-t border-[var(--rule)]">
        <div className="page-max-wide pt-8">
          <p className="eyebrow eyebrow-mark mb-3">Headline</p>
          <span className="draw-rule mb-8 block" aria-hidden="true" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6">
            <Stat label="Courses tracked" value={totalArr.length} />
            <Stat
              label="Live now"
              value={byStatus.live.length}
              sub={`$${livePriceTotal} cart value`}
              accent
            />
            <Stat
              label="On waitlist"
              value={byStatus.waitlist.length}
              sub={`$${projectedWaitlistTotal} projected`}
            />
            <Stat label="Coming soon" value={byStatus.coming_soon.length} />
          </div>
        </div>
      </section>

      {/* Live */}
      <CourseSection title="Live" courses={byStatus.live} accent />

      {/* Waitlist */}
      <CourseSection title="Waitlist · accepting signups" courses={byStatus.waitlist} />

      {/* Coming soon */}
      {byStatus.coming_soon.length > 0 && (
        <CourseSection
          title="Coming soon · no page yet"
          courses={byStatus.coming_soon}
        />
      )}

      <section className="page-gutter pb-20 border-t border-[var(--rule)]">
        <div className="page-max-wide pt-8">
          <p className="eyebrow eyebrow-mark mb-3">Secondary routes</p>
          <span className="draw-rule mb-8 block" aria-hidden="true" />
          <p className="text-[0.95rem] text-[var(--ink-soft)] mb-6 measure">
            After the primary course CTA, every long-form export (Reddit + Quora) mentions one of
            these as the &quot;bigger play.&quot; Routed by vertical.
          </p>
          <ol className="list-none p-0 m-0">
            {Object.entries(registry.secondary_routes)
              .filter(([k]) => k !== "_comment")
              .map(([vertical, route]) => {
                const r = route as { name: string; url: string; tagline: string };
                return (
                  <li key={vertical}>
                    <div className="index-row">
                      <span className="num">{vertical}</span>
                      <span className="title">{r.name}</span>
                      <span className="when tabular">{r.tagline}</span>
                    </div>
                  </li>
                );
              })}
          </ol>
        </div>
      </section>
    </main>
  );
}

function CourseSection({
  title,
  courses,
  accent,
}: {
  title: string;
  courses: Array<{
    slug: string;
    title: string;
    topics: string[];
    vertical: string;
    price_usd: number;
    url: string;
    cta_keyword: string;
  }>;
  accent?: boolean;
}) {
  if (courses.length === 0) return null;
  return (
    <section className="page-gutter pb-12 border-t border-[var(--rule)]">
      <div className="page-max-wide pt-8">
        <p
          className={`eyebrow eyebrow-mark mb-3 ${accent ? "text-[var(--accent)]" : ""}`}
        >
          {title}
        </p>
        <span className="draw-rule mb-8 block" aria-hidden="true" />
        <ol className="list-none p-0 m-0">
          {courses.map((c, i) => (
            <li key={c.slug}>
              <div className="index-row">
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <span className="title">
                  {c.title}{" "}
                  <span className="text-[var(--muted)] text-[0.85em]">
                    · {c.vertical} · {c.topics.join(", ")} · $&nbsp;{c.price_usd}
                  </span>
                </span>
                <span className="when tabular">
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="link-ink"
                  >
                    {c.cta_keyword} →
                  </a>
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="meta uppercase tracking-[0.08em] mb-2">{label}</p>
      <p
        className={`display text-[2.5rem] md:text-[3rem] tabular leading-none ${accent ? "text-[var(--accent)]" : ""}`}
      >
        {value}
      </p>
      {sub && <p className="meta italic mt-2">{sub}</p>}
    </div>
  );
}
