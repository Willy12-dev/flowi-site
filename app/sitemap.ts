import type { MetadataRoute } from "next";
import { getAllPosts, getPostsByCategory } from "@/lib/blog";

const BASE = "https://useflowi.app";

// Sitemap split — gives Google clearer signals about content clusters.
// Renders as:
//   /sitemap.xml                   (index pointing to each below)
//   /sitemap/main.xml              static pages + general articles
//   /sitemap/ai_trading.xml        FlowiAI Trader funnel articles
//   /sitemap/ai_behavior.xml       Woyuduin funnel articles

export async function generateSitemaps() {
  return [
    { id: "main" },
    { id: "ai_trading" },
    { id: "ai_behavior" },
  ];
}

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: BASE,                changeFrequency: "daily",   priority: 1.0 },
  { url: `${BASE}/dispatch`,  changeFrequency: "monthly", priority: 0.9 },
  { url: `${BASE}/courses`,   changeFrequency: "weekly",  priority: 0.9 },
  { url: `${BASE}/blog`,      changeFrequency: "daily",   priority: 0.9 },
  { url: `${BASE}/sources`,   changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE}/about`,     changeFrequency: "monthly", priority: 0.7 },
];

export default function sitemap({
  id,
}: {
  id: "main" | "ai_trading" | "ai_behavior";
}): MetadataRoute.Sitemap {
  const now = new Date();

  if (id === "ai_trading" || id === "ai_behavior") {
    const posts = getPostsByCategory(id);
    return posts.map((post) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.85, // higher priority — these are the conversion-target articles
    }));
  }

  // main: static pages + every other (non-vertical) article
  const posts = getAllPosts().filter(
    (p) => p.category !== "ai_trading" && p.category !== "ai_behavior"
  );
  return [
    ...STATIC_PAGES.map((p) => ({ ...p, lastModified: now })),
    ...posts.map((post) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
