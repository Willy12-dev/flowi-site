import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin";
import { loadPrompts, resolvePrompt } from "@/lib/carousel/image-prompts";
import PromptCard from "./PromptCard";

export const metadata: Metadata = {
  title: "Image prompts — Flowi Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function PromptsAdmin() {
  if (!(await isAuthed())) redirect("/admin/login");

  const registry = await loadPrompts();

  // Pre-resolve each template with its defaults so the user sees the
  // paste-ready prompt without having to interpolate anything.
  const cards = registry.templates.map((t) => {
    const resolved = resolvePrompt(registry, t.id, {}, t.style_default);
    return { template: t, resolved };
  });

  // Group cards by asset_class
  const byClass: Record<string, typeof cards> = {};
  for (const c of cards) {
    (byClass[c.template.asset_class] ??= []).push(c);
  }

  const classOrder = [
    "carousel-photo",
    "blog-hero",
    "pdf-cover",
    "course-cover",
    "social-banner",
    "youtube-thumb",
    "avatar",
  ];

  return (
    <main>
      <section className="page-gutter pt-10 md:pt-12 pb-8">
        <div className="page-max-wide">
          <p className="eyebrow eyebrow-mark mb-4">
            Image prompts · everything that needs a hero
          </p>
          <h1 className="display text-[2.5rem] md:text-[4rem] leading-[1.0] -tracking-[0.02em] mb-3">
            Paste, generate, <span className="display-italic">drop in.</span>
          </h1>
          <p className="lead measure">
            Every visual asset the system can use has a prompt template here.
            Copy the prompt into ChatGPT image-gen / Gemini Imagen / Midjourney /
            Flux, save the result to the listed path. Edit{" "}
            <code className="tabular">content/prompts.json</code> to change the
            base style, add a new template, or swap accent colors.
          </p>
        </div>
      </section>

      <section className="page-gutter pb-12 border-t border-[var(--rule)]">
        <div className="page-max-wide pt-8">
          <p className="eyebrow eyebrow-mark mb-3">Styles · the visual DNA</p>
          <span className="draw-rule mb-8 block" aria-hidden="true" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(registry.styles).map(([id, s]) => (
              <div
                key={id}
                className="border border-[var(--rule)] rounded p-5 bg-[var(--bg-elevated)]"
              >
                <p className="meta uppercase tracking-[0.08em] mb-1">{id}</p>
                <p className="text-[1rem] font-semibold mb-3">{s.label}</p>
                <p className="text-[0.875rem] text-[var(--ink-soft)] mb-3 leading-relaxed">
                  {s.base}
                </p>
                <p className="text-[0.8125rem] text-[var(--accent)] italic">
                  {s.negative}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {classOrder.map((cls) => {
        const items = byClass[cls];
        if (!items || items.length === 0) return null;
        return (
          <section
            key={cls}
            className="page-gutter pb-12 border-t border-[var(--rule)]"
          >
            <div className="page-max-wide pt-8">
              <p className="eyebrow eyebrow-mark mb-3">
                {classLabel(cls)} · {items.length}
              </p>
              <span className="draw-rule mb-8 block" aria-hidden="true" />
              <div className="flex flex-col gap-6">
                {items.map((c) => (
                  <PromptCard
                    key={c.template.id}
                    template={c.template}
                    prompt={c.resolved.prompt}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}

function classLabel(cls: string): string {
  switch (cls) {
    case "carousel-photo":
      return "Carousel slide photos";
    case "blog-hero":
      return "Blog article heroes";
    case "pdf-cover":
      return "PDF / field-guide covers";
    case "course-cover":
      return "Gumroad course covers";
    case "social-banner":
      return "Social banners";
    case "youtube-thumb":
      return "YouTube / Short thumbnails";
    case "avatar":
      return "Avatars";
    default:
      return cls;
  }
}
