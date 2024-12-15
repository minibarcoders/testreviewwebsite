import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Header from './components/ui/Header'
import Footer from './components/ui/Footer'
import GoogleAnalytics from './components/GoogleAnalytics'
import Providers from './components/Providers'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: 'Fixed or Custom - Tech Reviews & Guides',
    template: '%s | Fixed or Custom'
  },
  description: 'Expert tech reviews and in-depth guides to help you make informed decisions about your tech purchases.',
  keywords: ['tech reviews', 'tech guides', 'custom builds', 'tech comparisons', 'product reviews'],
  authors: [{ name: 'Fixed or Custom Team' }],
  creator: 'Fixed or Custom',
  publisher: 'Fixed or Custom',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fixedorcustom.com',
    siteName: 'Fixed or Custom',
    title: 'Fixed or Custom - Tech Reviews & Guides',
    description: 'Expert tech reviews and in-depth guides to help you make informed decisions about your tech purchases.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fixed or Custom',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fixed or Custom - Tech Reviews & Guides',
    description: 'Expert tech reviews and in-depth guides to help you make informed decisions about your tech purchases.',
    images: ['/images/og-image.jpg'],
    creator: '@fixedorcustom',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 flex flex-col">
        <Providers>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <GoogleAnalytics />
        </Providers>
      </body>
    </html>
  )
}
