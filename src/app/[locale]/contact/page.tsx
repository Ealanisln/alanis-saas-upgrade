import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumb from "@/components/Common/Breadcrumb";
import BreadcrumbJsonLd from "@/components/Common/BreadcrumbJsonLd";
import Contact from "@/components/Contact";
import { siteConfig } from "@/config/i18n";
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
  const t = await getTranslations({ locale, namespace: "contact.meta" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: getLocaleCode(locale),
      images: [
        {
          url: "/contact/opengraph-image",
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
      images: ["/contact/opengraph-image"],
    },
    alternates: generateAlternates(locale, "/contact"),
  };
}

const ContactPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const tBreadcrumb = await getTranslations({
    locale,
    namespace: "contact.breadcrumb",
  });
  const tJsonLd = await getTranslations({
    locale,
    namespace: "contact.jsonLd",
  });
  const tBreadcrumbs = await getTranslations({
    locale,
    namespace: "common.breadcrumbs",
  });

  // Create structured data for the Contact page with locale-specific content
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: tJsonLd("name"),
    description: tJsonLd("description"),
    url: generateLocalizedUrl(locale, "/contact"),
    mainEntity: {
      "@type": "Person",
      name: siteConfig.author,
      jobTitle: "Full-Stack Developer",
      email: siteConfig.contact.email,
      url: generateLocalizedUrl(locale, "/"),
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage:
          locale === "en" ? ["English", "Spanish"] : ["Español", "Inglés"],
      },
    },
  };

  // Breadcrumb items for structured data with translations
  const breadcrumbItems = [
    { name: tBreadcrumbs("home"), url: generateLocalizedUrl(locale, "/") },
    {
      name: tBreadcrumbs("contact"),
      url: generateLocalizedUrl(locale, "/contact"),
    },
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
        pageName={tBreadcrumb("title")}
        description={tBreadcrumb("description")}
      />

      <Contact />
    </>
  );
};

export default ContactPage;
