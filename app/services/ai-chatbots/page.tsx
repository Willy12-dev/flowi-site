import type { Metadata } from 'next';
import AIChatbotsContent from './AIChatbotsContent';

export const metadata: Metadata = {
  title: 'AI Chatbots for WhatsApp & Websites — Flowi Kenya',
  description:
    'AI-powered chatbots for WhatsApp and your website. Handle customer inquiries, take orders, close sales 24/7. Built for Kenyan businesses with M-Pesa integration. From KES 30,000.',
  alternates: {
    canonical: 'https://useflowi.app/services/ai-chatbots',
  },
  openGraph: {
    title: 'AI Chatbots for WhatsApp & Websites — Flowi',
    description:
      'Your business, always on. AI chatbots that handle customers on WhatsApp and your website 24/7. M-Pesa integration included.',
    url: 'https://useflowi.app/services/ai-chatbots',
  },
  keywords: [
    'AI chatbot Kenya',
    'WhatsApp chatbot Kenya',
    'WhatsApp automation Nairobi',
    'AI chatbot for business',
    'chatbot M-Pesa',
    'customer service automation Kenya',
    'WhatsApp bot',
  ],
};

const chatbotServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'AI Chatbot Development',
  provider: {
    '@type': 'Organization',
    name: 'Flowi',
    url: 'https://useflowi.app',
  },
  description:
    'AI-powered chatbots for WhatsApp and websites. Handle customer inquiries, take orders, and close sales 24/7.',
  areaServed: 'Kenya',
  serviceType: 'AI Chatbot Development',
  offers: [
    {
      '@type': 'Offer',
      name: 'Starter Bot',
      price: '30000',
      priceCurrency: 'KES',
      description: 'Basic FAQ chatbot with website widget and 50 trained responses',
    },
    {
      '@type': 'Offer',
      name: 'Business Bot',
      price: '80000',
      priceCurrency: 'KES',
      description: 'AI-powered chatbot for WhatsApp and website with M-Pesa and CRM integration',
    },
    {
      '@type': 'Offer',
      name: 'Enterprise Bot',
      price: '200000',
      priceCurrency: 'KES',
      description: 'Fully custom AI assistant with multi-channel support and analytics dashboard',
    },
  ],
};

export default function AIChatbotsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(chatbotServiceSchema) }}
      />
      <AIChatbotsContent />
    </>
  );
}
