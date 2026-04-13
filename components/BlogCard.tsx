import Link from "next/link";

interface BlogCardProps {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  wordCount: number;
}

export default function BlogCard({
  slug,
  title,
  description,
  date,
  category,
  tags,
  wordCount,
}: BlogCardProps) {
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <Link href={`/blog/${slug}`} className="group block">
      <article className="rounded-2xl border border-border bg-surface p-6 transition-all hover:border-blue/30 hover:bg-surface-light">
        <div className="mb-3 flex items-center gap-3 text-sm text-muted">
          {category && (
            <span className="rounded-full bg-blue/10 px-3 py-1 text-blue-light text-xs font-medium">
              {category}
            </span>
          )}
          <span>{new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          <span>{readTime} min read</span>
        </div>

        <h2 className="mb-2 text-xl font-semibold text-foreground group-hover:text-blue-light transition-colors">
          {title}
        </h2>

        <p className="text-muted text-sm leading-relaxed line-clamp-2">
          {description}
        </p>

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs text-muted/70">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
