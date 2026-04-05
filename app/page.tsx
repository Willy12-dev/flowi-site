import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import Process from '@/components/Process';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export const metadata: Metadata = {
  title: 'Flowi — Premium Web Design, AI Chatbots & Video Production | Nairobi',
  description:
    'We build stunning websites, AI chatbots, mobile apps, and AI-powered marketing videos for ambitious brands. Based in Nairobi, delivered in days not months.',
  alternates: {
    canonical: 'https://useflowi.app',
  },
  openGraph: {
    title: 'Flowi — Premium Web Design, AI Chatbots & Video Production',
    description:
      'Premium websites, AI chatbots, mobile apps & marketing videos. Built in Nairobi, serving the world. Delivered in days.',
    url: 'https://useflowi.app',
  },
};

const homePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Flowi',
  url: 'https://useflowi.app',
  description:
    'Premium digital agency building websites, AI chatbots, and marketing videos for ambitious brands in Kenya and beyond.',
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
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <Portfolio />
      <Process />
      <Pricing />
      <Testimonials />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
