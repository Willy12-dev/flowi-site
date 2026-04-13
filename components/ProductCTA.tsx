interface ProductCTAProps {
  title: string;
  description: string;
  url: string;
  price?: string;
}

export default function ProductCTA({ title, description, url, price }: ProductCTAProps) {
  return (
    <div className="my-10 rounded-2xl border border-blue/20 bg-gradient-to-r from-blue/5 to-accent/5 p-6">
      <p className="text-sm font-medium text-blue-light mb-1">Recommended</p>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted text-sm mb-4">{description}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-blue px-6 py-3 text-sm font-medium text-white hover:bg-blue-dark transition-colors"
      >
        {price ? `Get it — ${price}` : "Learn more"}
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}
