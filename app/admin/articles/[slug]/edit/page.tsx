'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Category } from '@prisma/client';
import EditArticleForm from './EditArticleForm';

interface Article {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  summary: string;
  imageUrl: string;
  category: Category;
  published: boolean;
  rating?: {
    overall: number;
    design: number;
    features: number;
    performance: number;
    value: number;
  };
  pros?: string[];
  cons?: string[];
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default function EditArticlePage({ params }: Props) {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/login');
    },
  });
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);

  // First effect to handle the async params
  useEffect(() => {
    if (!params) return;
    
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setSlug(resolvedParams.slug);
      } catch (err) {
        console.error('Error resolving params:', err);
        setError('Failed to load page parameters');
        setLoading(false);
      }
    };
    resolveParams();
  }, [params]);

  // Second effect to handle authentication and data fetching
  useEffect(() => {
    if (!slug || !session?.user?.role) return;

    const fetchArticle = async () => {
      const startTime = Date.now();
      try {
        console.log('Starting article fetch:', {
          slug,
          session: {
            status,
            role: session?.user?.role,
            email: session?.user?.email
          }
        });

        const response = await fetch(`/api/articles/${slug}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        console.log('Fetch response received:', {
          status: response.status,
          time: `${Date.now() - startTime}ms`
        });

        if (!response.ok) {
          const data = await response.json();
          console.error('Error response:', data);
          throw new Error(data.error || `Failed to fetch article: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response parsed:', {
          hasArticle: !!data.article,
          time: `${Date.now() - startTime}ms`
        });

        if (!data.article) {
          throw new Error('Article not found in response');
        }
        
        // Ensure category is properly typed
        const articleData = {
          ...data.article,
          category: data.article.category as Category,
          pros: data.article.pros || [],
          cons: data.article.cons || [],
        };
        
        setArticle(articleData);
        setError(null);
      } catch (err) {
        console.error('Error details:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch article';
        setError(errorMessage);
      } finally {
        setLoading(false);
        console.log('Fetch complete:', {
          time: `${Date.now() - startTime}ms`,
          hasArticle: !!article
        });
      }
    };

    fetchArticle();
  }, [slug, session, status]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user?.role || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">You must be logged in as an admin to view this page</p>
            <pre className="mt-2 text-sm text-red-600 whitespace-pre-wrap">
              Session status: {status}
              {session?.user?.role && `\nUser role: ${session.user.role}`}
              {session?.user?.email && `\nUser email: ${session.user.email}`}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (error && !article) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <pre className="mt-2 text-sm text-red-600 whitespace-pre-wrap">
              Session status: {status}
              {session?.user?.role && `\nUser role: ${session.user.role}`}
              {session?.user?.email && `\nUser email: ${session.user.email}`}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (!article || !slug) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">Article not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-8">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800">
              Warning: {error}
              <br />
              <span className="text-sm">Your changes may not be saved properly.</span>
            </p>
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Article</h1>
        <EditArticleForm slug={slug} initialData={article} />
      </div>
    </div>
  );
}
