'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAnalytics } from '../../hooks/useAnalytics';
import { ReviewArticle } from '../../services/articleService';
import ScoreDisplay from '../../components/ui/ScoreDisplay';
import { format } from 'date-fns';

type Props = {
  review: ReviewArticle;
};

export default function ReviewContent({ review }: Props) {
  const { trackEvent, trackEngagement } = useAnalytics();

  useEffect(() => {
    // Track page view with additional data
    trackEvent('review_view', {
      review_title: review.title,
      review_slug: review.slug,
      review_category: review.category,
      author: review.author.name
    });

    // Track scroll depth
    const handleScroll = () => {
      const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
      if (scrollPercent > 90) {
        trackEngagement('review_read_complete', review.slug);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [review, trackEvent, trackEngagement]);

  return (
    <main className="min-h-screen pt-32 px-4">
      <article className="max-w-4xl mx-auto">
        {/* Back to Reviews Link */}
        <Link
          href="/reviews"
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
          Back to Reviews
        </Link>

        {/* Hero Section */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full font-medium mb-2 md:mb-0">
              {review.category}
            </span>
            <time className="text-gray-500">
              {format(new Date(review.createdAt), 'MMMM d, yyyy')}
            </time>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">{review.title}</h1>
          
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-medium text-indigo-600 mr-4">
              {review.author.name[0]}
            </div>
            <div>
              <p className="font-medium text-gray-900">{review.author.name}</p>
              <p className="text-gray-500">Tech Reviewer</p>
            </div>
          </div>

          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg mb-8">
            <img
              src={review.imageUrl}
              alt={review.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Opening Quote */}
          <blockquote className="relative">
            <div className="absolute top-0 left-0 transform -translate-x-6 -translate-y-4 text-indigo-200 text-6xl font-serif">
              "
            </div>
            <p className="text-xl md:text-2xl text-gray-700 italic pl-4 pr-12 relative">
              {review.summary}
            </p>
            <div className="absolute bottom-0 right-0 transform translate-x-4 translate-y-2 text-indigo-200 text-6xl font-serif">
              "
            </div>
          </blockquote>
        </header>

        {/* Score Section */}
        <section className="bg-white rounded-xl p-8 mb-12 shadow-lg">
          <div className="flex flex-col md:flex-row items-start justify-between">
            <div className="mb-6 md:mb-0 md:mr-8 md:flex-1">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Verdict</h2>
              <p className="text-lg text-gray-700 mb-4">{review.summary}</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(review.rating).map((aspect) => (
                  <span 
                    key={aspect}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600"
                  >
                    {aspect.charAt(0).toUpperCase() + aspect.slice(1)}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
              <ScoreDisplay score={review.rating.overall} size="lg" />
            </div>
          </div>
        </section>

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Pros Section */}
          <section className="bg-white rounded-xl p-8 shadow-lg group">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 
                           flex items-center justify-center shadow-lg group-hover:shadow-emerald-200/50 
                           transition-shadow duration-500">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold ml-4 bg-gradient-to-r from-emerald-600 to-teal-700 
                          bg-clip-text text-transparent">
                Pros
              </h2>
            </div>
            <ul className="space-y-4">
              {review.pros.map((pro, index) => (
                <li key={index} className="flex items-start group/item">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center 
                               mr-3 mt-0.5 group-hover/item:bg-emerald-200 transition-colors duration-200">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-200">
                    {pro}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Cons Section */}
          <section className="bg-white rounded-xl p-8 shadow-lg group">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 
                           flex items-center justify-center shadow-lg group-hover:shadow-rose-200/50 
                           transition-shadow duration-500">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold ml-4 bg-gradient-to-r from-rose-600 to-pink-700 
                          bg-clip-text text-transparent">
                Cons
              </h2>
            </div>
            <ul className="space-y-4">
              {review.cons.map((con, index) => (
                <li key={index} className="flex items-start group/item">
                  <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center 
                               mr-3 mt-0.5 group-hover/item:bg-rose-200 transition-colors duration-200">
                    <svg className="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-200">
                    {con}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Main Content */}
        <div 
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: review.content }}
        />
      </article>
    </main>
  );
} 