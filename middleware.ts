import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './src/config/i18n';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale,
  
  // Change to 'always' since we want explicit locale prefixes
  localePrefix: 'always'
});

export default intlMiddleware;

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