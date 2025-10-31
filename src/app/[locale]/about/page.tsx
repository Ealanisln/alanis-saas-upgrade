import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";
import BreadcrumbJsonLd from "@/components/Common/BreadcrumbJsonLd";
import { generateAlternates, generateLocalizedUrl, getLocaleCode } from "@/lib/seo";
import { siteConfig } from "@/config/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.meta" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t.raw("keywords"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "profile",
      locale: getLocaleCode(locale),
      images: [
        {
          url: "/about/opengraph-image",
          width: 1200,
          height: 630,
          alt: t("title"),
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/about/opengraph-image"],
    },
    alternates: generateAlternates(locale, '/about')
  };
}

const AboutPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.hero" });
  const tBreadcrumbs = await getTranslations({ locale, namespace: "common.breadcrumbs" });
  const tJsonLd = await getTranslations({ locale, namespace: "about.jsonLd" });

  // Create structured data for the About page with locale-specific description
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": siteConfig.author,
    "alternateName": siteConfig.name,
    "description": tJsonLd('description'),
    "url": generateLocalizedUrl(locale, '/about'),
    "image": `${siteConfig.url}/about/opengraph-image`,
    "sameAs": [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.twitter
    ],
    "jobTitle": tJsonLd('jobTitle'),
    "worksFor": {
      "@type": "Organization",
      "name": tJsonLd('worksFor')
    },
    "nationality": {
      "@type": "Country",
      "name": "Mexico"
    },
    "knowsAbout": [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Web Development",
      "Full-Stack Development"
    ]
  };

  // Breadcrumb items for structured data with translations
  const breadcrumbItems = [
    { name: tBreadcrumbs('home'), url: generateLocalizedUrl(locale, '/') },
    { name: tBreadcrumbs('about'), url: generateLocalizedUrl(locale, '/about') }
  ];

  return (
    <>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Add breadcrumb structured data */}
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <Breadcrumb
        pageName={t('title')}
        description={t('description')}
      />
      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;
