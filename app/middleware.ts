import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { globalRateLimit, authRateLimit, getRateLimitResponse, getClientIp } from './lib/rate-limit';

export async function middleware(request: NextRequest) {
  const clientIp = getClientIp(request);

  // Apply rate limiting if Redis is available
  const isAuthRoute = request.nextUrl.pathname === '/api/auth/callback/credentials';
  const rateLimitResult = isAuthRoute 
    ? await authRateLimit(clientIp)
    : await globalRateLimit(clientIp);

  // Only apply rate limiting if Redis is available and limit is exceeded
  if (rateLimitResult && !rateLimitResult.success) {
    const response = getRateLimitResponse(rateLimitResult);
    if (response) return response;
  }

  // Check if the request is for admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  
  // Protect all API routes except public endpoints
  const isProtectedApiRoute = request.nextUrl.pathname.startsWith('/api') && 
    !request.nextUrl.pathname.startsWith('/api/auth') &&
    !request.nextUrl.pathname.match(/^\/api\/(articles|images)$/);

  // Add security headers to all responses
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );

  // For admin routes and protected API routes, verify authentication and admin role
  if (isAdminRoute || isProtectedApiRoute) {
    console.log('[Middleware] Checking auth for:', request.nextUrl.pathname);
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });
    console.log('[Middleware] Token:', token ? { email: token.email, role: token.role } : 'null');

    // No token found
    if (!token) {
      console.log('[Middleware] No token found');
      if (isProtectedApiRoute) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      // Redirect to login for admin routes
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify admin role
    if (token.role !== 'ADMIN') {
      console.log('[Middleware] Not admin role');
      if (isProtectedApiRoute) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }
      // Redirect to home for non-admin users
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Add CSRF protection for mutating operations
    // Skip CSRF check for login requests and GET requests
    if (request.method !== 'GET' && request.method !== 'HEAD' && !isAuthRoute) {
      const csrfToken = request.headers.get('X-CSRF-Token');
      const expectedToken = token.csrfToken;
      console.log('[Middleware] CSRF check:', { 
        provided: csrfToken ? 'present' : 'missing',
        expected: expectedToken ? 'present' : 'missing'
      });

      if (!csrfToken || csrfToken !== expectedToken) {
        return NextResponse.json(
          { error: 'Invalid CSRF token' },
          { status: 403 }
        );
      }
    }

    // For admin routes, add the token to the response headers
    // This allows the client to access it for subsequent requests
    if (isAdminRoute) {
      response.headers.set('X-User-Role', token.role);
      if (token.csrfToken) {
        response.headers.set('X-CSRF-Token', token.csrfToken);
      }
    }
  }

  // Prevent authenticated users from accessing login page
  if (request.nextUrl.pathname === '/auth/login') {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (token) {
      return NextResponse.redirect(new URL('/admin/articles', request.url));
    }
  }

  return response;
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
    '/auth/login'
  ]
};
