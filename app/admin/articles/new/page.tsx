'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@prisma/client';
import { useAnalytics } from 'app/hooks/useAnalytics';
import { useSession } from 'next-auth/react';
import ImageGallery from '@/components/ImageGallery';
import { Image } from 'lucide-react';

type FormData = {
  title: string;
  content: string;
  summary: string;
  imageUrl?: string;
  category: Category;
  published: boolean;
  rating?: {
    overall?: number;
    design?: number;
    features?: number;
    performance?: number;
    value?: number;
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
  published: false,
  pros: [''],
  cons: ['']
};

function NewArticleContent() {
  const router = useRouter();
  const { trackEvent } = useAnalytics();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');
  const [showImageGallery, setShowImageGallery] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (session?.user?.role !== 'ADMIN') {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('submitting');
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
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create article');
      }

      const data = await response.json();
      setSubmitStatus('success');
      
      // Track successful creation
      trackEvent('article_create_success', {
        article_id: data.article.id,
        category: formData.category
      });

      // Redirect to the new article
      router.push(`/${formData.category.toLowerCase()}/${data.article.slug}`);
    } catch (err) {
      setSubmitStatus('error');
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

  const handleImageSelect = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
    setShowImageGallery(false);
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
                <label className="block text-sm font-medium text-slate-700">
                  Featured Image
                </label>
                <div className="mt-1 flex items-center gap-4">
                  {formData.imageUrl && (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                      <img
                        src={formData.imageUrl}
                        alt="Article featured image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowImageGallery(!showImageGallery)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Image className="h-5 w-5 mr-2 text-gray-400" aria-hidden="true" />
                    {formData.imageUrl ? 'Change Image' : 'Select Image'}
                  </button>
                </div>
                {showImageGallery && (
                  <div className="mt-4">
                    <ImageGallery onSelect={handleImageSelect} />
                  </div>
                )}
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
                      value={formData.rating?.[aspect as keyof typeof formData.rating] || 0}
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
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-slate-900">Pros</h3>
                  <button
                    type="button"
                    onClick={() => addArrayField('pros')}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Add Pro
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.pros.map((pro, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={pro}
                        onChange={(e) => handleArrayFieldChange('pros', index, e.target.value)}
                        className="block w-full rounded-lg border-slate-300 shadow-sm 
                                 focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Enter a pro"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField('pros', index)}
                        className="text-red-600 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cons */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-slate-900">Cons</h3>
                  <button
                    type="button"
                    onClick={() => addArrayField('cons')}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Add Con
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.cons.map((con, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={con}
                        onChange={(e) => handleArrayFieldChange('cons', index, e.target.value)}
                        className="block w-full rounded-lg border-slate-300 shadow-sm 
                                 focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Enter a con"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField('cons', index)}
                        className="text-red-600 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
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
              disabled={submitStatus === 'submitting'}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium 
                       hover:bg-indigo-500 transition-colors duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitStatus === 'submitting' ? 'Creating...' : 'Create Article'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function NewArticlePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewArticleContent />
    </Suspense>
  );
}
