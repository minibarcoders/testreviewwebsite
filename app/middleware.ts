import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isApiRoute = request.nextUrl.pathname.startsWith('/api') && 
                    !request.nextUrl.pathname.startsWith('/api/auth')

  // For admin routes and protected API routes, verify authentication and admin role
  if (isAdminRoute || isApiRoute) {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    })

    // No token found
    if (!token) {
      if (isApiRoute) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
      // Redirect to login for admin routes
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verify admin role
    if (token.role !== 'ADMIN') {
      if (isApiRoute) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        )
      }
      // Redirect to home for non-admin users
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Prevent authenticated users from accessing login page
  if (request.nextUrl.pathname === '/auth/login') {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    })

    if (token) {
      return NextResponse.redirect(new URL('/admin/articles', request.url))
    }
  }

  return NextResponse.next()
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
    '/auth/login'
  ]
}
