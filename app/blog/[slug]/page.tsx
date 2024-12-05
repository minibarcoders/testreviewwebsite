import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';
import BlogPostContent from './BlogPostContent';

interface GenerateMetadataProps {
  params: { slug: string }
}

export async function generateMetadata(
  props: GenerateMetadataProps
): Promise<Metadata> {
  const article = await prisma.article.findFirst({
    where: {
      slug: props.params.slug,
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

interface BlogPostPageProps {
  params: { slug: string }
}

export default async function BlogPost(props: BlogPostPageProps) {
  const { slug } = props.params;
  
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