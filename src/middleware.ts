import { NextResponse, type NextRequest } from 'next/server';
import { auth } from './auth';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminPath = pathname.startsWith('/admin');
  const isLoginPath = pathname === '/admin/login';
  const isRegisterPath = pathname === '/register';

  // Get user session
  const session = await auth();

  // If trying to access admin pages without auth, redirect to login
  if (isAdminPath && !isLoginPath && !session) {
    const url = new URL('/admin/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  // If authenticated and trying to access login/register, redirect to dashboard
  if (session && (isLoginPath || isRegisterPath)) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/register'],
};
