import type { Metadata } from 'next';
import PortfolioContent from './PortfolioContent';

export const metadata: Metadata = {
  title: 'Portfolio — Web Design & AI Projects | Flowi Kenya',
  description:
    'See our work: e-commerce sites, trading platforms, crypto apps, and AI chatbots. Real projects with real results. 50+ projects delivered for businesses across Kenya.',
  alternates: {
    canonical: 'https://useflowi.app/portfolio',
  },
  openGraph: {
    title: 'Portfolio — Web Design & AI Projects | Flowi',
    description:
      'Real projects. Real results. E-commerce, trading platforms, crypto apps, and AI chatbots built for businesses across Kenya.',
    url: 'https://useflowi.app/portfolio',
  },
};

const portfolioSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Flowi Portfolio',
  description:
    'Portfolio of web design, app development, and AI projects by Flowi agency in Nairobi, Kenya.',
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: 6,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'TrendyAirdrops',
        description: 'Crypto airdrop aggregator with live prices and DEX swap',
        url: 'https://trendyairdrops.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Woyuduin',
        description: 'Accountability app with AI counselor and content blocking',
        url: 'https://woyuduin.com',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Flowi Capital',
        description: 'Automated copy-trading platform with EA license management',
        url: 'https://flowicapital.com',
      },
    ],
  },
};

export default function PortfolioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />
      <PortfolioContent />
    </>
  );
}
