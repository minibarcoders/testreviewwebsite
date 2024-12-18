import { prisma } from 'app/lib/prisma';
import { Category } from '@prisma/client';
import { Metadata } from 'next';
import HomePage from './components/HomePage';

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
  slug: string;
  createdAt: Date;
  rating: Rating | null;
  author: {
    name: string;
  };
}

export const metadata: Metadata = {
  title: 'Fixed or Custom - Tech Reviews & Guides',
  description: 'Expert tech reviews and in-depth guides to help you make informed decisions about your tech purchases.',
};

// Use ISR instead of force-dynamic to enable caching
export const revalidate = 3600; // Revalidate every hour

export default async function Page() {
  try {
    const [latestReviews, latestPosts] = await Promise.all([
      prisma.article.findMany({
        where: {
          category: Category.REVIEW,
          published: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 3,
        include: {
          author: true
        }
      }),
      prisma.article.findMany({
        where: {
          category: Category.BLOG,
          published: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 3,
        include: {
          author: true
        }
      })
    ]) as [Article[], Article[]];

    return <HomePage latestReviews={latestReviews} latestPosts={latestPosts} />;
  } catch (error) {
    // Return empty arrays if database is not available
    // This prevents build failures while still allowing the page to render
    console.error('Error fetching articles:', error);
    return <HomePage latestReviews={[]} latestPosts={[]} />;
  }
}
