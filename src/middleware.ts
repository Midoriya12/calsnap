import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for route protection
 *
 * Note: This middleware provides basic route protection.
 * For production with Firebase Auth, consider implementing Firebase Admin SDK
 * session cookie verification for stronger server-side authentication.
 *
 * See: https://firebase.google.com/docs/auth/admin/manage-cookies
 */

// Routes that require authentication
const protectedRoutes = [
  '/daily-log',
  '/saved-meals',
  '/recipes',
];

// Routes that should redirect to home if already authenticated
const authRoutes = ['/login', '/signup'];

// Public routes that don't require authentication
const publicRoutes = ['/', '/api/recipes', '/api/nutrition'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Firebase Auth session cookie
  // Note: This requires Firebase Admin SDK session cookie setup
  // const session = request.cookies.get('__session')?.value;
  // For now, we'll use a simple check
  const hasAuthCookie = request.cookies.has('__session');

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('/favicon.ico') ||
    pathname.includes('.') // Files with extensions
  ) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (hasAuthCookie) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Protect authenticated routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!hasAuthCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
