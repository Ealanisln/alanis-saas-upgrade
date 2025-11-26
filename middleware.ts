import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales, isValidLocale, type Locale } from './src/config/i18n';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Use 'as-needed' to omit prefix for default locale (English)
  localePrefix: 'as-needed',

  // Enable automatic locale detection based on Accept-Language header
  localeDetection: true
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle malformed URLs with encoded special characters (crawlers sometimes generate these)
  // Return 404 for URLs containing $, &, or other suspicious encoded characters
  if (/%24|%26|%3C|%3E/.test(pathname) || /[$&<>]/.test(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  // Check if the request is for the root path
  if (pathname === '/') {
    // Get the preferred language from the Accept-Language header
    const acceptLanguage = request.headers.get('accept-language');

    // Check if Spanish is preferred
    if (acceptLanguage && acceptLanguage.toLowerCase().includes('es')) {
      // Redirect to Spanish version (preserving the root path)
      const url = request.nextUrl.clone();
      url.pathname = '/es';
      return NextResponse.redirect(url);
    }
    // For English (default), let next-intl middleware handle it
    // It will serve content at '/' without redirecting
  }

  // For all other requests, use the next-intl middleware
  const response = intlMiddleware(request);

  // Detect and validate locale from pathname
  let locale: Locale = defaultLocale;

  // Extract potential locale from pathname (e.g., /es/about -> 'es')
  const pathSegments = pathname.split('/').filter(Boolean);
  const potentialLocale = pathSegments[0];

  // Validate the locale using isValidLocale
  if (potentialLocale && isValidLocale(potentialLocale)) {
    locale = potentialLocale;
  }

  // Set x-locale header for the root layout to use (if needed)
  response.headers.set('x-locale', locale);

  return response;
}

export const config = {
  // Match all requests except for api routes, static files, and assets
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml, robots.txt (SEO files)
     * - studio (Sanity Studio)
     * - opengraph-image (OG image generation routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|studio|.*opengraph-image.*).*)'
  ]
}; 