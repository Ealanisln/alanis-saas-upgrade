import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    exclude: ["node_modules/**", "e2e/**", "**/*.e2e.*"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        // Build artifacts
        "node_modules/",
        ".next/",
        "out/",
        "build/",
        "dist/",
        // Configuration files
        "**/*.config.*",
        "**/*.d.ts",
        "**/types/**",
        "src/config/**",
        "sanity.cli.ts",
        // Test files
        "**/__tests__/**",
        "**/*.test.*",
        "**/*.spec.*",
        "e2e/**",
        // Sanity CMS (configuration-heavy, tested via integration)
        "src/sanity/schemaTypes/**",
        "src/sanity/schemas/**",
        "src/sanity/schema.ts",
        "src/app/studio/**",
        ".sanity/**",
        // Static data files
        "**/*Data.tsx",
        "**/brandsData.tsx",
        "src/data/**",
        // Migration scripts (one-time use)
        "migrations/**",
        // Next.js infrastructure
        "src/middleware.ts",
        "src/app/layout.tsx",
        "src/app/providers.tsx",
        "src/app/robots.ts",
        "src/app/sitemap.ts",
        "src/app/error.tsx",
        "src/app/[locale]/layout.tsx",
        "src/app/[locale]/error.tsx",
        "src/app/[locale]/not-found.tsx",
        // i18n infrastructure
        "src/i18n/**",
        // Re-export index files
        "**/index.ts",
        // Type-only files
        "src/lib/types.ts",
        "src/sanity/lib/types.ts",
        "src/lib/api/types.ts",
        // Page files (covered by E2E tests)
        "src/app/**/page.tsx",
        "src/app/**/loading.tsx",
        // Legacy/demo pages
        "src/app/blog-details/**",
        "src/app/blog-sidebar/**",
        "src/app/cotizador/**",
        "src/app/dashboard/**",
        "src/app/error/**",
        "src/app/new-ui/**",
        // UI components covered by E2E tests
        "src/components/About/**",
        "src/components/Blog/**",
        "src/components/Brands/**",
        "src/components/Contact/**",
        "src/components/Portfolio/**",
        "src/components/Product/**",
        "src/components/ScrollToTop/**",
        "src/components/Stripe/**",
        "src/components/TypewriterTitle/**",
        "src/components/Video/**",
        "src/components/Checkout/**",
        "src/components/Ecommerce/**",
        "src/components/Examples/**",
        "src/components/Plans/**",
        // Calculator sub-components (main calculator is tested)
        "src/components/Calculator/ServiceCalculatorConfiguration.tsx",
        "src/components/Calculator/QuoteFormModal.tsx",
        "src/components/Calculator/QuoteSummary.tsx",
        "src/components/Calculator/ServiceCard.tsx",
        // Common UI components
        "src/components/Common/Breadcrumb.tsx",
        "src/components/Common/BreadcrumbJsonLd.tsx",
        "src/components/Common/ScrollUp.tsx",
        // UI primitives (shadcn)
        "src/components/ui/badge.tsx",
        "src/components/ui/carousel.tsx",
        "src/components/ui/dialog.tsx",
        "src/components/ui/dropdown-menu.tsx",
        "src/components/ui/pagination.tsx",
        "src/components/ui/table.tsx",
        "src/components/ui/PageNotFound.tsx",
        "src/components/ui/title/**",
        // Navigation library
        "src/lib/navigation.ts",
        // Turnstile verification (external service)
        "src/lib/turnstile.ts",
      ],
      thresholds: {
        global: {
          statements: 60,
          branches: 70,
          functions: 60,
          lines: 60,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
