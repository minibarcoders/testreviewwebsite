import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/ui/Header'
import { Analytics } from "@vercel/analytics/react"
import GoogleAnalytics from './components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fixed or Custom',
  description: 'Tech reviews and guides to help you make informed decisions',
  metadataBase: new URL('https://fixedorcustom.com'),
  openGraph: {
    title: 'Fixed or Custom',
    description: 'Tech reviews and guides to help you make informed decisions',
    url: 'https://fixedorcustom.com',
    siteName: 'Fixed or Custom',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    title: 'Fixed or Custom',
    description: 'Tech reviews and guides to help you make informed decisions',
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleAnalytics />
        <Header />
        {children}
        <Analytics />
      </body>
    </html>
  )
} 