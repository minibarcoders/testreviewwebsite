import { Article, User, Category } from '@prisma/client';
import { prisma } from '../lib/prisma';

export type ArticleWithAuthor = Article & {
  author: User;
};

export type Rating = {
  overall: number;
  design: number;
  features: number;
  performance: number;
  value: number;
};

export type Price = {
  store: string;
  price: number;
  url: string;
};

export type ReviewArticle = ArticleWithAuthor & {
  rating: Rating;
  prices: Price[];
  pros: string[];
  cons: string[];
};

export type BlogArticle = ArticleWithAuthor;

export class ArticleService {
  static async getLatestReviews(limit = 3): Promise<ReviewArticle[]> {
    return await prisma.article.findMany({
      where: {
        category: Category.REVIEW,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    }) as ReviewArticle[];
  }

  static async getLatestPosts(limit = 4): Promise<BlogArticle[]> {
    return await prisma.article.findMany({
      where: {
        category: Category.BLOG,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    }) as BlogArticle[];
  }

  static async getBlogPostBySlug(slug: string): Promise<BlogArticle> {
    const post = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: true,
      },
    });

    if (!post) {
      throw new Error(`Blog post not found: ${slug}`);
    }

    return post as BlogArticle;
  }

  static async getReviewBySlug(slug: string): Promise<ReviewArticle> {
    const review = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: true,
      },
    });

    if (!review) {
      throw new Error(`Review not found: ${slug}`);
    }

    return review as ReviewArticle;
  }
} 