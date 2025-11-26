import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Create middleware using the routing configuration
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle malformed URLs with encoded special characters
  if (/%24|%26|%3C|%3E/.test(pathname) || /[$&<>]/.test(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  // Let next-intl handle ALL routing
  return intlMiddleware(request);
}

export const config = {
  // Match all paths except static files, api routes, and studio
  matcher: ['/((?!api|_next|_vercel|studio|.*\\..*).*)', '/']
};
