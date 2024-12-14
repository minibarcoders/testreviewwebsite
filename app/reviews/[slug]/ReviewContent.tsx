'use client';

import { format } from 'date-fns';
import { useAnalytics } from 'app/hooks/useAnalytics';
import { useEffect } from 'react';
import ScoreBar from 'app/components/ui/ScoreBar';

interface Author {
  id: string;
  name: string;
  email: string;
}

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
  createdAt: Date;
  author: Author;
  rating?: Rating;
  pros?: string[];
  cons?: string[];
}

interface Props {
  article: Article;
}

function ReviewContent({ article }: Props) {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('review_view', {
      article_id: article.id,
      title: article.title,
      rating: article.rating?.overall,
    });
  }, [trackEvent, article.id, article.title, article.rating?.overall]);

  // Take only the first 5 pros and cons
  const topPros = article.pros?.slice(0, 5) || [];
  const topCons = article.cons?.slice(0, 5) || [];

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Hero Section */}
      <header className="relative h-[80vh] min-h-[700px] w-full">
        <div className="absolute inset-0">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-12 pb-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4 text-white/80 text-lg">
              <span className="font-medium">{article.author.name}</span>
              <span>•</span>
              <time dateTime={article.createdAt.toISOString()}>
                {format(new Date(article.createdAt), 'MMMM d, yyyy')}
              </time>
            </div>
            <h1 className="text-6xl font-bold text-white leading-tight">
              {article.title}
            </h1>
            <p className="text-2xl text-white/90 max-w-3xl leading-relaxed">
              {article.summary}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Article Content */}
          <div className="lg:col-span-2">
            <div 
              className="prose lg:prose-lg prose-indigo mb-12 bg-white rounded-2xl shadow-xl p-10"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Quick Take Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Take</h2>
                <p className="text-gray-600 mb-10 leading-relaxed text-lg">{article.summary}</p>

                {/* Score Bars */}
                {article.rating && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Ratings</h3>
                    <ScoreBar 
                      score={article.rating.overall} 
                      label="Overall"
                      description="Final verdict"
                    />
                    <ScoreBar 
                      score={article.rating.design} 
                      label="Design"
                      description="Build quality & aesthetics"
                    />
                    <ScoreBar 
                      score={article.rating.features} 
                      label="Features"
                      description="Functionality & capabilities"
                    />
                    <ScoreBar 
                      score={article.rating.performance} 
                      label="Performance"
                      description="Speed & reliability"
                    />
                    <ScoreBar 
                      score={article.rating.value} 
                      label="Value"
                      description="Price to performance ratio"
                    />
                  </div>
                )}
              </div>

              {/* Plus Points Card */}
              {topPros.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold">
                      +
                    </span>
                    <h3 className="text-lg font-medium text-gray-900">Plus Points</h3>
                  </div>
                  <ul className="space-y-4">
                    {topPros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-medium mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-600 leading-tight">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Minus Points Card */}
              {topCons.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl font-bold">
                      −
                    </span>
                    <h3 className="text-lg font-medium text-gray-900">Minus Points</h3>
                  </div>
                  <ul className="space-y-4">
                    {topCons.map((con, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm font-medium mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-600 leading-tight">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Share Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Share this review</h3>
                <div className="flex items-center gap-4">
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ReviewContent;
