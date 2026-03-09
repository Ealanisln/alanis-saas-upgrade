import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ScrollUp from "@/components/Common/ScrollUp";
import HeroSection from "@/components/Hero/index";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import TechStack from "@/components/TechStack";
import Blog from "@/components/Blog";
import { siteConfig } from "@/config/i18n";
import {
  generateLocalizedUrl,
  getLocaleCode,
  generateAlternates,
} from "@/lib/seo";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: t.raw("meta.keywords"),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      type: "website",
      siteName: "Alanis Dev",
      locale: getLocaleCode(locale),
      images: [
        {
          url: "/og-alanis-web-dev.jpg",
          width: 1200,
          height: 630,
          alt: t("meta.title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta.title"),
      description: t("meta.description"),
      images: ["/og-alanis-web-dev.jpg"],
    },
    alternates: generateAlternates(locale, "/"),
  };
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  // JSON-LD uses only trusted, developer-controlled translation strings
  const jsonLdString = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author,
    description: t("meta.description"),
    url: generateLocalizedUrl(locale, "/"),
    image: `${siteConfig.url}/og-alanis-web-dev.jpg`,
    email: siteConfig.contact.email,
    jobTitle: t("jsonLd.jobTitle"),
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.twitter,
    ],
  });

  return (
    <>
      {/* JSON-LD structured data - content sourced from trusted translation files only */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />

      <ScrollUp />
      <HeroSection locale={locale} />
      <Experience />
      <Projects />
      <TechStack />
      <Blog locale={locale} />

      {/* CTA section */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
              {t("cta.title")}
            </h2>
            <p className="mb-6 text-neutral-600 dark:text-neutral-400">
              {t("cta.description")}
            </p>
            <a
              href={`/${locale}/contact`}
              className="inline-flex items-center font-medium text-primary hover:text-primary/80"
            >
              {t("cta.link")} <span className="ml-1">&rarr;</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
