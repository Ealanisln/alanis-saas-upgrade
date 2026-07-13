import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const revalidate = 60;
import About from "@/components/portfolio/About";
import BlogSection from "@/components/portfolio/BlogSection";
import Contact from "@/components/portfolio/Contact";
import Experience from "@/components/portfolio/Experience";
import Hero from "@/components/portfolio/Hero";
import Projects from "@/components/portfolio/Projects";
import Skills from "@/components/portfolio/Skills";
import Stats from "@/components/portfolio/Stats";
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
  const jsonLd = {
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
  };

  return (
    <>
      {/* JSON-LD structured data - content sourced from trusted translation files only */}
      <script
        type="application/ld+json"
        // Values are developer-controlled translation strings; the <
        // escaping keeps the pattern safe if a value ever becomes CMS-sourced
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Hero />
      <Stats />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <BlogSection locale={locale} />
      <Contact />
    </>
  );
}
