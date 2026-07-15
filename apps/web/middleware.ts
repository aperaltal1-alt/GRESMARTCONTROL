import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { authRoutes, publicRoutes, siteConfig } from '@/config/site';

function matchesRoute(pathname: string, routes: readonly string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has(siteConfig.authCookie);
  const isPublicRoute = matchesRoute(pathname, publicRoutes);
  const isAuthRoute = matchesRoute(pathname, authRoutes);

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard/operativo', request.url));
  }

  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard/operativo', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
