import { prisma } from 'app/lib/prisma'
import { Category } from '@prisma/client'
import { notFound } from 'next/navigation'
import BlogPostContent from './BlogPostContent'
import { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Add revalidation to enable ISR
export const revalidate = 3600; // Revalidate every hour

// Generate static params for all published blog posts
export async function generateStaticParams() {
  try {
    const posts = await prisma.article.findMany({
      where: {
        category: Category.BLOG,
        published: true
      },
      select: {
        slug: true
      }
    });

    return posts.map((post) => ({
      slug: post.slug
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return empty array to make the page dynamic
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    
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
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog',
      description: 'Loading blog post...'
    };
  }
}

export default async function BlogPage({ params }: Props) {
  try {
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
  } catch (error) {
    console.error('Error loading blog post:', error);
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">Unable to load blog post. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }
}
