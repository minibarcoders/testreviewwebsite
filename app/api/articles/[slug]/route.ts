import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getToken } from 'next-auth/jwt';
import { validateArticle } from 'app/lib/validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const startTime = Date.now();
  try {
    console.log('[GET] Starting request');
    const { slug } = await params;
    console.log('[GET] Resolved slug:', slug);

    const token = await getToken({ req: request });
    console.log('[GET] Auth token:', token ? { 
      email: token.email, 
      role: token.role 
    } : 'null');

    const isAdmin = token?.role === 'ADMIN';
    console.log('[GET] Is admin:', isAdmin);

    // Fetch article directly from database
    console.log('[DB] Fetching article:', { slug, includeUnpublished: isAdmin });
    const article = await prisma.article.findFirst({
      where: {
        slug,
        ...(isAdmin ? {} : { published: true }),
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    console.log('[DB] Found article:', article ? { 
      id: article.id, 
      title: article.title,
      fetchTime: `${Date.now() - startTime}ms`
    } : 'null');

    if (!article) {
      console.log('[GET] Article not found');
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error('[GET] Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article', details: error instanceof Error ? error.message : 'Unknown error' },
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
    console.log('[PUT] Auth token:', token ? { 
      email: token.email, 
      role: token.role 
    } : 'null');

    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const article = await prisma.article.findFirst({
      where: { slug },
      select: { id: true, authorId: true },
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Get and log the input data
    const data = await request.json();
    console.log('[PUT] Input data:', {
      ...data,
      content: data.content?.length + ' chars',
    });

    // Validate input data
    const validatedData = validateArticle(data);
    console.log('[PUT] Validation passed');

    // Check if title changed and generate new slug
    let newSlug = slug;
    if (validatedData.title) {
      newSlug = validatedData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      if (newSlug !== slug) {
        // Check if new slug already exists
        const existingArticle = await prisma.article.findFirst({
          where: { 
            slug: newSlug,
            id: { not: article.id } // Exclude current article
          },
        });

        if (existingArticle) {
          return NextResponse.json(
            { error: 'An article with this title already exists' },
            { status: 409 }
          );
        }
      }
    }

    // Update the article
    const updatedArticle = await prisma.article.update({
      where: { id: article.id },
      data: {
        ...validatedData,
        slug: newSlug,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    console.log('[PUT] Article updated:', { 
      id: updatedArticle.id, 
      title: updatedArticle.title,
      newSlug 
    });

    return NextResponse.json({ article: updatedArticle });
  } catch (error) {
    console.error('[PUT] Error updating article:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update article', 
        details: error instanceof Error ? error.message : 'Unknown error',
        validation: error instanceof Error ? error.cause : undefined
      },
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

    const article = await prisma.article.findFirst({
      where: { slug },
      select: { id: true, authorId: true },
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    await prisma.article.delete({
      where: { id: article.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE] Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
