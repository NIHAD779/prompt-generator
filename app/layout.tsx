import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://prompt-generator.app'),
  title: {
    default: "AI Prompt Generator - Optimize Prompts for Vibe Coding Tools",
    template: "%s | AI Prompt Generator"
  },
  description: "Transform your ideas into optimized prompts for AI-powered development tools like Lovable, Bolt, and Replit. Generate perfect prompts with AI assistance.",
  keywords: [
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
  authors: [{ name: "AI Prompt Generator Team" }],
  creator: "AI Prompt Generator",
  publisher: "AI Prompt Generator",
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
    siteName: "AI Prompt Generator",
    title: "AI Prompt Generator - Optimize Prompts for Vibe Coding Tools",
    description: "Transform your ideas into optimized prompts for AI-powered development tools like Lovable, Bolt, and Replit. Generate perfect prompts with AI assistance.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Prompt Generator - Optimize Your AI Development Prompts",
        type: "image/png",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Prompt Generator - Optimize Prompts for Vibe Coding Tools",
    description: "Transform your ideas into optimized prompts for AI-powered development tools like Lovable, Bolt, and Replit.",
    images: ["/twitter-image.png"],
    creator: "@promptgenerator",
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
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://prompt-generator.app'}/#webapp`,
        name: 'AI Prompt Generator',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://prompt-generator.app',
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
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://prompt-generator.app'}/#organization`,
        name: 'AI Prompt Generator',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://prompt-generator.app',
        logo: {
          '@type': 'ImageObject',
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://prompt-generator.app'}/logo.png`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://prompt-generator.app'}/#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: process.env.NEXT_PUBLIC_SITE_URL || 'https://prompt-generator.app',
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
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'https://prompt-generator.app'} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
