import { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ArticleList from '@/components/admin/ArticleList';

export const metadata: Metadata = {
  title: 'Articles - Admin Dashboard',
  description: 'Manage your tech review articles',
};

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: true,
    },
  });

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all articles in your tech review site
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <ArticleList articles={articles} />
      </div>
    </div>
  );
}
