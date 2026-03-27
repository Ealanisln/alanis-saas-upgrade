"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";

export const PageNotFound = () => {
  const t = useTranslations("common");

  const helpfulLinks = [
    { href: "/", label: t("notFound.suggestions.home") },
    { href: "/blog", label: t("notFound.suggestions.blog") },
    { href: "/contact", label: t("notFound.suggestions.contact") },
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
        <h1 className="mb-4 text-8xl font-bold text-primary">
          {t("notFound.heading")}
        </h1>

        {/* Title */}
        <h2 className="mb-4 text-2xl font-semibold text-black dark:text-white sm:text-3xl">
          {t("notFound.title")}
        </h2>

        {/* Description */}
        <p className="mb-8 text-base text-body-color dark:text-body-color-dark">
          {t("notFound.description")}
        </p>

        {/* Go Back Home Button */}
        <div className="mb-10">
          <Link
            href="/"
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
            {t("notFound.backHome")}
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="border-t border-stroke pt-8 dark:border-stroke-dark">
          <p className="mb-4 text-sm font-medium text-body-color dark:text-body-color-dark">
            {t("notFound.suggestions.title")}
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
};
