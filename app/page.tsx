import { ArrowRight, Award } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';
import { Metadata } from 'next';

interface Rating {
  overall: number;
  design: number;
  features: number;
  performance: number;
  value: number;
}

interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  imageUrl: string;
  slug: string;
  createdAt: Date;
  rating: Rating | null;
  author: {
    name: string;
  };
}

export const metadata: Metadata = {
  title: 'Fixed or Custom - Tech Reviews & Guides',
  description: 'Expert tech reviews and in-depth guides to help you make informed decisions about your tech purchases.',
};

export default async function HomePage() {
  const [latestReviews, latestPosts] = await Promise.all([
    prisma.article.findMany({
      where: {
        category: Category.REVIEW,
        published: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3,
      include: {
        author: true
      }
    }),
    prisma.article.findMany({
      where: {
        category: Category.BLOG,
        published: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3,
      include: {
        author: true
      }
    })
  ]) as [Article[], Article[]];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 to-purple-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Make Better Tech Decisions
            </h1>
            <p className="text-xl md:text-2xl text-indigo-200 mb-8 max-w-3xl mx-auto">
              Expert reviews and in-depth guides to help you choose between custom builds and fixed solutions.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/reviews"
                className="bg-white text-indigo-900 px-8 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
              >
                Read Reviews
              </Link>
              <Link
                href="/blog"
                className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                View Guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest Reviews</h2>
            <Link
              href="/reviews"
              className="text-indigo-600 hover:text-indigo-500 font-medium inline-flex items-center"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestReviews.map((review) => (
              <Link
                key={review.id}
                href={`/reviews/${review.slug}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="relative aspect-[16/9]">
                  <img
                    src={review.imageUrl}
                    alt={review.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {review.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {review.summary}
                  </p>
                  {review.rating && (
                    <div className="flex items-center text-yellow-500">
                      <Award className="h-5 w-5 mr-1" />
                      <span className="font-medium">{review.rating.overall}/10</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest Posts</h2>
            <Link
              href="/blog"
              className="text-indigo-600 hover:text-indigo-500 font-medium inline-flex items-center"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="relative aspect-[16/9]">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2">
                    {post.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
} 