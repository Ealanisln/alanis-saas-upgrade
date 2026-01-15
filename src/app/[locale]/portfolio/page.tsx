// src/app/[locale]/portfolio/page.tsx
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BreadcrumbJsonLd from "@/components/Common/BreadcrumbJsonLd";
import ModernPortfolio from "@/components/Portfolio/ModernPortfolio";
import { siteConfig } from "@/config/i18n";
import projects from "@/data/projects";
import {
  generateLocalizedUrl,
  getLocaleCode,
  generateAlternates,
} from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portfolio.meta" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      siteName: "Alanis Dev",
      locale: getLocaleCode(locale),
      images: [
        {
          url: "/og-alanis-web-dev.jpg",
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-alanis-web-dev.jpg"],
    },
    alternates: generateAlternates(locale, "/portfolio"),
  };
}

const PortfolioPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const tHero = await getTranslations({ locale, namespace: "portfolio.hero" });
  const tSection = await getTranslations({
    locale,
    namespace: "portfolio.section",
  });
  const tJsonLd = await getTranslations({
    locale,
    namespace: "portfolio.jsonLd",
  });
  const tBreadcrumbs = await getTranslations({
    locale,
    namespace: "common.breadcrumbs",
  });

  // Create structured data for the portfolio page with locale-specific content
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: tJsonLd("name"),
    description: tJsonLd("description"),
    url: generateLocalizedUrl(locale, "/portfolio"),
    author: {
      "@type": "Person",
      name: siteConfig.author,
      url: generateLocalizedUrl(locale, "/about"),
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.images.logo}`,
      },
    },
    mainEntity: {
      "@type": "ItemList",
      name: tJsonLd("mainEntityName"),
      description: tJsonLd("mainEntityDescription"),
    },
  };

  // Breadcrumb items for structured data with translations
  const breadcrumbItems = [
    { name: tBreadcrumbs("home"), url: generateLocalizedUrl(locale, "/") },
    {
      name: tBreadcrumbs("portfolio"),
      url: generateLocalizedUrl(locale, "/portfolio"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD structured data for SEO - content from trusted translation files */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BreadcrumbJsonLd items={breadcrumbItems} />

      {/* Hero Section - Clean & Minimal */}
      <section className="container mx-auto px-6 py-16 md:py-20">
        <div className="max-w-3xl">
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
            {tHero("badge")}
          </span>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 dark:text-white md:text-5xl">
            {tHero("title")}{" "}
            <span className="text-primary">{tHero("titleHighlight")}</span>
          </h1>
          <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            {tHero("description")}
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section id="portfolio-grid" className="container mx-auto px-6 pb-20">
        <div className="mb-12">
          <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
            {tSection("title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {tSection("subtitle")}
          </p>
        </div>

        <ModernPortfolio projects={projects} locale={locale} />
      </section>
    </div>
  );
};

export default PortfolioPage;
