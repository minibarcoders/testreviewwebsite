import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.title || !data.content || !data.summary || !data.imageUrl) {
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

    // Prepare the article data
    const articleData = {
      title: data.title,
      content: data.content,
      summary: data.summary,
      imageUrl: data.imageUrl,
      category: data.category as Category,
      slug,
      authorId: data.authorId || 'default-author', // Replace with actual auth
      published: data.published || false,
      ...(data.category === Category.REVIEW && {
        rating: data.rating,
        pros: data.pros,
        cons: data.cons
      })
    };

    // Create the article
    const article = await prisma.article.create({
      data: articleData
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