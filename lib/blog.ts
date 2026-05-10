import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  keywords: string[];
  author: string;
  products: string[];
  image: string;
  content: string;
  wordCount: number;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      return getPostBySlug(slug);
    })
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || "",
    description: data.description || "",
    date: data.date || "",
    category: data.category || "",
    tags: data.tags || [],
    keywords: data.keywords || [],
    author: data.author || "Flowi Editorial",
    products: data.products || [],
    image: data.image || "",
    content,
    wordCount: content.split(/\s+/).length,
  };
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Within a category, find the previous (older) and next (newer) post
 * relative to the given slug. Used for rel=prev/next + topic clustering.
 */
export function getPrevNextInCategory(
  slug: string,
  category: string
): { prev: BlogPost | null; next: BlogPost | null } {
  const posts = getPostsByCategory(category);
  // getAllPosts() returns newest first; for prev/next we want chronological order
  const chronological = [...posts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const idx = chronological.findIndex((p) => p.slug === slug);
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: idx > 0 ? chronological[idx - 1] : null,
    next: idx < chronological.length - 1 ? chronological[idx + 1] : null,
  };
}

export function getCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set(posts.map((p) => p.category).filter(Boolean));
  return Array.from(categories).sort();
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
