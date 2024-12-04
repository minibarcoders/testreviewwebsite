'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAnalytics } from '../../hooks/useAnalytics';
import { BlogArticle } from '../../services/articleService';
import { format } from 'date-fns';

type Props = {
  post: BlogArticle;
};

export default function BlogPostContent({ post }: Props) {
  const { trackEvent, trackEngagement } = useAnalytics();

  useEffect(() => {
    // Track page view with additional data
    trackEvent('blog_view', {
      post_title: post.title,
      post_slug: post.slug,
      post_category: post.category,
      author: post.author.name
    });

    // Start tracking read time
    const startTime = Date.now();

    // Track scroll depth
    const handleScroll = () => {
      const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
      if (scrollPercent > 90) {
        trackEngagement('blog_read_complete', post.slug);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      // Track time spent on page when leaving
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackEvent('blog_read_duration', {
        post_slug: post.slug,
        duration_seconds: timeSpent
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, [post, trackEvent, trackEngagement]);

  return (
    <main className="min-h-screen pt-32 px-4">
      <article className="max-w-4xl mx-auto">
        {/* Back to Blog Link */}
        <Link
          href="/blog"
          className="inline-flex items-center mb-8 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 
                   hover:bg-indigo-100 active:bg-indigo-200 transform hover:scale-105 
                   transition-all duration-200 ease-in-out group w-fit"
        >
          <svg 
            className="mr-2 w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        {/* Hero Section */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full font-medium mb-2 md:mb-0 
                         transform hover:scale-105 transition-all duration-200">
              {post.category}
            </span>
            <time className="text-gray-500">
              {format(new Date(post.createdAt), 'MMMM d, yyyy')}
            </time>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">{post.title}</h1>

          <div className="flex items-center mb-8">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-medium text-indigo-600 mr-4 
                         transform hover:scale-110 transition-transform duration-200">
              {post.author.name[0]}
            </div>
            <div>
              <p className="font-medium text-gray-900">{post.author.name}</p>
              <p className="text-gray-500">Tech Writer</p>
            </div>
          </div>

          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg mb-8">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </header>

        {/* Main Content */}
        <div 
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share Section */}
        <footer className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Share this article</h2>
          <div className="flex space-x-4">
            {['Twitter', 'Facebook', 'LinkedIn'].map((platform) => (
              <button
                key={platform}
                onClick={() => trackEvent('share_click', { platform, post_slug: post.slug })}
                className="px-6 py-3 bg-gray-100 rounded-lg text-gray-700 font-medium
                         hover:bg-gray-200 transform hover:scale-105 
                         transition-all duration-200 ease-in-out"
              >
                Share on {platform}
              </button>
            ))}
          </div>
        </footer>
      </article>
    </main>
  );
} 