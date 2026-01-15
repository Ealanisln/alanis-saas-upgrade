import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Create middleware using the routing configuration
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle malformed URLs with encoded special characters
  if (/%24|%26|%3C|%3E/.test(pathname) || /[$&<>]/.test(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  // Redirect legacy /en URLs to root (English is at root, not /en)
  // This fixes "Duplicate without user-selected canonical" issues in GSC
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const newPathname =
      pathname === "/en" ? "/" : pathname.replace(/^\/en/, "");
    const url = request.nextUrl.clone();
    url.pathname = newPathname;
    return NextResponse.redirect(url, 301);
  }

  // Get the response from next-intl middleware
  const response = intlMiddleware(request);

  // Extract locale from URL path and set both header and cookie for root layout
  // Cookies are more reliably accessible in server components than middleware headers
  const locale = pathname.startsWith("/es") ? "es" : "en";
  response.headers.set("x-locale", locale);
  response.cookies.set("x-locale", locale, {
    path: "/",
    sameSite: "lax",
  });

  return response;
}

export const config = {
  // Match all paths except static files, api routes, and studio
  matcher: ["/((?!api|_next|_vercel|studio|.*\\..*).*)", "/"],
};
