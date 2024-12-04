'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Category } from '@prisma/client';
import dynamic from 'next/dynamic';
import { use } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

const TinyMCEEditor = dynamic(() => import('@/components/admin/TinyMCEEditor'), {
  ssr: false,
  loading: () => <div className="h-96 w-full bg-gray-100 animate-pulse rounded-md" />,
});

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
  category: Category;
  published: boolean;
  rating?: Rating;
  pros?: string[];
  cons?: string[];
}

export default function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { trackEvent } = useAnalytics();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }

    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError('Failed to load article');
        console.error(err);
      }
    };

    fetchArticle();
  }, [resolvedParams.id, router, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article) return;

    setLoading(true);
    setError(null);

    try {
      // Track edit attempt
      trackEvent('article_edit_attempt', {
        article_id: article.id,
        category: article.category
      });

      const response = await fetch(`/api/articles/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update article');
      }

      // Track successful edit
      trackEvent('article_edit_success', {
        article_id: article.id,
        category: article.category
      });

      router.push('/admin/articles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update article');
      console.error(err);

      // Track error
      trackEvent('article_edit_error', {
        article_id: article.id,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setArticle((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleEditorChange = (content: string) => {
    setArticle((prev) => prev ? { ...prev, content } : null);
  };

  const handlePublishedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArticle((prev) => prev ? { ...prev, published: e.target.checked } : null);
  };

  const handleRatingChange = (aspect: keyof Rating, value: string) => {
    setArticle((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        rating: {
          ...prev.rating,
          [aspect]: parseFloat(value) || 0
        }
      };
    });
  };

  const handleArrayFieldChange = (
    field: 'pros' | 'cons',
    index: number,
    value: string
  ) => {
    setArticle((prev) => {
      if (!prev) return null;
      const array = prev[field] || [];
      return {
        ...prev,
        [field]: array.map((item, i) => i === index ? value : item)
      };
    });
  };

  const addArrayField = (field: 'pros' | 'cons') => {
    setArticle((prev) => {
      if (!prev) return null;
      const array = prev[field] || [];
      return {
        ...prev,
        [field]: [...array, '']
      };
    });
  };

  const removeArrayField = (field: 'pros' | 'cons', index: number) => {
    setArticle((prev) => {
      if (!prev) return null;
      const array = prev[field] || [];
      return {
        ...prev,
        [field]: array.filter((_, i) => i !== index)
      };
    });
  };

  if (status === 'loading' || !article) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Article</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <section className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">Basic Information</h2>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={article.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
              Summary
            </label>
            <textarea
              name="summary"
              id="summary"
              required
              rows={3}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={article.summary}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              id="imageUrl"
              required
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={article.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              id="category"
              required
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={article.category}
              onChange={handleChange}
            >
              {Object.values(Category).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Content */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Content</h2>
          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none">
            <TinyMCEEditor
              value={article.content}
              onEditorChange={handleEditorChange}
            />
          </div>
        </section>

        {/* Review Specific Fields */}
        {article.category === Category.REVIEW && (
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Review Details</h2>
            
            {/* Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {['overall', 'design', 'features', 'performance', 'value'].map((aspect) => (
                <div key={aspect}>
                  <label htmlFor={aspect} className="block text-sm font-medium text-gray-700 capitalize">
                    {aspect} Rating
                  </label>
                  <input
                    type="number"
                    id={aspect}
                    min="0"
                    max="10"
                    step="0.1"
                    value={article.rating?.[aspect as keyof Rating] || ''}
                    onChange={(e) => handleRatingChange(aspect as keyof Rating, e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>

            {/* Pros */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Pros</label>
              {(article.pros || []).map((pro, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={pro}
                    onChange={(e) => handleArrayFieldChange('pros', index, e.target.value)}
                    className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Add a pro"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField('pros', index)}
                    className="px-3 py-2 text-rose-600 hover:text-rose-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('pros')}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                + Add Pro
              </button>
            </div>

            {/* Cons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cons</label>
              {(article.cons || []).map((con, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={con}
                    onChange={(e) => handleArrayFieldChange('cons', index, e.target.value)}
                    className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Add a con"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField('cons', index)}
                    className="px-3 py-2 text-rose-600 hover:text-rose-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('cons')}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                + Add Con
              </button>
            </div>
          </section>
        )}

        {/* Publishing Options */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Publishing Options</h2>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="published"
              id="published"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={article.published}
              onChange={handlePublishedChange}
            />
            <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
              Publish article
            </label>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
