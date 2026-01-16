import { cookies } from "next/headers";
import Link from "next/link";

// Translations for 404 page (since we're outside next-intl context)
const translations = {
  en: {
    heading: "404",
    title: "Page Not Found",
    description:
      "Sorry, the page you are looking for doesn't exist or has been moved.",
    backHome: "Go Back Home",
    suggestionsTitle: "Here are some helpful links:",
    links: {
      home: "Home",
      blog: "Blog",
      portfolio: "Portfolio",
      contact: "Contact",
    },
  },
  es: {
    heading: "404",
    title: "Página No Encontrada",
    description:
      "Lo sentimos, la página que buscas no existe o ha sido movida.",
    backHome: "Volver al Inicio",
    suggestionsTitle: "Aquí hay algunos enlaces útiles:",
    links: {
      home: "Inicio",
      blog: "Blog",
      portfolio: "Portafolio",
      contact: "Contacto",
    },
  },
};

export const metadata = {
  title: "Page Not Found | Alanis Dev",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function GlobalNotFound() {
  // Get locale from cookie set by middleware
  const cookieStore = await cookies();
  const locale = (cookieStore.get("x-locale")?.value || "en") as "en" | "es";
  const t = translations[locale] || translations.en;

  // Determine the correct home URL based on locale
  const homeUrl = locale === "es" ? "/es" : "/";
  const blogUrl = locale === "es" ? "/es/blog" : "/blog";
  const portfolioUrl = locale === "es" ? "/es/portfolio" : "/portfolio";
  const contactUrl = locale === "es" ? "/es/contact" : "/contact";

  const helpfulLinks = [
    { href: homeUrl, label: t.links.home },
    { href: blogUrl, label: t.links.blog },
    { href: portfolioUrl, label: t.links.portfolio },
    { href: contactUrl, label: t.links.contact },
  ];

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-4 dark:bg-gray-dark">
      <div className="mx-auto max-w-[550px] text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <svg
            className="mx-auto h-32 w-32 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* 404 Heading */}
        <h1 className="mb-4 text-8xl font-bold text-primary">{t.heading}</h1>

        {/* Title */}
        <h2 className="mb-4 text-2xl font-semibold text-black dark:text-white sm:text-3xl">
          {t.title}
        </h2>

        {/* Description */}
        <p className="mb-8 text-base text-body-color dark:text-body-color-dark">
          {t.description}
        </p>

        {/* Go Back Home Button */}
        <div className="mb-10">
          <Link
            href={homeUrl}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-center text-base font-medium text-white transition duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t.backHome}
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="border-t border-stroke pt-8 dark:border-stroke-dark">
          <p className="mb-4 text-sm font-medium text-body-color dark:text-body-color-dark">
            {t.suggestionsTitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {helpfulLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-primary transition duration-300 hover:text-primary/80 hover:underline dark:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
