'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ReviewFields {
  rating: number;
  pros: string[];
  cons: string[];
  verdict: string;
  specifications: { [key: string]: string };
}

interface BlogFields {
  excerpt: string;
  readingTime: string;
  tags: string[];
}

// Simple auth - in production, use proper auth system
const API_KEY = 'your-secret-key';

export default function NewArticlePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [article, setArticle] = useState({
    title: '',
    content: '',
    category: 'review',
    imageUrl: '',
    snippet: '',
    author: 'Sander',
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
  });

  const [reviewFields, setReviewFields] = useState<ReviewFields>({
    rating: 4.0,
    pros: [''],
    cons: [''],
    verdict: '',
    specifications: {}
  });

  const [blogFields, setBlogFields] = useState<BlogFields>({
    excerpt: '',
    readingTime: '',
    tags: ['']
  });

  const [newSpec, setNewSpec] = useState({ key: '', value: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Create the article data
      const data = {
        ...article,
        ...(article.category === 'review' 
          ? {
              ...reviewFields,
              rating: reviewFields.rating,
              pros: reviewFields.pros.filter(pro => pro.trim() !== ''),
              cons: reviewFields.cons.filter(con => con.trim() !== ''),
              verdict: reviewFields.verdict,
              specifications: reviewFields.specifications,
              snippet: article.snippet
            }
          : {
              ...blogFields,
              excerpt: blogFields.excerpt,
              readingTime: blogFields.readingTime,
              tags: blogFields.tags.filter(tag => tag.trim() !== '')
            }
        ),
        content: `<div class="prose lg:prose-lg mx-auto">${article.content}</div>`
      };

      // Send to API
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save article');
      }

      // Show success message
      alert('Article saved successfully!');
      
      // Redirect to the new article
      router.push(`/${article.category === 'review' ? 'reviews' : 'blog'}/${result.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article');
      console.error('Error saving article:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addListItem = (field: 'pros' | 'cons' | 'tags') => {
    if (field === 'tags') {
      setBlogFields(prev => ({
        ...prev,
        tags: [...prev.tags, '']
      }));
    } else {
      setReviewFields(prev => ({
        ...prev,
        [field]: [...prev[field], '']
      }));
    }
  };

  const updateListItem = (field: 'pros' | 'cons' | 'tags', index: number, value: string) => {
    if (field === 'tags') {
      setBlogFields(prev => ({
        ...prev,
        tags: prev.tags.map((item, i) => i === index ? value : item)
      }));
    } else {
      setReviewFields(prev => ({
        ...prev,
        [field]: prev[field].map((item, i) => i === index ? value : item)
      }));
    }
  };

  const addSpecification = () => {
    if (newSpec.key && newSpec.value) {
      setReviewFields(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpec.key]: newSpec.value
        }
      }));
      setNewSpec({ key: '', value: '' });
    }
  };

  return (
    <main className="min-h-screen pt-32 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Write New Article</h1>
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={article.category}
              onChange={(e) => setArticle({ ...article, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="review">Review</option>
              <option value="blog">Blog Post</option>
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={article.title}
              onChange={(e) => setArticle({ ...article, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              value={article.imageUrl}
              onChange={(e) => setArticle({ ...article, imageUrl: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="snippet" className="block text-sm font-medium text-gray-700 mb-1">
              Snippet/Summary
            </label>
            <textarea
              id="snippet"
              rows={2}
              value={article.snippet}
              onChange={(e) => setArticle({ ...article, snippet: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          {article.category === 'review' ? (
            // Review-specific fields
            <>
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (0-5)
                </label>
                <input
                  type="number"
                  id="rating"
                  min="0"
                  max="5"
                  step="0.1"
                  value={reviewFields.rating}
                  onChange={(e) => setReviewFields({ ...reviewFields, rating: parseFloat(e.target.value) })}
                  className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pros
                </label>
                {reviewFields.pros.map((pro, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={pro}
                      onChange={(e) => updateListItem('pros', index, e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Add a pro"
                      required
                    />
                    {index === reviewFields.pros.length - 1 && (
                      <button
                        type="button"
                        onClick={() => addListItem('pros')}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cons
                </label>
                {reviewFields.cons.map((con, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={con}
                      onChange={(e) => updateListItem('cons', index, e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Add a con"
                      required
                    />
                    {index === reviewFields.cons.length - 1 && (
                      <button
                        type="button"
                        onClick={() => addListItem('cons')}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label htmlFor="verdict" className="block text-sm font-medium text-gray-700 mb-1">
                  Verdict
                </label>
                <textarea
                  id="verdict"
                  rows={3}
                  value={reviewFields.verdict}
                  onChange={(e) => setReviewFields({ ...reviewFields, verdict: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specifications
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSpec.key}
                    onChange={(e) => setNewSpec({ ...newSpec, key: e.target.value })}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Specification name"
                  />
                  <input
                    type="text"
                    value={newSpec.value}
                    onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Value"
                  />
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {Object.entries(reviewFields.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between bg-gray-50 p-2 rounded">
                      <span className="font-medium">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // Blog-specific fields
            <>
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  rows={3}
                  value={blogFields.excerpt}
                  onChange={(e) => setBlogFields({ ...blogFields, excerpt: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="readingTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Reading Time
                </label>
                <input
                  type="text"
                  id="readingTime"
                  value={blogFields.readingTime}
                  onChange={(e) => setBlogFields({ ...blogFields, readingTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g., 5 min read"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                {blogFields.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => updateListItem('tags', index, e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Add a tag"
                      required
                    />
                    {index === blogFields.tags.length - 1 && (
                      <button
                        type="button"
                        onClick={() => addListItem('tags')}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content (HTML)
            </label>
            <textarea
              id="content"
              rows={15}
              value={article.content}
              onChange={(e) => setArticle({ ...article, content: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
} 