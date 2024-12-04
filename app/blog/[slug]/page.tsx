import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';
import BlogPostContent from './BlogPostContent';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await prisma.article.findFirst({
    where: {
      slug: params.slug,
      category: Category.BLOG,
      published: true
    }
  });

  if (!article) {
    return {
      title: 'Blog Post Not Found',
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

export default async function BlogPost({ params, searchParams }: Props) {
  const { slug } = params;
  
  const article = await prisma.article.findFirst({
    where: {
      slug,
      category: Category.BLOG,
      published: true
    },
    include: {
      author: true
    }
  });

  if (!article) {
    notFound();
  }

  return <BlogPostContent article={article} />;
}