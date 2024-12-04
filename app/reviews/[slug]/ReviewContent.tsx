'use client';

import { format } from 'date-fns';
import useAnalytics from '@/hooks/useAnalytics';
import { useEffect } from 'react';
import ScoreDisplay from '@/components/ui/ScoreDisplay';

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

export default function ReviewContent({ article }: Props) {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('review_view', {
      article_id: article.id,
      title: article.title,
      rating: article.rating?.overall
    });
  }, [article.id, article.title, article.rating?.overall, trackEvent]);

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
        <div className="flex items-center text-gray-600 text-sm">
          <span>By {article.author.name}</span>
          <span className="mx-2">•</span>
          <time dateTime={article.createdAt.toISOString()}>
            {format(new Date(article.createdAt), 'MMMM d, yyyy')}
          </time>
        </div>
      </header>

      {article.imageUrl && (
        <div className="mb-8">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
      )}

      {article.rating && (
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Scores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScoreDisplay label="Overall" score={article.rating.overall} />
            <ScoreDisplay label="Design" score={article.rating.design} />
            <ScoreDisplay label="Features" score={article.rating.features} />
            <ScoreDisplay label="Performance" score={article.rating.performance} />
            <ScoreDisplay label="Value" score={article.rating.value} />
          </div>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {article.pros && article.pros.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pros</h2>
            <ul className="space-y-2">
              {article.pros.map((pro, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
        )}

        {article.cons && article.cons.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cons</h2>
            <ul className="space-y-2">
              {article.cons.map((con, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-rose-500 mr-2">✗</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div 
        className="prose lg:prose-lg mx-auto"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
} 