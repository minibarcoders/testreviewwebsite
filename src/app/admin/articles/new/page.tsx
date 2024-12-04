'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const TinyMCEEditor = dynamic(() => import('@/components/admin/TinyMCEEditor'), {
  ssr: false,
  loading: () => <div className="h-96 w-full bg-gray-100 animate-pulse rounded-md" />,
});

interface ApiError {
  error: string;
}

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    summary: '',
    content: '',
    imageUrl: '',
    category: 'REVIEW', // Default category
    published: false,
    // Review-specific fields
    rating: {
      overall: 0,
      performance: 0,
      features: 0,
      value: 0,
      design: 0,
    },
    pros: [''],
    cons: [''],
    prices: [{ store: '', price: '', link: '' }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare the data based on category
    const submitData = {
      ...formData,
      // Only include review-specific fields if category is REVIEW
      ...(formData.category === 'REVIEW' ? {
        rating: formData.rating,
        pros: formData.pros.filter(Boolean),
        cons: formData.cons.filter(Boolean),
        prices: formData.prices.filter(p => p.store && p.price),
      } : {
        rating: null,
        pros: [],
        cons: [],
        prices: [],
      }),
    };

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiError).error || 'Failed to create article');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create article';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handlePublishedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, published: e.target.checked }));
  };

  // Helper functions for managing arrays
  const handleArrayChange = (index: number, value: string, field: 'pros' | 'cons') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => 
        i === index ? value : item
      ),
    }));
  };

  const addArrayItem = (field: 'pros' | 'cons') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (index: number, field: 'pros' | 'cons') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_: string, i: number) => i !== index),
    }));
  };

  // Helper functions for managing prices
  const handlePriceChange = (index: number, field: keyof typeof formData.prices[0], value: string) => {
    setFormData(prev => ({
      ...prev,
      prices: prev.prices.map((price, i) => 
        i === index ? { ...price, [field]: value } : price
      ),
    }));
  };

  const addPrice = () => {
    setFormData(prev => ({
      ...prev,
      prices: [...prev.prices, { store: '', price: '', link: '' }],
    }));
  };

  const removePrice = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prices: prev.prices.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Create New Article</h1>
      
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
            Subtitle (Optional)
          </label>
          <input
            type="text"
            name="subtitle"
            id="subtitle"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white"
            value={formData.subtitle}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="REVIEW">Review</option>
            <option value="BLOG">Blog Post</option>
            <option value="NEWS">News</option>
            <option value="GUIDE">Guide</option>
          </select>
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
            Summary
          </label>
          <textarea
            name="summary"
            id="summary"
            rows={3}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white"
            value={formData.summary}
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div>

        {/* Review-specific fields */}
        {formData.category === 'REVIEW' && (
          <>
            {/* Rating Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Rating</h3>
              {Object.keys(formData.rating).map((key) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">
                    {key}
                  </label>
                  <input
                    type="number"
                    id={key}
                    min="0"
                    max="10"
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white"
                    value={formData.rating[key as keyof typeof formData.rating]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      rating: {
                        ...prev.rating,
                        [key]: parseFloat(e.target.value),
                      },
                    }))}
                  />
                </div>
              ))}
            </div>

            {/* Pros Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Pros</h3>
                <button
                  type="button"
                  onClick={() => addArrayItem('pros')}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Add Pro
                </button>
              </div>
              {formData.pros.map((pro, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={pro}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'pros')}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white"
                    placeholder="Enter a pro"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'pros')}
                    className="text-red-600 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Cons Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Cons</h3>
                <button
                  type="button"
                  onClick={() => addArrayItem('cons')}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Add Con
                </button>
              </div>
              {formData.cons.map((con, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={con}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'cons')}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white"
                    placeholder="Enter a con"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'cons')}
                    className="text-red-600 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Prices Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Prices</h3>
                <button
                  type="button"
                  onClick={addPrice}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Add Price
                </button>
              </div>
              {formData.prices.map((price, index) => (
                <div key={index} className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={price.store}
                    onChange={(e) => handlePriceChange(index, 'store', e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white"
                    placeholder="Store name"
                  />
                  <input
                    type="text"
                    value={price.price}
                    onChange={(e) => handlePriceChange(index, 'price', e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white"
                    placeholder="Price"
                  />
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={price.link}
                      onChange={(e) => handlePriceChange(index, 'link', e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white"
                      placeholder="Store URL"
                    />
                    <button
                      type="button"
                      onClick={() => removePrice(index)}
                      className="text-red-600 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <div className="mt-1">
            <TinyMCEEditor
              value={formData.content}
              onEditorChange={handleEditorChange}
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handlePublishedChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded text-gray-900 bg-white"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
            Publish immediately
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Creating...
              </>
            ) : (
              'Create Article'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
