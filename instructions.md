Create a high-performance tech review website with the following performance requirements:

Core Performance Targets:
- Lighthouse score: 95+ on all metrics
- First Contentful Paint (FCP): < 1.2s
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s

Tech Stack (Optimized for Performance):
1. Framework & Core:
- Next.js 14 App Router (server components by default)
- TypeScript
- Tailwind CSS (purged unused styles)
- Notion as CMS
- Vercel hosting with Edge Functions

2. Performance Optimizations:
- Zero client-side JavaScript by default
- Server Components wherever possible
- Client Components only where necessary (interactions)
- Static generation with ISR for most pages
- Edge caching strategy
- Route prefetching
- Optimized font loading with next/font
- Aggressive image optimization

3. Image Strategy:
- next/image with automatic optimization
- Responsive images with srcset
- Lazy loading for below-fold images
- AVIF/WebP format with fallbacks
- Placeholder blur thumbnails
- Self-hosted critical images

4. Database & API:
- Edge-cached API routes
- Lightweight database queries
- Connection pooling
- Serverless functions with edge runtime
- Minimal API payload size

5. Product Management:
- Lightweight product database schema
- Cached product information
- Optimized affiliate link handling
- Minimal client-side tracking

Project Structure:
/app
  /components
    /islands (client components)
    /ui (server components)
  /lib
    /notion
    /db
  /api
    /edge (edge functions)

Key Features (Performance Focused):
Performance Monitoring:

Real User Monitoring (RUM)
Core Web Vitals tracking
Lighthouse CI integration
Performance budgets in CI/CD

Build Optimization:

Bundle analysis
Tree shaking
Code splitting
Dynamic imports
Module/nomodule pattern
Critical CSS extraction
Minification

SEO & Performance:

Automated meta tags
Minimal JS for SEO content
Static generation of SEO pages
Structured data without bloat
Optimized robots.txt and sitemap

Loading Strategy:

Critical content first
Above-fold optimization
Progressive enhancement
Deferred non-critical JS
Priority hints for resources

Caching Strategy:

Static page caching
API response caching
Asset caching
Stale-while-revalidate
Edge caching

Development Guidelines:

No unnecessary dependencies
Bundle size monitoring
Performance testing in CI
Mobile-first development
Regular performance audits

CSS Strategy:

Critical CSS inline
Deferred non-critical styles
Minimal CSS architecture
Atomic CSS with Tailwind
No unused styles

#homepage ui

import React, { useState } from 'react';
import { Star, Monitor, Award, Menu, X, Cpu } from 'lucide-react';

const RetroTechReview = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const reviews = [
    {
      title: "Mechanical Keyboard XYZ",
      rating: 4.5,
      snippet: "Clicky, tactile, and built like a tank...",
      category: "Peripherals",
      date: "2024-03-15"
    },
    {
      title: "RetroPixel Monitor",
      rating: 5,
      snippet: "Perfect for that authentic retro gaming experience...",
      category: "Displays",
      date: "2024-03-10"
    },
    {
      title: "MechMaster Pro",
      rating: 4.8,
      snippet: "The ultimate mechanical keyboard for enthusiasts...",
      category: "Peripherals",
      date: "2024-03-05"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-indigo-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <Cpu className="text-indigo-600" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Retro<span className="text-indigo-600">Tech</span>
            </h1>
          </div>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>

          <nav className={`absolute md:relative top-16 md:top-0 right-0 md:right-auto w-48 md:w-auto
            bg-white md:bg-transparent shadow-lg md:shadow-none
            ${isMenuOpen ? 'block' : 'hidden'} md:block
            p-4 md:p-0 rounded-lg`}>
            <ul className="flex flex-col md:flex-row gap-6 md:gap-8 font-medium">
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">Reviews</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto py-16 px-4 text-center relative z-10">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            <h2 className="text-5xl font-bold mb-6">Reviewing Today's Tech</h2>
            <h3 className="text-2xl font-medium">With Yesterday's Charm</h3>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto mt-6 text-lg">
            Honest reviews of modern technology with a splash of nostalgia.
            No buzzwords, just straightforward analysis.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="grid grid-cols-8 gap-4 rotate-12 scale-150">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="w-8 h-8 bg-indigo-600 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Reviews */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 text-gray-900">
          <Award className="text-indigo-600" />
          Latest Reviews
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <article 
              key={index}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                    {review.title}
                  </h4>
                  <div className="flex items-center bg-indigo-50 px-2 py-1 rounded">
                    <Star className="w-4 h-4 text-indigo-600" />
                    <span className="ml-1 text-indigo-600 font-medium">{review.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{review.snippet}</p>
                <div className="flex justify-between text-sm">
                  <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full">
                    {review.category}
                  </span>
                  <span className="text-gray-500">{review.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RetroTechReview;