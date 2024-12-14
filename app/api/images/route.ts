import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

// Check for required environment variables
const requiredEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
] as const;

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
} else {
  console.log('All Cloudinary environment variables are present');
}

// Configure Cloudinary only if all credentials are present
if (missingEnvVars.length === 0) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log('Cloudinary configured successfully');
  } catch (error) {
    console.error('Error configuring Cloudinary:', error);
  }
}

// Helper function to create a response with CORS headers
function corsResponse(data: any, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function OPTIONS() {
  return corsResponse({});
}

export async function POST(request: NextRequest) {
  console.log('POST /api/images - Starting request');
  try {
    // Check for missing environment variables
    if (missingEnvVars.length > 0) {
      console.error('Cloudinary configuration missing:', missingEnvVars);
      return corsResponse(
        { error: 'Cloudinary configuration is missing. Please check server logs.' },
        500
      );
    }

    // Check authentication
    const token = await getToken({ req: request });
    console.log('Authentication token:', token ? 'Present' : 'Missing', 'Role:', token?.role);
    
    if (!token) {
      console.log('No authentication token found');
      return corsResponse({ error: 'Not authenticated' }, 401);
    }

    if (token.role !== 'ADMIN') {
      console.log('User is not an admin:', token.role);
      return corsResponse({ error: 'Unauthorized - Admin access required' }, 403);
    }

    const data = await request.formData();
    const file = data.get('file') as File;
    
    if (!file) {
      console.log('No file provided in request');
      return corsResponse({ error: 'No file provided' }, 400);
    }

    console.log('Processing file:', {
      type: file.type,
      size: file.size,
      name: file.name
    });

    try {
      // Convert file to base64
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

      console.log('Attempting to upload to Cloudinary...');
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(fileBase64, {
        folder: 'tech-review-site',
      });
      console.log('Cloudinary upload successful:', {
        url: result.secure_url,
        publicId: result.public_id
      });

      // Save image record to database
      console.log('Saving image record to database...');
      const image = await prisma.image.create({
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        },
      });
      console.log('Image record saved successfully');

      return corsResponse(image);
    } catch (uploadError) {
      console.error('Error during file upload:', uploadError);
      return corsResponse(
        { error: uploadError instanceof Error ? uploadError.message : 'Failed to upload file to Cloudinary' },
        500
      );
    }
  } catch (error) {
    console.error('Error handling image upload:', error);
    return corsResponse(
      { error: error instanceof Error ? error.message : 'Internal server error during image upload' },
      500
    );
  }
}

export async function GET(request: NextRequest) {
  console.log('GET /api/images - Starting request');
  try {
    const token = await getToken({ req: request });
    console.log('Authentication token:', token ? 'Present' : 'Missing', 'Role:', token?.role);

    if (!token) {
      console.log('No authentication token found');
      return corsResponse({ error: 'Not authenticated' }, 401);
    }

    if (token.role !== 'ADMIN') {
      console.log('User is not an admin:', token.role);
      return corsResponse({ error: 'Unauthorized - Admin access required' }, 403);
    }

    console.log('Fetching images from database...');
    const images = await prisma.image.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    console.log(`Found ${images.length} images`);

    return corsResponse(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return corsResponse(
      { error: error instanceof Error ? error.message : 'Failed to fetch images' },
      500
    );
  }
} 