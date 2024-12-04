'use client';

import { format } from 'date-fns';
import useAnalytics from '@/hooks/useAnalytics';
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
    trackEvent({
      name: 'blog_post_view',
      properties: {
        article_id: article.id,
        title: article.title
      }
    });
  }, [article.id, article.title, trackEvent]);

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

      <div 
        className="prose lg:prose-lg mx-auto"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
} 