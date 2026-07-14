import { permanentRedirect } from "next/navigation";
import { defaultLocale } from "@/config/i18n";

// The redesign folds About into the single-page portfolio (/#about).
// next.config.js issues the real 308 for crawlers; this stub is the in-app
// fallback and emits the final single-hop shape (/#about or /es#about).
export default async function AboutRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(locale === defaultLocale ? "/#about" : `/${locale}#about`);
}
