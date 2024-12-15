import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getToken } from 'next-auth/jwt';
import { Prisma } from '@prisma/client';

interface Rating {
  overall: number;
  design: number;
  features: number;
  performance: number;
  value: number;
}

interface ArticleData {
  title: string;
  content: string;
  summary: string;
  imageUrl: string;
  rating?: Rating;
  pros?: string[];
  cons?: string[];
}

function toJsonValue(rating: Rating | undefined): Prisma.InputJsonValue | undefined {
  if (!rating) return undefined;
  return {
    overall: rating.overall,
    design: rating.design,
    features: rating.features,
    performance: rating.performance,
    value: rating.value
  };
}

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    console.log('[GET] Attempting to fetch article with slug:', slug);

    // Check if user is admin
    const token = await getToken({ req: request });
    const isAdmin = token?.role === 'ADMIN';
    console.log('[GET] User is admin:', isAdmin);

    // First, let's check what articles exist
    const allArticles = await prisma.article.findMany({
      where: isAdmin ? undefined : { published: true },
      select: { id: true, title: true, slug: true, published: true }
    });
    console.log('[GET] Available articles:', JSON.stringify(allArticles, null, 2));

    // Now try to find the specific article
    const article = await prisma.article.findFirst({
      where: {
        slug,
        // Only show published articles to non-admin users
        ...(isAdmin ? {} : { published: true })
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    console.log('[GET] Found article:', article ? JSON.stringify(article, null, 2) : 'null');

    if (!article) {
      console.log('[GET] No article found with slug:', slug);
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('[GET] Error fetching article:', error);
    if (error instanceof Error) {
      console.error('[GET] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const token = await getToken({ req: request });

    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json() as ArticleData;
    const {
      title,
      content,
      summary,
      imageUrl,
      rating,
      pros,
      cons,
    } = data;

    const article = await prisma.article.update({
      where: { slug },
      data: {
        title,
        content,
        summary,
        imageUrl,
        rating: toJsonValue(rating),
        pros,
        cons,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const token = await getToken({ req: request });

    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.article.delete({
      where: { slug },
    });

    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
