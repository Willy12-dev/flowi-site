import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { getAllPosts } from "@/lib/blog";

const BASE = "https://useflowi.app";

const SPECS_DIR = path.join(process.cwd(), "content", "carousel-specs");
const SPEC_PREFIXES = ["news", "evergreen", "imagepost", "starter"];

function getAllDeckSlugs(): { slug: string; date: Date | null }[] {
  if (!fs.existsSync(SPECS_DIR)) return [];
  return fs
    .readdirSync(SPECS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      let slug = f.replace(/\.json$/, "");
      for (const p of SPEC_PREFIXES) {
        if (slug.startsWith(`${p}-`)) {
          slug = slug.slice(p.length + 1);
          break;
        }
      }
      const dateMatch = slug.match(/^(\d{4})-(\d{2})-(\d{2})/);
      const date = dateMatch
        ? new Date(`${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`)
        : null;
      return { slug, date };
    });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                changeFrequency: "daily",   priority: 1.0, lastModified: now },
    { url: `${BASE}/dispatch`,  changeFrequency: "weekly",  priority: 0.95, lastModified: now },
    { url: `${BASE}/courses`,   changeFrequency: "weekly",  priority: 0.9, lastModified: now },
    { url: `${BASE}/blog`,      changeFrequency: "daily",   priority: 0.9, lastModified: now },
    { url: `${BASE}/posts`,     changeFrequency: "daily",   priority: 0.85, lastModified: now },
    { url: `${BASE}/sources`,   changeFrequency: "monthly", priority: 0.6, lastModified: now },
    { url: `${BASE}/about`,     changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: `${BASE}/trader`,    changeFrequency: "weekly",  priority: 0.95, lastModified: now },
    { url: `${BASE}/launch`,    changeFrequency: "daily",   priority: 1.0,  lastModified: now },
  ];

  const posts = getAllPosts();
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    // Higher priority for funnel-vertical articles
    priority: post.category === "ai_trading" || post.category === "ai_behavior" ? 0.85 : 0.7,
  }));

  // Visual decks — one per carousel spec, mirroring blog slugs for news specs
  const deckPages: MetadataRoute.Sitemap = getAllDeckSlugs().map(
    ({ slug, date }) => ({
      url: `${BASE}/posts/${slug}`,
      lastModified: date ?? now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  return [...staticPages, ...blogPages, ...deckPages];
}
