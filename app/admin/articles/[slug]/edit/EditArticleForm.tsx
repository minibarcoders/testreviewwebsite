'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Editor from '../../../../components/Editor';
import ImageGallery from '../../../../components/ImageGallery';
import { Image } from 'lucide-react';

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
  rating?: Rating;
  pros?: string[];
  cons?: string[];
}

export default function EditArticleForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState<Rating>({
    overall: 0,
    design: 0,
    features: 0,
    performance: 0,
    value: 0
  });
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await fetch(`/api/articles/${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }
        const data = await response.json();
        setArticle(data);
        
        // Initialize form state
        setTitle(data.title);
        setContent(data.content);
        setSummary(data.summary);
        setImageUrl(data.imageUrl);
        if (data.rating) setRating(data.rating);
        if (data.pros) setPros(data.pros);
        if (data.cons) setCons(data.cons);
      } catch (err) {
        setError('Failed to load article');
        if (err instanceof Error) {
          console.error('Error fetching article:', err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/articles/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          summary,
          imageUrl,
          rating,
          pros,
          cons,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update article');
      }

      router.push('/admin/articles');
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to save changes: ${err.message}`);
        console.error('Error updating article:', err.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleProChange = (index: number, value: string) => {
    const newPros = [...pros];
    newPros[index] = value;
    setPros(newPros);
  };

  const handleConChange = (index: number, value: string) => {
    const newCons = [...cons];
    newCons[index] = value;
    setCons(newCons);
  };

  const addPro = () => setPros([...pros, '']);
  const removePro = (index: number) => setPros(pros.filter((_, i) => i !== index));
  const addCon = () => setCons([...cons, '']);
  const removeCon = (index: number) => setCons(cons.filter((_, i) => i !== index));

  const handleImageSelect = (url: string) => {
    setImageUrl(url);
    setShowImageGallery(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Summary */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
              Summary
            </label>
            <textarea
              id="summary"
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Image URL with Gallery */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              Featured Image
            </label>
            <div className="mt-1 flex items-center gap-4">
              {imageUrl && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                  <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowImageGallery(!showImageGallery)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Image className="h-5 w-5 mr-2 text-gray-400" />
                {imageUrl ? 'Change Image' : 'Select Image'}
              </button>
            </div>
            {showImageGallery && (
              <div className="mt-4">
                <ImageGallery onSelect={handleImageSelect} />
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <div className="mt-1">
              <Editor
                value={content}
                onChange={(value: string) => setContent(value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Ratings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Ratings</h3>
            {Object.entries(rating).map(([key, value]) => (
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
                  value={value}
                  onChange={(e) => setRating({ ...rating, [key]: parseFloat(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>

          {/* Pros */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Pros</h3>
              <button
                type="button"
                onClick={addPro}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Pro
              </button>
            </div>
            {pros.map((pro, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={pro}
                  onChange={(e) => handleProChange(index, e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter a pro"
                />
                <button
                  type="button"
                  onClick={() => removePro(index)}
                  className="inline-flex items-center p-1.5 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Cons */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Cons</h3>
              <button
                type="button"
                onClick={addCon}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Con
              </button>
            </div>
            {cons.map((con, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={con}
                  onChange={(e) => handleConChange(index, e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter a con"
                />
                <button
                  type="button"
                  onClick={() => removeCon(index)}
                  className="inline-flex items-center p-1.5 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 