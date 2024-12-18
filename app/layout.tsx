import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './components/Providers';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Tech Review Site',
    template: '%s | Tech Review Site',
  },
  description: 'Expert reviews and in-depth guides to help you choose between custom builds and fixed solutions.',
  keywords: ['tech reviews', 'software reviews', 'tech guides', 'custom builds', 'fixed solutions'],
  authors: [{ name: 'Tech Review Team' }],
  creator: 'Tech Review Team',
  publisher: 'Tech Review Site',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: 'Tech Review Site',
    title: 'Tech Review Site',
    description: 'Expert reviews and in-depth guides to help you choose between custom builds and fixed solutions.',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Tech Review Site',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Review Site',
    description: 'Expert reviews and in-depth guides to help you choose between custom builds and fixed solutions.',
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/images/og-image.jpg`],
    creator: '@techreviewsite',
  },
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full`}>
        <ErrorBoundary>
          <Providers>
            <div className="min-h-full flex flex-col">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </Providers>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
