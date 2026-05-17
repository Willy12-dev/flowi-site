import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE = "https://useflowi.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                changeFrequency: "daily",   priority: 1.0, lastModified: now },
    { url: `${BASE}/dispatch`,  changeFrequency: "weekly",  priority: 0.95, lastModified: now },
    { url: `${BASE}/courses`,   changeFrequency: "weekly",  priority: 0.9, lastModified: now },
    { url: `${BASE}/blog`,      changeFrequency: "daily",   priority: 0.9, lastModified: now },
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

  return [...staticPages, ...blogPages];
}
