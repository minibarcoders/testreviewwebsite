import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Simple auth check - in production, use proper auth!
const API_KEY = 'your-secret-key';

export async function POST(request: Request) {
  try {
    // Check auth
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { category, ...articleData } = data;

    // Validate required fields
    if (!articleData.title || !articleData.content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create slug from title
    const slug = articleData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Determine file path
    const fileName = category === 'review' ? 'reviews.ts' : 'blog-posts.ts';
    const filePath = path.join(process.cwd(), 'data', fileName);

    // Read existing file
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    // Extract the existing data object
    const match = fileContent.match(/export const \w+ = ({[\s\S]*});/);
    if (!match) {
      throw new Error('Invalid file format');
    }

    // Parse existing data
    const existingData = eval(`(${match[1]})`);

    // Add new article
    const newData = {
      ...existingData,
      [slug]: {
        ...articleData,
        slug,
        id: Date.now()
      }
    };

    // Format the new file content
    const newFileContent = `${fileContent.split('export const')[0]}export const ${
      category === 'review' ? 'reviews' : 'blogPosts'
    } = ${JSON.stringify(newData, null, 2)};`;

    // Write back to file
    await fs.writeFile(filePath, newFileContent, 'utf-8');

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Error saving article:', error);
    return NextResponse.json({ error: 'Failed to save article' }, { status: 500 });
  }
} 