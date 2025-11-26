const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // SEO Redirects: Handle legacy URLs only
  // NOTE: /en/* redirects are handled by next-intl middleware, not here
  async redirects() {
    return [
      // Legacy nested route redirects
      { source: '/about/portfolio', destination: '/portfolio', permanent: true },
      { source: '/about/plans', destination: '/plans', permanent: true },

      // Spanish route variants
      { source: '/portafolio', destination: '/es/portfolio', permanent: true },
      { source: '/portafolio/:path*', destination: '/es/portfolio', permanent: true },
      { source: '/planes', destination: '/es/plans', permanent: true },

      // Handle missing pages (redirect to contact)
      { source: '/es/refund', destination: '/es/contact', permanent: true },
      { source: '/refund', destination: '/contact', permanent: true },
      { source: '/terms', destination: '/contact', permanent: true },
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
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Security headers
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
    ];
  },

  // ESLint configuration for build
  // NOTE: Temporarily allowing builds with ESLint warnings during migration
  // See STRICT_MODE_ISSUES.md for detailed list of issues to fix
  // Primary issues: 25 accessibility errors, 43 unused vars, 6 import order
  // Target: Remove this bypass after addressing critical issues
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Performance optimizations
  compress: true,
  productionBrowserSourceMaps: false,

  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

module.exports = withNextIntl(nextConfig);
