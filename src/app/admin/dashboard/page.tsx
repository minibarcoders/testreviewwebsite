import { Metadata } from 'next';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Fixed or Custom',
  description: 'Admin dashboard for Fixed or Custom tech review site',
};

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  const [articlesCount, draftsCount] = await Promise.all([
    prisma.article.count({
      where: { status: 'PUBLISHED' },
    }),
    prisma.article.count({
      where: { status: 'DRAFT' },
    }),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Welcome back, {user?.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Published Articles</h2>
          <p className="text-4xl font-bold text-indigo-600">{articlesCount}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Draft Articles</h2>
          <p className="text-4xl font-bold text-amber-600">{draftsCount}</p>
        </div>
      </div>
    </div>
  );
}
