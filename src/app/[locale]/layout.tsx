import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import {
  getTranslations,
  getMessages,
  setRequestLocale,
} from "next-intl/server";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LanguageConfirmation from "@/components/LanguageConfirmation";
import { routing } from "@/i18n/routing";
import { generateAlternates } from "@/lib/seo";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale - return empty metadata for invalid locales
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "home" });

  return {
    metadataBase: new URL("https://alanis.dev"),
    title: {
      default: t("meta.title"),
      template: `%s | Alanis Dev`,
    },
    description: t("meta.description"),
    keywords: t.raw("meta.keywords"),
    authors: [{ name: "Alanis Dev" }],
    creator: "Alanis Dev",
    publisher: "Alanis Dev",
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-icon.png",
    },
    alternates: generateAlternates(locale, "/"),
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "es_ES",
      url: `https://alanis.dev${locale === "en" ? "" : `/${locale}`}`,
      siteName: "Alanis Dev",
      title: t("meta.title"),
      description: t("meta.description"),
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
      creator: "@ealanisln",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale - show 404 for invalid locales (e.g., /about being caught as locale='about')
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client side with explicit locale
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <LanguageConfirmation />
    </NextIntlClientProvider>
  );
}
