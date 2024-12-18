import { prisma } from 'app/lib/prisma'
import { Category } from '@prisma/client'
import { notFound } from 'next/navigation'
import BlogPostContent from './BlogPostContent'
import { Metadata } from 'next'

interface Props {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  
  const article = await prisma.article.findFirst({
    where: {
      slug,
      category: Category.BLOG,
      published: true
    },
    select: {
      title: true,
      summary: true
    }
  });

  if (!article) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }

  return {
    title: article.title,
    description: article.summary
  };
}

export default async function BlogPage({ params }: Props) {
  const { slug } = params;

  if (!slug) {
    notFound()
  }

  const article = await prisma.article.findFirst({
    where: {
      slug,
      category: Category.BLOG,
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
  })

  if (!article) {
    notFound()
  }

  return <BlogPostContent article={article} />
}
