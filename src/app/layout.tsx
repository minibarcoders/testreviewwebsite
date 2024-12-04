import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/ui/Header';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

export const metadata = {
  title: 'Fixed or Custom - Tech Reviews',
  description: 'Honest reviews of modern technology with a splash of nostalgia.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <head />
      <body className={`${inter.variable} min-h-screen bg-white antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
