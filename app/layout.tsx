import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://useflowi.app"),
  title: {
    default:
      "Flowi — Premium Web Design, AI Chatbots & Video Production | Nairobi",
    template: "%s | Flowi",
  },
  description:
    "We build stunning websites, AI chatbots, mobile apps, and AI-powered marketing videos for ambitious brands. Based in Nairobi, serving the world.",
  keywords: [
    "web design Kenya",
    "website developer Nairobi",
    "app development Kenya",
    "AI chatbot Kenya",
    "AI chatbot WhatsApp",
    "AI video production",
    "AI video production Kenya",
    "WhatsApp automation Kenya",
    "M-Pesa integration",
    "M-Pesa website payment",
    "web design agency Nairobi",
    "website design Nairobi",
    "e-commerce Kenya",
    "mobile app development Nairobi",
    "Flowi",
    "Flowi agency",
    "digital agency Kenya",
    "best web designer Kenya",
  ],
  openGraph: {
    title: "Flowi — Premium Web Design, AI Chatbots & Video Production",
    description:
      "We build stunning websites, AI chatbots, mobile apps, and AI-powered marketing videos for ambitious brands. Based in Nairobi.",
    type: "website",
    url: "https://useflowi.app",
    siteName: "Flowi",
    locale: "en_US",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Flowi — Premium Web Design & AI Agency in Nairobi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flowi — Premium Web Design & AI Agency",
    description:
      "Websites, AI chatbots, video production, and M-Pesa integration. Built in days, not months.",
    images: ["/images/og-image.png"],
    creator: "@FlowiGroup",
  },
  alternates: {
    canonical: "https://useflowi.app",
  },
  icons: {
    icon: "/images/logo-icon.png",
    apple: "/images/logo-icon.png",
  },
  manifest: "/manifest.json",
};

// JSON-LD Organization Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Flowi",
  url: "https://useflowi.app",
  logo: "https://useflowi.app/images/LOGOOOO.png",
  description:
    "Premium digital agency building websites, AI chatbots, mobile apps, and AI-powered marketing videos. Based in Nairobi, Kenya.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+254714257688",
    contactType: "sales",
    availableLanguage: ["English", "Swahili"],
  },
  sameAs: [
    "https://twitter.com/FlowiGroup",
    "https://www.tiktok.com/@flowigroup",
    "https://www.instagram.com/flowigroup",
  ],
  foundingDate: "2024",
  areaServed: ["Kenya", "East Africa", "Africa"],
  serviceType: [
    "Web Design",
    "Web Development",
    "AI Chatbot Development",
    "AI Video Production",
    "Mobile App Development",
    "WhatsApp Automation",
    "M-Pesa Integration",
  ],
};

// JSON-LD LocalBusiness Schema
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Flowi — Web Design & AI Agency",
  image: "https://useflowi.app/images/LOGOOOO.png",
  url: "https://useflowi.app",
  telephone: "+254714257688",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressRegion: "Nairobi",
    addressCountry: "KE",
  },
  priceRange: "KES 30,000 - KES 500,000+",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ],
    opens: "08:00",
    closes: "18:00",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "40",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col grain">{children}</body>
    </html>
  );
}
