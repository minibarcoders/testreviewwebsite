import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Generate a JWT token for Tiny Drive
    const token = jwt.sign(
      {
        sub: session.user.id, // User ID
        name: session.user.name,
        email: session.user.email,
      },
      process.env.TINYDRIVE_JWT_SECRET || process.env.NEXTAUTH_SECRET!, // Use NextAuth secret as fallback
      { expiresIn: '1h' }
    );

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating Tiny Drive token:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
