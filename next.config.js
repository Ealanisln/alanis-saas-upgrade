const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // SEO Redirects: Handle legacy URLs only
  // NOTE: /en/* redirects are handled in src/proxy.ts, not here
  async redirects() {
    return [
      // Retired standalone pages → single-page portfolio sections.
      // Config-level 308s so crawlers see a real permanent redirect (the
      // page-level redirect stubs stream a 200 shell first).
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/es/about", destination: "/es#about", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
      { source: "/es/contact", destination: "/es#contact", permanent: true },
      { source: "/portfolio", destination: "/#projects", permanent: true },
      { source: "/plans", destination: "/#contact", permanent: true },

      // Legacy nested route redirects
      {
        source: "/about/portfolio",
        destination: "/#projects",
        permanent: true,
      },
      { source: "/about/plans", destination: "/#contact", permanent: true },

      // Spanish route variants
      { source: "/portafolio", destination: "/es#projects", permanent: true },
      {
        source: "/portafolio/:path*",
        destination: "/es#projects",
        permanent: true,
      },
      { source: "/planes", destination: "/es#contact", permanent: true },

      // Handle missing pages (redirect to contact)
      { source: "/es/refund", destination: "/es#contact", permanent: true },
      { source: "/refund", destination: "/#contact", permanent: true },
      { source: "/terms", destination: "/#contact", permanent: true },
    ];
  },

  images: {
    // Note: 'domains' is deprecated, use 'remotePatterns' instead
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
      // Local images only resolve in dev; never allowlist local IPs in prod
      ...(process.env.NODE_ENV === "development"
        ? [
            {
              protocol: "http",
              hostname: "localhost",
              port: "",
            },
          ]
        : []),
    ],
    formats: ["image/avif", "image/webp"],
    // Next 16 blocks local-IP remotePatterns (the http://localhost entry
    // above) unless explicitly allowed; only needed for local dev
    ...(process.env.NODE_ENV === "development" && {
      dangerouslyAllowLocalIP: true,
    }),
  },

  // Security headers
  async headers() {
    // Content Security Policy
    // Note: 'unsafe-inline' for styles is required for Tailwind CSS
    // Note: 'unsafe-eval' is NOT included for better security
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://analytics.alanis.dev https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://cdn.sanity.io",
      "font-src 'self' data:",
      "connect-src 'self' https://*.sanity.io https://analytics.alanis.dev",
      "frame-src 'self' https://challenges.cloudflare.com",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ];

    const ContentSecurityPolicy = cspDirectives.join("; ");

    return [
      {
        // Apply these headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy,
          },
        ],
      },
      {
        // Sanity Studio needs more permissive CSP
        source: "/studio/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io; font-src 'self' data:; connect-src 'self' https://*.sanity.io https://*.api.sanity.io wss://*.sanity.io; frame-src 'self'; frame-ancestors 'self'",
          },
        ],
      },
    ];
  },

  // Performance optimizations
  compress: true,
  productionBrowserSourceMaps: false,

  // Experimental features
  experimental: {
    optimizePackageImports: [],
  },
};

module.exports = withNextIntl(nextConfig);
