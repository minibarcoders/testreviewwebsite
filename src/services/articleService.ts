import { Category } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { blogPosts } from '@/data/blog-posts';
import { reviews } from '@/data/reviews';

export interface Author {
  name: string;
  image?: string;
}

export interface ArticleBase {
  id: string | number;
  slug: string;
  title: string;
  imageUrl: string;
  author: Author;
  createdAt: string;
  category: string;
  summary: string;
}

export interface ReviewArticle extends ArticleBase {
  snippet: string;
  rating: number;
  pros: string[];
  cons: string[];
  specifications?: {
    [key: string]: string | number;
  };
  verdict: string;
  content: string;
}

export interface BlogArticle extends ArticleBase {
  excerpt: string;
  content: string;
  tags: string[];
  readingTime?: string;
}

export class ArticleService {
  // Get latest reviews for homepage
  static async getLatestReviews(limit: number = 3): Promise<ReviewArticle[]> {
    try {
      // First try to get from database
      const dbReviews = await prisma.article.findMany({
        where: {
          category: Category.REVIEW,
          published: true,
        },
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: true,
        },
      });

      if (dbReviews.length > 0) {
        return dbReviews.map(review => ({
          id: review.id,
          slug: review.slug,
          title: review.title,
          summary: review.summary,
          snippet: review.summary,
          imageUrl: review.imageUrl,
          author: {
            name: review.author.name,
            image: review.author.image
          },
          createdAt: review.createdAt.toISOString(),
          category: review.category,
          rating: review.rating ? (review.rating as any).overall : 0,
          pros: review.pros,
          cons: review.cons,
          content: review.content,
          verdict: review.content, // Extract verdict from content if needed
          specifications: {} // Add if available in database
        }));
      }

      // Fallback to static data if no database results
      return Object.values(reviews)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Fallback to static data on error
      return Object.values(reviews)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
    }
  }

  // Get latest blog posts for homepage
  static async getLatestPosts(limit: number = 4): Promise<BlogArticle[]> {
    try {
      // First try to get from database
      const dbPosts = await prisma.article.findMany({
        where: {
          category: Category.BLOG,
          published: true,
        },
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: true,
        },
      });

      if (dbPosts.length > 0) {
        return dbPosts.map(post => ({
          id: post.id,
          slug: post.slug,
          title: post.title,
          summary: post.summary,
          excerpt: post.summary,
          imageUrl: post.imageUrl,
          author: {
            name: post.author.name,
            image: post.author.image
          },
          createdAt: post.createdAt.toISOString(),
          category: post.category,
          content: post.content,
          tags: [], // Add if available in database
          readingTime: '5 min read' // Calculate based on content length
        }));
      }

      // Fallback to static data if no database results
      return Object.values(blogPosts)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // Fallback to static data on error
      return Object.values(blogPosts)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
    }
  }

  // Get single review by slug
  static async getReviewBySlug(slug: string): Promise<ReviewArticle | null> {
    try {
      // First try to get from database
      const dbReview = await prisma.article.findFirst({
        where: {
          slug,
          category: Category.REVIEW,
          published: true,
        },
        include: {
          author: true,
        },
      });

      if (dbReview) {
        return {
          id: dbReview.id,
          slug: dbReview.slug,
          title: dbReview.title,
          summary: dbReview.summary,
          snippet: dbReview.summary,
          imageUrl: dbReview.imageUrl,
          author: {
            name: dbReview.author.name,
            image: dbReview.author.image
          },
          createdAt: dbReview.createdAt.toISOString(),
          category: dbReview.category,
          rating: dbReview.rating ? (dbReview.rating as any).overall : 0,
          pros: dbReview.pros,
          cons: dbReview.cons,
          content: dbReview.content,
          verdict: dbReview.content, // Extract verdict from content if needed
          specifications: {} // Add if available in database
        };
      }

      // Fallback to static data if not found in database
      return reviews[slug] || null;
    } catch (error) {
      console.error('Error fetching review:', error);
      // Fallback to static data on error
      return reviews[slug] || null;
    }
  }

  // Get single blog post by slug
  static async getBlogPostBySlug(slug: string): Promise<BlogArticle | null> {
    try {
      // First try to get from database
      const dbPost = await prisma.article.findFirst({
        where: {
          slug,
          category: Category.BLOG,
          published: true,
        },
        include: {
          author: true,
        },
      });

      if (dbPost) {
        return {
          id: dbPost.id,
          slug: dbPost.slug,
          title: dbPost.title,
          summary: dbPost.summary,
          excerpt: dbPost.summary,
          imageUrl: dbPost.imageUrl,
          author: {
            name: dbPost.author.name,
            image: dbPost.author.image
          },
          createdAt: dbPost.createdAt.toISOString(),
          category: dbPost.category,
          content: dbPost.content,
          tags: [], // Add if available in database
          readingTime: '5 min read' // Calculate based on content length
        };
      }

      // Fallback to static data if not found in database
      return blogPosts[slug] || null;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      // Fallback to static data on error
      return blogPosts[slug] || null;
    }
  }
} 