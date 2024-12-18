import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { Category, Prisma } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { validateArticle } from 'app/lib/validation';
import { 
  cacheGet, 
  cacheSet, 
  cacheInvalidate, 
  generateCacheKey,
  getPaginationParams,
  type PaginatedResult
} from 'app/lib/redis';

const CACHE_TTL = 60 * 5; // 5 minutes
const ARTICLES_CACHE_PREFIX = 'articles';

interface GetArticlesParams {
  category?: Category;
  published?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}

async function getArticles(params: GetArticlesParams) {
  console.log('Getting articles with params:', params);
  const { category, published, search } = params;
  const { skip, take, page } = getPaginationParams(params);

  // Build where clause
  const where: Prisma.ArticleWhereInput = {
    ...(category && { category }),
    ...(typeof published === 'boolean' ? { published } : {}), // Changed to handle undefined case
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  console.log('Prisma where clause:', where);

  try {
    // Execute queries in parallel
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          author: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    console.log('Found articles:', articles.length);
    console.log('Total articles:', total);

    const result: PaginatedResult<any> = {
      data: articles,
      pagination: {
        total,
        page,
        limit: take,
        totalPages: Math.ceil(total / take),
        hasMore: skip + take < total,
      },
    };

    return result;
  } catch (error) {
    console.error('Error fetching articles from database:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/articles');
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as Category | null;
    const published = searchParams.get('published');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const search = searchParams.get('search');
    
    // Check if user is admin
    const token = await getToken({ req: request });
    console.log('User token:', { id: token?.id, email: token?.email, role: token?.role });
    const isAdmin = token?.role === 'ADMIN';

    // For non-admin users, only show published articles
    const params: GetArticlesParams = {
      category: category || undefined,
      published: isAdmin ? (published === 'true' ? true : undefined) : true, // Changed to handle undefined case
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search: search || undefined,
    };

    console.log('Fetching articles with params:', params);
    const result = await getArticles(params);
    console.log('Returning articles:', result.data.length);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('[GET] Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    try {
      const validatedData = validateArticle(data);

      // Create URL-friendly slug from title
      const slug = validatedData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check for duplicate slug
      const existingArticle = await prisma.article.findUnique({
        where: { slug }
      });

      if (existingArticle) {
        return NextResponse.json(
          { error: 'An article with this title already exists' },
          { status: 409 }
        );
      }

      // Create the article
      const article = await prisma.article.create({
        data: {
          ...validatedData,
          slug,
          author: {
            connect: { id: token.id }
          },
        },
        include: {
          author: {
            select: {
              name: true,
              email: true,
              image: true,
            }
          }
        }
      });

      return NextResponse.json({ article }, { status: 201 });
    } catch (validationError) {
      return NextResponse.json(
        { error: 'Failed to create article', details: validationError instanceof Error ? validationError.message : 'Validation failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
