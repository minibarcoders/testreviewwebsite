import { prisma } from 'app/lib/prisma'
import { Category } from '@prisma/client'
import { notFound } from 'next/navigation'
import BlogPostContent from './BlogPostContent'

interface Props {
  params: Promise<{
    slug: string
  }>
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { slug } = await params;

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
