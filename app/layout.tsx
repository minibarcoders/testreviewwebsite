import Providers from './components/Providers';
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: 'Tech Review Site',
    template: '%s | Tech Review Site'
  },
  description: 'In-depth tech reviews and analysis',
  keywords: ['tech', 'reviews', 'technology', 'gadgets', 'analysis'],
  authors: [{ name: 'Tech Review Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Tech Review Site',
    images: [{
      url: '/images/logo.png',
      width: 1200,
      height: 630,
      alt: 'Tech Review Site'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/logo.png']
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
