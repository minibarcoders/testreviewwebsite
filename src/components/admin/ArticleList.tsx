'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Category } from '@prisma/client';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

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
  published: boolean;
  category: Category;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

interface ArticleListProps {
  articles: Article[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  const router = useRouter();
  const { trackEvent } = useAnalytics();
  const [loading, setLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<{
    category: Category | 'ALL';
    status: 'ALL' | 'PUBLISHED' | 'DRAFT';
    search: string;
  }>({
    category: 'ALL',
    status: 'ALL',
    search: ''
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    setLoading(id);
    try {
      // Track delete attempt
      trackEvent('article_delete_attempt', { article_id: id });

      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete article');
      }

      // Track successful deletion
      trackEvent('article_delete_success', { article_id: id });

      router.refresh();
    } catch (err) {
      console.error('Error deleting article:', err);
      alert('Failed to delete article');

      // Track error
      trackEvent('article_delete_error', {
        article_id: id,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    } finally {
      setLoading(null);
    }
  };

  const handlePreview = (article: Article) => {
    // Track preview
    trackEvent('article_preview', {
      article_id: article.id,
      category: article.category
    });

    // Open in new tab
    window.open(`/${article.category.toLowerCase()}/${article.slug}`, '_blank');
  };

  const filteredArticles = articles.filter(article => {
    if (filter.category !== 'ALL' && article.category !== filter.category) {
      return false;
    }

    if (filter.status !== 'ALL') {
      if (filter.status === 'PUBLISHED' && !article.published) return false;
      if (filter.status === 'DRAFT' && article.published) return false;
    }

    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      return (
        article.title.toLowerCase().includes(searchLower) ||
        article.summary.toLowerCase().includes(searchLower) ||
        article.author.name.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

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
    <div>
      {/* Filters */}
      <div className="bg-white p-4 mb-4 rounded-lg shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category-filter"
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value as Category | 'ALL' }))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="ALL">All Categories</option>
              {Object.values(Category).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status-filter"
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value as 'ALL' | 'PUBLISHED' | 'DRAFT' }))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search articles..."
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Articles List */}
      <ul className="divide-y divide-gray-200">
        {filteredArticles.map((article) => (
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
                      article.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {article.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="px-2 py-1 text-sm bg-purple-100 text-purple-800 rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-gray-600 line-clamp-2">{article.summary}</p>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => handlePreview(article)}
                  className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </button>
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
                  className="inline-flex items-center px-3 py-1 text-sm text-rose-600 hover:text-rose-900 focus:outline-none disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* No Results */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No articles found matching your filters.
          </p>
        </div>
      )}
    </div>
  );
}
