'use client';

import { notFound } from 'next/navigation';
import { ArticleService } from '@/services/articleService';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { useAnalytics } from '@/app/hooks/useAnalytics';
import { useEffect } from 'react';

interface Props {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await ArticleService.getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  return {
    title: `${post.title} - Fixed or Custom Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://fixedorcustom.com/blog/${post.slug}`,
      images: [
        {
          url: post.imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl],
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const { trackEvent, trackEngagement } = useAnalytics();
  const post = await ArticleService.getBlogPostBySlug(params.slug);

  useEffect(() => {
    if (post) {
      // Track page view with additional data
      trackEvent('blog_view', {
        post_title: post.title,
        post_slug: post.slug,
        post_category: post.category,
        author: post.author
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
    }
  }, [post, trackEvent, trackEngagement]);

  if (!post) {
    notFound();
  }

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
            <div className="flex items-center space-x-4">
              {post.readingTime && (
                <span className="px-3 py-1 bg-gray-800 text-white rounded-full text-sm">
                  {post.readingTime}
                </span>
              )}
              <span className="text-gray-500">{post.date}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">{post.title}</h1>

          <div className="flex items-center mb-8">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-medium text-indigo-600 mr-4 
                         transform hover:scale-110 transition-transform duration-200">
              {post.author[0]}
            </div>
            <div>
              <p className="font-medium text-gray-900">{post.author}</p>
              <p className="text-gray-500">Tech Writer</p>
            </div>
          </div>

          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg mb-8 
                       transform hover:scale-[1.01] transition-all duration-300">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        {/* Tags Section */}
        <section className="mb-12">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium
                         transform hover:scale-105 hover:bg-gray-200 transition-all duration-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

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