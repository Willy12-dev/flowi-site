interface BlogPostProps {
  htmlContent: string;
}

export default function BlogPostContent({ htmlContent }: BlogPostProps) {
  return (
    <div
      className="prose prose-invert prose-lg max-w-none
        prose-headings:text-foreground prose-headings:font-semibold
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-muted prose-p:leading-relaxed
        prose-a:text-blue-light prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground
        prose-li:text-muted
        prose-code:text-accent-light prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-surface-solid prose-pre:border prose-pre:border-border prose-pre:rounded-xl
        prose-blockquote:border-blue prose-blockquote:text-muted"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
