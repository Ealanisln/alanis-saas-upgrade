import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const revalidate = 3600;

import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import TechStackShowcase from "@/components/About/TechStackShowcase";
import Breadcrumb from "@/components/Common/Breadcrumb";
import BreadcrumbJsonLd from "@/components/Common/BreadcrumbJsonLd";
import { siteConfig } from "@/config/i18n";
import {
  generateAlternates,
  generateLocalizedUrl,
  getLocaleCode,
} from "@/lib/seo";

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
    alternates: generateAlternates(locale, "/about"),
  };
}

const AboutPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.hero" });
  const tBreadcrumbs = await getTranslations({
    locale,
    namespace: "common.breadcrumbs",
  });
  const tJsonLd = await getTranslations({ locale, namespace: "about.jsonLd" });

  // All values are developer-controlled strings from trusted translation files
  const jsonLdString = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author,
    alternateName: siteConfig.name,
    description: tJsonLd("description"),
    url: generateLocalizedUrl(locale, "/about"),
    image: `${siteConfig.url}/og-alanis-web-dev.jpg`,
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.twitter,
    ],
    jobTitle: tJsonLd("jobTitle"),
    worksFor: {
      "@type": "Organization",
      name: tJsonLd("worksFor"),
    },
    nationality: {
      "@type": "Country",
      name: "Mexico",
    },
    knowsAbout: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Web Development",
      "Full-Stack Development",
    ],
  });

  const breadcrumbItems = [
    { name: tBreadcrumbs("home"), url: generateLocalizedUrl(locale, "/") },
    {
      name: tBreadcrumbs("about"),
      url: generateLocalizedUrl(locale, "/about"),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        // Safe: content is from trusted translation files and config, not user input
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <Breadcrumb pageName={t("title")} description={t("description")} />
      <AboutSectionOne />
      <AboutSectionTwo />
      <TechStackShowcase />
    </>
  );
};

export default AboutPage;
