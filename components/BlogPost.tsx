interface BlogPostProps {
  htmlContent: string;
}

/**
 * Article body — editorial paper style.
 * Serif body (Fraunces) at 18px / 1.7, ~64ch measure, ink color.
 */
export default function BlogPostContent({ htmlContent }: BlogPostProps) {
  return (
    <div
      className="article-body"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
