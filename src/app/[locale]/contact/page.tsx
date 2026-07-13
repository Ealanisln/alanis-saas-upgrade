import { permanentRedirect } from "next/navigation";
import { defaultLocale } from "@/config/i18n";

// The redesign folds Contact into the single-page portfolio (/#contact).
// next.config.js issues the real 308 for crawlers; this stub is the in-app
// fallback and emits the final single-hop shape (/#contact or /es#contact).
export default async function ContactRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(
    locale === defaultLocale ? "/#contact" : `/${locale}#contact`,
  );
}
