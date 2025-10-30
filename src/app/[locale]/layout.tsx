import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, getMessages } from 'next-intl/server';
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { locales } from '@/config/i18n';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  
  return {
    metadataBase: new URL('https://alanis.dev'),
    title: {
      default: t('meta.title'),
      template: `%s | Alanis Dev`
    },
    description: t('meta.description'),
    keywords: ["desarrollo web", "programación", "javascript", "typescript", "react", "next.js", "full-stack"],
    authors: [{ name: "Alanis Dev" }],
    creator: "Alanis Dev",
    publisher: "Alanis Dev",
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-icon.png",
    },
    alternates: {
      canonical: locale === 'en' ? '/' : `/${locale}`,
      languages: {
        'en-US': '/',
        'es-ES': '/es',
      },
    },
    openGraph: {
      type: "website",
      locale: locale === 'en' ? "en_US" : "es_ES",
      url: `https://alanis.dev${locale === 'en' ? '' : `/${locale}`}`,
      siteName: "Alanis Dev",
      title: t('meta.title'),
      description: t('meta.description'),
      images: [
        {
          url: "/og-alanis-web-dev.jpg",
          width: 1200,
          height: 630,
          alt: t('meta.title'),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t('meta.title'),
      description: t('meta.description'),
      images: ["/og-alanis-web-dev.jpg"],
      creator: "@ealanisln",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: "verification_token", // Replace with your actual verification token
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const { locale: _locale } = await params;
  
  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </NextIntlClientProvider>
  );
} 