import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';
import ReviewContent from './ReviewContent';

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await prisma.article.findFirst({
    where: {
      slug: params.slug,
      category: Category.REVIEW,
      published: true
    }
  });

  if (!article) {
    return {
      title: 'Review Not Found',
    };
  }

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [article.imageUrl],
      type: 'article',
    },
  };
}

export default async function ReviewPage({ params }: PageProps) {
  const { slug } = params;
  
  const article = await prisma.article.findFirst({
    where: {
      slug,
      category: Category.REVIEW,
      published: true
    },
    include: {
      author: true
    }
  });

  if (!article) {
    notFound();
  }

  return <ReviewContent article={article} />;
} 