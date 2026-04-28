import type { Metadata } from 'next';
import HomeView from '@/components/home/HomeView';

export const metadata: Metadata = {
  title: 'Flowi — Boutique Digital Studio in Nairobi | Custom Websites, Apps & AI',
  description:
    'A small Nairobi studio designing and building custom websites, mobile apps, and AI tools for ambitious furniture, hospitality, fashion, and service brands across Kenya. No templates. Delivered in days.',
  alternates: {
    canonical: 'https://useflowi.app',
  },
  openGraph: {
    title: 'Flowi — Boutique Digital Studio in Nairobi',
    description:
      'Custom websites, apps and AI for ambitious Kenyan brands. No templates. Delivered in days.',
    url: 'https://useflowi.app',
  },
};

const homePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Flowi',
  url: 'https://useflowi.app',
  description:
    'Boutique digital studio in Nairobi designing and building custom websites, mobile apps, and AI tools for ambitious Kenyan brands.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://useflowi.app/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
      <HomeView />
    </>
  );
}
