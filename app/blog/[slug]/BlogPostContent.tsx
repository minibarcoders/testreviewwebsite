'use client';

import { format } from 'date-fns';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect } from 'react';

interface Author {
  id: string;
  name: string;
  email: string;
}

interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  imageUrl: string;
  createdAt: Date;
  author: Author;
}

interface Props {
  article: Article;
}

export default function BlogPostContent({ article }: Props) {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('blog_post_view', {
      article_id: article.id,
      title: article.title
    });
  }, [article.id, article.title, trackEvent]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <article className="max-w-4xl mx-auto px-4 py-12 bg-white rounded-xl shadow-sm">
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
          <div className="mb-8 -mx-4 sm:mx-0">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-[400px] object-cover rounded-none sm:rounded-lg"
            />
          </div>
        )}

        <div 
          className="prose lg:prose-lg mx-auto max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </div>
  );
} 