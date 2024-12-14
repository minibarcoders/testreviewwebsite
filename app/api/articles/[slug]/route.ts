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

export async function GET(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    const article = await prisma.article.findUnique({
      where: { slug: context.params.slug },
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

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  try {
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
      where: { slug: context.params.slug },
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
  context: { params: { slug: string } }
) {
  try {
    const token = await getToken({ req: request });

    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.article.delete({
      where: { slug: context.params.slug },
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
