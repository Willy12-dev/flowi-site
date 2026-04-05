import type { Metadata } from 'next';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
  title: 'About Flowi — Premium Digital Agency in Nairobi, Kenya',
  description:
    'Flowi is a premium digital agency in Nairobi combining AI with world-class design. We build websites, chatbots, and marketing videos in days, not months. 50+ projects delivered.',
  alternates: {
    canonical: 'https://useflowi.app/about',
  },
  openGraph: {
    title: 'About Flowi — Premium Digital Agency in Nairobi',
    description:
      'AI-powered digital agency. 50+ projects, 98% satisfaction, 3-day delivery. Based in Nairobi, serving Africa and beyond.',
    url: 'https://useflowi.app/about',
  },
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Flowi',
  description:
    'Flowi is a premium digital agency in Nairobi, Kenya. We build websites, AI chatbots, and marketing videos for ambitious brands.',
  mainEntity: {
    '@type': 'Organization',
    name: 'Flowi',
    foundingDate: '2024',
    foundingLocation: 'Nairobi, Kenya',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: '5',
    },
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <AboutContent />
    </>
  );
}
