'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';

interface Author {
  id: string;
  name: string;
  email: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  status: 'DRAFT' | 'PUBLISHED';
  category: 'REVIEW' | 'NEWS' | 'GUIDE' | 'BLOG';
  createdAt: string;
  updatedAt: string;
  author: Author;
}

interface ArticleListProps {
  articles: Article[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    setLoading(id);
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete article');
      }

      router.refresh();
    } catch (err) {
      console.error('Error deleting article:', err);
      alert('Failed to delete article');
    } finally {
      setLoading(null);
    }
  };

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-gray-500">
          No articles yet. Create your first article by clicking the "New Article" button above.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {articles.map((article) => (
        <li key={article.id} className="hover:bg-gray-50">
          <div className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {article.title}
                </h3>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span className="truncate">By {article.author.name}</span>
                  <span className="mx-1">•</span>
                  <span>{format(new Date(article.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-2 py-1 text-sm rounded-full ${
                    article.status === 'PUBLISHED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {article.status}
                </span>
                <span className="px-2 py-1 text-sm bg-purple-100 text-purple-800 rounded-full">
                  {article.category}
                </span>
              </div>
            </div>
            <p className="mt-2 text-gray-600 line-clamp-2">{article.summary}</p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => router.push(`/admin/articles/${article.id}/edit`)}
                className="inline-flex items-center px-3 py-1 text-sm text-indigo-600 hover:text-indigo-900 focus:outline-none"
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(article.id)}
                disabled={loading === article.id}
                className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-900 focus:outline-none disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
