import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import GoogleAnalytics from "./components/GoogleAnalytics";
import MicrosoftClarity from "./components/MicrosoftClarity";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://healmyprompt.com'),
  title: {
    default: "HealMyPrompt - Optimize Prompts for Vibe Coding Tools",
    template: "%s | HealMyPrompt"
  },
  description: "Transform your ideas into optimized prompts for AI-powered development tools like Lovable, Bolt, and Replit. Generate perfect prompts with AI assistance.",
  keywords: [
    "HealMyPrompt",
    "AI prompt generator",
    "vibe coding",
    "Lovable",
    "Bolt",
    "Replit",
    "AI development tools",
    "prompt optimization",
    "code generation",
    "AI coding assistant",
    "prompt engineering",
    "GPT-4",
    "AI prompts"
  ],
  authors: [{ name: "HealMyPrompt Team" }],
  creator: "HealMyPrompt",
  publisher: "HealMyPrompt",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "HealMyPrompt",
    title: "HealMyPrompt - Optimize Prompts for Vibe Coding Tools",
    description: "Transform your ideas into optimized prompts for AI-powered development tools like Lovable, Bolt, and Replit. Generate perfect prompts with AI assistance.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HealMyPrompt - Optimize Your AI Development Prompts",
        type: "image/png",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HealMyPrompt - Optimize Prompts for Vibe Coding Tools",
    description: "Transform your ideas into optimized prompts for AI-powered development tools like Lovable, Bolt, and Replit.",
    images: ["/twitter-image.png"],
    creator: "@healmyprompt",
  },
  alternates: {
    canonical: "/",
  },
  category: "technology",
  verification: {
    // Add your verification codes when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://healmyprompt.com'}/#webapp`,
        name: 'HealMyPrompt',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://healmyprompt.com',
        description: 'Transform your ideas into optimized prompts for AI-powered development tools like Lovable, Bolt, and Replit.',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          'AI-Powered Prompt Generation',
          'Optimized for Vibe Coding Tools',
          'Support for Lovable, Bolt, and Replit',
          'Real-time Prompt Optimization',
          'Copy to Clipboard Functionality'
        ],
      },
      {
        '@type': 'Organization',
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://healmyprompt.com'}/#organization`,
        name: 'HealMyPrompt',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://healmyprompt.com',
        logo: {
          '@type': 'ImageObject',
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://healmyprompt.com'}/logo.png`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://healmyprompt.com'}/#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: process.env.NEXT_PUBLIC_SITE_URL || 'https://healmyprompt.com',
          },
        ],
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="light" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'https://healmyprompt.com'} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${robotoMono.variable} antialiased`}
      >
        {children}
        <Footer />
        <GoogleAnalytics />
        <MicrosoftClarity />
      </body>
    </html>
  );
}
