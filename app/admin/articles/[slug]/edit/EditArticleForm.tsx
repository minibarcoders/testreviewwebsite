'use client';

import { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useRouter } from 'next/navigation';
import { Category } from '@prisma/client';
import { validateArticle, type ArticleInput } from 'app/lib/validation';
import OptimizedImage from 'app/components/ui/OptimizedImage';
import { sanitizeHtml } from 'app/lib/validation';
import { useAnalytics } from 'app/hooks/useAnalytics';

interface Rating {
  overall: number;
  design: number;
  features: number;
  performance: number;
  value: number;
}

interface FormData {
  title: string;
  subtitle?: string | null;
  content: string;
  summary: string;
  imageUrl: string;
  category: Category;
  published: boolean;
  rating?: Rating;
  pros?: string[];
  cons?: string[];
}

interface EditArticleFormProps {
  slug: string;
  initialData?: FormData & { id: string };
}

const defaultRating: Rating = {
  overall: 0,
  design: 0,
  features: 0,
  performance: 0,
  value: 0,
};

export default function EditArticleForm({ slug, initialData }: EditArticleFormProps) {
  const router = useRouter();
  const { trackEvent } = useAnalytics();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isFormReady, setIsFormReady] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    subtitle: '',
    content: '',
    summary: '',
    imageUrl: '',
    category: Category.BLOG,
    published: false,
    rating: defaultRating,
    pros: [],
    cons: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setImagePreview(initialData.imageUrl);
      setIsFormReady(true);
    }
  }, [initialData]);

  const handleImageUpload = async (file: File) => {
    try {
      trackEvent('image_upload_attempt', {
        file_size: file.size,
        file_type: file.type
      });

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, imageUrl: data.url }));
      setImagePreview(data.url);

      trackEvent('image_upload_success', {
        url: data.url
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMessage);
      trackEvent('image_upload_error', {
        error: errorMessage
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormReady) {
      setError('Form is not ready yet. Please wait for the data to load.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      trackEvent('article_edit_attempt', {
        article_id: initialData?.id,
        category: formData.category
      });

      // Sanitize HTML content
      const sanitizedContent = sanitizeHtml(formData.content);

      // Prepare data for validation
      const dataToValidate = {
        ...formData,
        content: sanitizedContent,
        // Ensure published is a boolean
        published: Boolean(formData.published),
        // Ensure imageUrl is a string
        imageUrl: formData.imageUrl || '',
        // Ensure arrays are initialized
        pros: formData.pros || [],
        cons: formData.cons || [],
        // Ensure rating is properly structured
        rating: formData.rating || defaultRating
      };

      console.log('Data to validate:', dataToValidate);

      // Validate form data
      const validatedData = validateArticle(dataToValidate);

      console.log('Validated data:', validatedData);

      const response = await fetch(`/api/articles/${slug}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': (window as any).__CSRF_TOKEN__,
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update article');
      }

      const data = await response.json();

      trackEvent('article_edit_success', {
        article_id: data.article.id,
        category: formData.category
      });

      if (formData.published !== initialData?.published) {
        trackEvent(formData.published ? 'article_publish' : 'article_unpublish', {
          article_id: data.article.id
        });
      }

      router.push('/admin/articles');
      router.refresh();
    } catch (err) {
      console.error('Submit error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      trackEvent('article_edit_error', {
        article_id: initialData?.id,
        error: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProsConsChange = (
    type: 'pros' | 'cons',
    index: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type]?.map((item, i) => (i === index ? value : item)) || [],
    }));
  };

  const addProCon = (type: 'pros' | 'cons') => {
    setFormData(prev => ({
      ...prev,
      [type]: [...(prev[type] || []), ''],
    }));
  };

  const removeProCon = (type: 'pros' | 'cons', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type]?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleRatingChange = (field: keyof Rating, value: number) => {
    setFormData(prev => ({
      ...prev,
      rating: {
        ...(prev.rating || defaultRating),
        [field]: value
      }
    }));
  };

  if (!isFormReady) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
            Subtitle (Optional)
          </label>
          <input
            type="text"
            id="subtitle"
            value={formData.subtitle || ''}
            onChange={e => setFormData(prev => ({ ...prev, subtitle: e.target.value || null }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as Category }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {Object.values(Category).map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
            Summary
          </label>
          <textarea
            id="summary"
            value={formData.summary}
            onChange={e => setFormData(prev => ({ ...prev, summary: e.target.value }))}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Featured Image</label>
          <div className="mt-1 flex items-center gap-4">
            {imagePreview && (
              <div className="relative w-32 h-32">
                <OptimizedImage
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
        </div>

        {/* Rich Text Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            value={formData.content}
            onEditorChange={(content) => setFormData(prev => ({ ...prev, content }))}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
              content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 16px; line-height: 1.6; }',
            }}
          />
        </div>

        {/* Review Specific Fields */}
        {formData.category === Category.REVIEW && (
          <div className="space-y-6">
            {/* Ratings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Ratings</h3>
              {Object.keys(defaultRating).map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                    {field}
                  </label>
                  <input
                    type="number"
                    id={field}
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.rating?.[field as keyof Rating] || 0}
                    onChange={e => handleRatingChange(field as keyof Rating, parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>

            {/* Pros */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Pros</h3>
                <button
                  type="button"
                  onClick={() => addProCon('pros')}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Add Pro
                </button>
              </div>
              <div className="space-y-2">
                {formData.pros?.map((pro, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={pro}
                      onChange={e => handleProsConsChange('pros', index, e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeProCon('pros', index)}
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
                <h3 className="text-lg font-medium text-gray-900">Cons</h3>
                <button
                  type="button"
                  onClick={() => addProCon('cons')}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Add Con
                </button>
              </div>
              <div className="space-y-2">
                {formData.cons?.map((con, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={con}
                      onChange={e => handleProsConsChange('cons', index, e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeProCon('cons', index)}
                      className="text-red-600 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Publishing Options */}
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={e => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">Publish article</span>
          </label>
          {formData.published && (
            <p className="text-sm text-amber-600">
              Note: Publishing requires complete content with minimum lengths
            </p>
          )}
        </div>
      </div>

      {/* Form Actions */}
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
          disabled={loading || !isFormReady}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
