import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostsByCategory, getCategories } from "@/lib/blog";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.toLowerCase() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const formatted = category.replace(/_/g, " ");
  return {
    title: `${formatted} — Daily AI Brief`,
    description: `Editorial coverage in the ${formatted} vertical from Flowi.`,
    alternates: { canonical: `https://useflowi.app/blog/category/${category}` },
  };
}

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const posts = getPostsByCategory(category);
  const formatted = category.replace(/_/g, " ");

  if (posts.length === 0 && !getCategories().some((c) => c.toLowerCase() === category.toLowerCase())) {
    notFound();
  }

  // BreadcrumbList JSON-LD: Home -> Blog -> Category
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://useflowi.app" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://useflowi.app/blog" },
      {
        "@type": "ListItem",
        position: 3,
        name: formatted.charAt(0).toUpperCase() + formatted.slice(1),
        item: `https://useflowi.app/blog/category/${category}`,
      },
    ],
  };

  // CollectionPage JSON-LD: tells Google this is a curated index of articles
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${formatted.charAt(0).toUpperCase() + formatted.slice(1)} — Flowi`,
    description: `Editorial coverage in the ${formatted} vertical from Flowi.`,
    url: `https://useflowi.app/blog/category/${category}`,
    isPartOf: { "@type": "WebSite", name: "Flowi", url: "https://useflowi.app" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 20).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://useflowi.app/blog/${p.slug}`,
        name: p.title,
      })),
    },
  };

  return (
    <main className="bg-[var(--bg)] text-[var(--ink)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <Nav />

      {/* Masthead */}
      <section className="page-gutter pt-12 md:pt-16 pb-8">
        <div className="page-max-wide">
          <div className="mb-6">
            <Link href="/blog" className="meta hover:text-[var(--accent)]">
              ← All categories
            </Link>
          </div>
          <p className="eyebrow eyebrow-mark mb-4">
            Category · {posts.length} {posts.length === 1 ? "article" : "articles"}
          </p>
          <h1 className="display text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] leading-[1.0] -tracking-[0.02em] mb-3 capitalize">
            {formatted}
          </h1>
        </div>
      </section>

      {/* Index */}
      <section className="page-gutter pt-8 pb-24 border-t border-[var(--rule)]">
        <div className="page-max-wide pt-8">
          {posts.length === 0 ? (
            <p className="meta italic py-12">No articles in this category yet.</p>
          ) : (
            <ol className="list-none p-0 m-0">
              {posts.map((p, i) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="index-row no-underline">
                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="source">{(p.category || "Article").replace(/_/g, " ")}</span>
                    <span className="title">{p.title}</span>
                    <span className="when tabular">{fmt(p.date)}</span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
