import { format } from 'date-fns';
import { ArrowRight, Award } from 'lucide-react';
import Link from 'next/link';
import { ArticleService } from './services/articleService';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fixed or Custom - Tech Reviews & Insights',
  description: 'Discover in-depth tech reviews, expert analysis, and the latest insights. Your trusted source for making informed technology decisions.',
  keywords: ['tech reviews', 'technology insights', 'gadget reviews', 'tech blog'],
  openGraph: {
    title: 'Fixed or Custom - Tech Reviews & Insights',
    description: 'Your trusted source for tech reviews and insights',
    type: 'website',
    url: 'https://fixedorcustom.com',
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
    title: 'Fixed or Custom - Tech Reviews & Insights',
    description: 'Your trusted source for tech reviews and insights',
    images: ['/images/og-image.jpg'],
  },
};

export default async function Home() {
  const latestReviews = await ArticleService.getLatestReviews(3);
  const latestPosts = await ArticleService.getLatestBlogPosts(4);

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div className="relative aspect-[1200/600] w-full bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 opacity-40" />
        </div>
        
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 inline-flex text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
              Welcome to Fixed or Custom
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent sm:text-6xl">
              Tech Reviews & Insights
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Discover in-depth reviews, expert analysis, and the latest tech insights. Your trusted source for making informed technology decisions.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/reviews"
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 hover:scale-105"
              >
                View Reviews
              </Link>
              <Link
                href="/blog"
                className="rounded-lg px-6 py-3 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-200 hover:ring-indigo-300 hover:bg-indigo-50 transition-all duration-300"
              >
                Read Blog
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Reviews Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
              <Award className="text-indigo-600" />
              Latest Reviews
            </h2>
            <Link 
              href="/reviews" 
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
            >
              View all reviews
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestReviews.map((review: ReviewArticle) => (
              <Link 
                key={review.id} 
                href={`/reviews/${review.slug}`}
                className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                
                {/* Card Content */}
                <div className="relative bg-white rounded-xl p-4">
                  {/* Image */}
                  <div className="aspect-[16/9] rounded-lg overflow-hidden mb-4">
                    <img
                      src={review.imageUrl}
                      alt={review.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span>{review.category}</span>
                      <span>•</span>
                      <time>{review.date}</time>
                    </div>
                    
                    <h2 className="font-bold text-xl text-slate-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {review.title}
                    </h2>
                    
                    <p className="text-slate-600 line-clamp-3">
                      {review.snippet}
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-2 pt-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-slate-600">
                          {review.author[0]}
                        </span>
                      </div>
                      <span className="text-sm text-slate-600">{review.author}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      <section className="py-16 bg-gradient-to-b from-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Latest from the Blog</h2>
            <Link 
              href="/blog" 
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
            >
              View all posts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {latestPosts.map((post: BlogArticle, index: number) => (
              <article 
                key={post.id}
                className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden
                  ${index === 0 ? 'md:col-span-2' : ''}`}
              >
                <Link href={`/blog/${post.slug}`} className="group">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    <div className={`relative ${index === 0 ? 'aspect-[2/1] md:w-2/3' : 'aspect-[16/9] md:w-1/3'}`}>
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                          <span className="font-medium text-slate-600 text-sm">
                            {post.author[0]}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{post.author}</div>
                          <div className="text-xs text-slate-500">
                            {post.date}
                          </div>
                        </div>
                      </div>

                      <h3 className={`font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors
                        ${index === 0 ? 'text-2xl' : 'text-xl'}`}>
                        {post.title}
                      </h3>
                      
                      <p className="text-slate-600 line-clamp-2">{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
} 