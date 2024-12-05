import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Category } from '@prisma/client'
import { headers } from 'next/headers'

type PageProps = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Ensure params are resolved
  const headersList = headers()
  
  const article = await prisma.article.findFirst({
    where: {
      slug: params.slug,
      category: Category.BLOG,
      published: true
    }
  })

  if (!article) {
    return {
      title: 'Blog Post Not Found'
    }
  }

  const metadata: Metadata = {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [article.imageUrl],
      type: 'article'
    }
  }

  return metadata
}

export default async function BlogPost({ params }: PageProps) {
  const headersList = headers()
  const { slug } = params
  
  const article = await prisma.article.findFirst({
    where: {
      slug,
      category: Category.BLOG,
      published: true
    },
    include: {
      author: true
    }
  })

  if (!article) {
    notFound()
  }

  return <BlogPostContent article={article} />
}