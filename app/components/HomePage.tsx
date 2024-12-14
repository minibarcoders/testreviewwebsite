'use client';

import { ArrowRight, Award, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Category } from '@prisma/client';

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

interface Props {
  latestReviews: Article[];
  latestPosts: Article[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function isRating(rating: any): rating is Rating {
  return rating && typeof rating === 'object' && 'overall' in rating;
}

export default function HomePage({ latestReviews, latestPosts }: Props) {
  const defaultImage = '/images/placeholder.png';

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white" style={{marginTop: '80px'}}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-indigo-900/90"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Make Better
              <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Tech Decisions
              </span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              Expert reviews and in-depth guides to help you choose between custom builds and fixed solutions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/reviews"
                className="group bg-white text-indigo-900 px-6 py-3 rounded-xl font-medium hover:bg-indigo-50 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Read Reviews</span>
                <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/blog"
                className="group border-2 border-white text-white px-6 py-3 rounded-xl font-medium hover:bg-white/10 transition-colors flex items-center justify-center space-x-2"
              >
                <span>View Guides</span>
                <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest Reviews */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
            className="space-y-12"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-bold text-gray-900">Latest Reviews</h2>
              <Link
                href="/reviews"
                className="group text-indigo-600 hover:text-indigo-500 font-medium inline-flex items-center"
              >
                View All
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestReviews.map((review, index) => (
                <motion.div key={review.id} variants={item} className="h-full">
                  <Link
                    href={`/reviews/${review.slug}`}
                    className="group flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/9]">
                      <img
                        src={review.imageUrl || defaultImage}
                        alt={review.title}
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      {review.rating && isRating(review.rating) && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center text-yellow-500">
                          <Award className="h-5 w-5 mr-1" />
                          <span className="font-medium">{review.rating.overall}/10</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-grow p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {review.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2 mb-4 text-lg flex-grow">
                        {review.summary}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
                        <span>By {review.author.name}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
            className="space-y-12"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-bold text-gray-900">Latest Posts</h2>
              <Link
                href="/blog"
                className="group text-indigo-600 hover:text-indigo-500 font-medium inline-flex items-center"
              >
                View All
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map((post, index) => (
                <motion.div key={post.id} variants={item} className="h-full">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/9]">
                      <img
                        src={post.imageUrl || defaultImage}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex flex-col flex-grow p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2 text-lg flex-grow">
                        {post.summary}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
                        <span>By {post.author.name}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
