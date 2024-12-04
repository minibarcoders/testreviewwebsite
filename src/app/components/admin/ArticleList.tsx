'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  createdAt: Date;
  author: {
    name: string;
  };
}

interface ArticleListProps {
  articles: Article[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete article');

      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article');
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {articles.map((article) => (
          <li key={article.id}>
            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="sm:flex sm:items-center sm:justify-between flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {article.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {article.summary}
                    </p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                        {article.category}
                      </span>
                      <span>
                        {article.author.name} • {format(new Date(article.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0 flex items-center space-x-2">
                  <Link
                    href={`/articles/${article.id}`}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Edit2 className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
