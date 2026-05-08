import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://useflowi.app";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                changeFrequency: "daily",   priority: 1.0, lastModified: new Date() },
    { url: `${baseUrl}/dispatch`,  changeFrequency: "monthly", priority: 0.9, lastModified: new Date() },
    { url: `${baseUrl}/courses`,   changeFrequency: "weekly",  priority: 0.9, lastModified: new Date() },
    { url: `${baseUrl}/blog`,      changeFrequency: "daily",   priority: 0.9, lastModified: new Date() },
    { url: `${baseUrl}/sources`,   changeFrequency: "monthly", priority: 0.6, lastModified: new Date() },
    { url: `${baseUrl}/about`,     changeFrequency: "monthly", priority: 0.7, lastModified: new Date() },
  ];

  const posts = getAllPosts();
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
