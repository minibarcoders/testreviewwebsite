import { NextResponse } from 'next/server';
import { getReviews, getPage, getBlocks, getPublishedArticles } from '@/lib/notion';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const pageId = searchParams.get('pageId');
    const type = searchParams.get('type') || 'reviews'; // 'reviews' or 'articles'

    if (pageId) {
      const [page, blocks] = await Promise.all([
        getPage(pageId),
        getBlocks(pageId),
      ]);

      return NextResponse.json({ page, blocks });
    }

    let data;
    if (type === 'articles') {
      data = await getPublishedArticles();
      return NextResponse.json({ articles: data });
    } else {
      data = await getReviews();
      return NextResponse.json({ reviews: data });
    }
    
    if (path) {
      revalidatePath(path);
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, ...data } = body;

    // Handle different types of content creation
    // This will be implemented in the Notion client
    // For now, we'll just return a success message
    return NextResponse.json({ message: 'Content created successfully' });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function HEAD(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (path) {
      revalidatePath(path);
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error('Revalidation Error:', error);
    return new Response(null, { status: 500 });
  }
}
