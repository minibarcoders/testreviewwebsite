import { notFound } from 'next/navigation';
import { Category } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import ReviewContent from './ReviewContent';

interface Props {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

interface Rating {
  overall: number;
  design: number;
  features: number;
  performance: number;
  value: number;
}

interface Author {
  id: string;
  name: string;
  email: string;
}

interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  imageUrl: string;
  createdAt: Date;
  author: Author;
  rating?: Rating;
  pros?: string[];
  cons?: string[];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = params;
  
  const article = await prisma.article.findFirst({
    where: {
      slug,
      category: Category.REVIEW,
      published: true
    }
  });

  if (!article) {
    return {
      title: 'Review Not Found',
      description: 'The requested review could not be found.'
    };
  }

  return {
    title: article.title,
    description: article.summary
  };
}

// Remove generateStaticParams and make the page dynamic
export const dynamic = 'force-dynamic';

export default async function ReviewPage({ params }: Props) {
  const { slug } = params;

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

  // Parse the rating JSON if it exists
  const rating = dbArticle.rating 
    ? (typeof dbArticle.rating === 'object' 
        ? dbArticle.rating as unknown as Rating 
        : JSON.parse(dbArticle.rating as string) as Rating)
    : undefined;

  // Transform the database article to match the expected Article interface
  const article: Article = {
    id: dbArticle.id,
    title: dbArticle.title,
    content: dbArticle.content,
    summary: dbArticle.summary,
    imageUrl: dbArticle.imageUrl,
    createdAt: dbArticle.createdAt,
    author: dbArticle.author,
    rating,
    pros: dbArticle.pros,
    cons: dbArticle.cons
  };

  return <ReviewContent article={article} />;
}
