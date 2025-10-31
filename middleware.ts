import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales, type Locale } from './src/config/i18n';

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

  // Check if the request is for the root path
  if (pathname === '/') {
    // Get the preferred language from the Accept-Language header
    const acceptLanguage = request.headers.get('accept-language');

    // Check if Spanish is preferred
    if (acceptLanguage && acceptLanguage.toLowerCase().includes('es')) {
      // Redirect to Spanish version
      const url = request.nextUrl.clone();
      url.pathname = '/es';
      return NextResponse.redirect(url);
    }
    // For English (default), let next-intl middleware handle it
    // It will serve content at '/' without redirecting
  }

  // For all other requests, use the next-intl middleware
  const response = intlMiddleware(request);

  // Detect locale from pathname and add to headers for root layout
  let locale: Locale = defaultLocale;
  if (pathname.startsWith('/es')) {
    locale = 'es';
  }

  // Set x-locale header for the root layout to use
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|studio).*)'
  ]
}; 