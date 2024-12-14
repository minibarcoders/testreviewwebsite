import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { Category, Prisma } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

interface Rating {
  overall: number;
  design: number;
  features: number;
  performance: number;
  value: number;
}

function toJsonValue(rating: Rating | undefined): Prisma.JsonValue {
  if (!rating) return null;
  return {
    overall: rating.overall,
    design: rating.design,
    features: rating.features,
    performance: rating.performance,
    value: rating.value
  };
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

    // Basic validation
    if (!data.title || !data.content || !data.summary) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create URL-friendly slug from title
    const slug = data.title
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

    // Validate category
    if (!Object.values(Category).includes(data.category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Validate rating for reviews
    if (data.category === Category.REVIEW) {
      const rating = data.rating || {};
      const requiredRatings = ['overall', 'design', 'features', 'performance', 'value'];
      
      for (const field of requiredRatings) {
        const value = Number(rating[field]);
        if (isNaN(value) || value < 0 || value > 10) {
          return NextResponse.json(
            { error: `Invalid ${field} rating. Must be between 0 and 10` },
            { status: 400 }
          );
        }
      }
    }

    // Prepare the article data
    const articleData = {
      title: data.title,
      content: data.content,
      summary: data.summary,
      imageUrl: data.imageUrl || '/images/placeholder.png',
      category: data.category as Category,
      slug,
      authorId: token.id as string,
      published: data.published || false,
      ...(data.category === Category.REVIEW && {
        rating: toJsonValue(data.rating),
        pros: data.pros?.filter(Boolean) || [],
        cons: data.cons?.filter(Boolean) || []
      })
    };

    // Create the article
    const article = await prisma.article.create({
      data: articleData,
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const published = searchParams.get('published');
    
    const where = {
      ...(category && { category: category as Category }),
      ...(published !== null && { published: published === 'true' })
    };

    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
