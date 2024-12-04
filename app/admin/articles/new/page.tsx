'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@prisma/client';
import { useAnalytics } from '@/hooks/useAnalytics';

type FormData = {
  title: string;
  content: string;
  summary: string;
  imageUrl: string;
  category: Category;
  authorId: string;
  published: boolean;
  rating?: {
    overall: number;
    design: number;
    features: number;
    performance: number;
    value: number;
  };
  pros: string[];
  cons: string[];
};

const initialFormData: FormData = {
  title: '',
  content: '',
  summary: '',
  imageUrl: '',
  category: Category.BLOG,
  authorId: '', // This should be set from the authenticated user
  published: false,
  pros: [''],
  cons: ['']
};

export default function NewArticlePage() {
  const router = useRouter();
  const { trackEvent } = useAnalytics();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    try {
      // Track form submission attempt
      trackEvent('article_create_attempt', {
        category: formData.category,
        content_length: formData.content.length,
        has_rating: !!formData.rating
      });

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add proper authorization header here
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create article');
      }

      const data = await response.json();
      setStatus('success');
      
      // Track successful creation
      trackEvent('article_create_success', {
        article_id: data.article.id,
        category: formData.category
      });

      // Redirect to the new article
      router.push(`/${formData.category.toLowerCase()}/${data.article.slug}`);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to create article');
      
      // Track error
      trackEvent('article_create_error', {
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  };

  const handleArrayFieldChange = (
    field: 'pros' | 'cons',
    index: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: 'pros' | 'cons') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: 'pros' | 'cons', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <main className="min-h-screen pt-32 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Create New Article</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm 
                           focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-slate-700">
                  Summary
                </label>
                <textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm 
                           focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700">
                  Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm 
                           focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                  className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm 
                           focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {Object.values(Category).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Content */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Content</h2>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={15}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm 
                       focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </section>

          {/* Review Specific Fields */}
          {formData.category === Category.REVIEW && (
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Review Details</h2>
              
              {/* Rating */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {['overall', 'design', 'features', 'performance', 'value'].map((aspect) => (
                  <div key={aspect}>
                    <label htmlFor={aspect} className="block text-sm font-medium text-slate-700 capitalize">
                      {aspect} Rating
                    </label>
                    <input
                      type="number"
                      id={aspect}
                      min="0"
                      max="10"
                      step="0.1"
                      value={formData.rating?.[aspect as keyof typeof formData.rating] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        rating: {
                          ...formData.rating,
                          [aspect]: parseFloat(e.target.value)
                        }
                      })}
                      className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm 
                               focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>

              {/* Pros */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Pros</label>
                {formData.pros.map((pro, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={pro}
                      onChange={(e) => handleArrayFieldChange('pros', index, e.target.value)}
                      className="flex-1 rounded-lg border-slate-300 shadow-sm 
                               focus:border-indigo-500 focus:ring-indigo-500"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Cons</label>
                {formData.cons.map((con, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={con}
                      onChange={(e) => handleArrayFieldChange('cons', index, e.target.value)}
                      className="flex-1 rounded-lg border-slate-300 shadow-sm 
                               focus:border-indigo-500 focus:ring-indigo-500"
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
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 
                         focus:ring-indigo-500"
              />
              <label htmlFor="published" className="ml-2 text-sm text-slate-700">
                Publish immediately
              </label>
            </div>
          </section>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-600">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium 
                       hover:bg-indigo-500 transition-colors duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Creating...' : 'Create Article'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
} 