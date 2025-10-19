import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './src/config/i18n';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Change to 'always' since we want explicit locale prefixes
  localePrefix: 'always',

  // Enable automatic locale detection based on Accept-Language header
  localeDetection: true
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for the root path
  if (pathname === '/') {
    // Get the preferred language from the Accept-Language header
    const acceptLanguage = request.headers.get('accept-language');

    // Simple language detection
    let detectedLocale: typeof locales[number] = defaultLocale;

    if (acceptLanguage) {
      // Check if Spanish is preferred
      if (acceptLanguage.toLowerCase().includes('es')) {
        detectedLocale = 'es' as const;
      }
      // English is already the default
    }

    // Redirect to the detected locale
    const url = request.nextUrl.clone();
    url.pathname = `/${detectedLocale}`;
    return NextResponse.redirect(url);
  }

  // For all other requests, use the next-intl middleware
  return intlMiddleware(request);
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