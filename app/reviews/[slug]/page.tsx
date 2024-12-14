import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';
import { notFound } from 'next/navigation';
import ReviewContent from './ReviewContent';

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
  createdAt: Date;
  rating?: Rating;
  author: {
    id: string;
    name: string;
    email: string;
  };
  pros?: string[];
  cons?: string[];
}

function isRating(value: any): value is Rating {
  return (
    value &&
    typeof value === 'object' &&
    'overall' in value &&
    'design' in value &&
    'features' in value &&
    'performance' in value &&
    'value' in value
  );
}

export default async function ReviewPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    notFound();
  }

  const dbArticle = await prisma.article.findFirst({
    where: {
      slug,
      category: Category.REVIEW,
      published: true
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  if (!dbArticle) {
    notFound();
  }

  // Convert the database article to the expected Article type
  const article: Article = {
    id: dbArticle.id,
    title: dbArticle.title,
    content: dbArticle.content,
    summary: dbArticle.summary,
    imageUrl: dbArticle.imageUrl,
    createdAt: dbArticle.createdAt,
    author: dbArticle.author,
    rating: isRating(dbArticle.rating) ? dbArticle.rating : undefined,
    pros: Array.isArray(dbArticle.pros) ? dbArticle.pros : undefined,
    cons: Array.isArray(dbArticle.cons) ? dbArticle.cons : undefined
  };

  return <ReviewContent article={article} />;
}
