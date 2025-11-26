"use client";

import Link from "next/link";
import { Calculator, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";

const CustomQuoteSection = () => {
  const t = useTranslations("plans.pricing.custom");

  return (
    <section className="relative z-10 py-16 md:py-20">
      <div className="container">
        <div
          className="wow fadeInUp rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 px-8 py-12 dark:from-primary/10 dark:to-primary/5 md:px-12 md:py-16"
          data-wow-delay=".1s"
        >
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            {/* Left side - Content */}
            <div>
              <h2 className="mb-4 text-3xl font-bold text-black dark:text-white md:text-4xl">
                {t("title")}
              </h2>
              <p className="mb-6 text-lg text-body-color dark:text-gray-300">
                {t("subtitle")}
              </p>

              <div className="mb-8 space-y-3">
                {(t.raw("features") as string[]).map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        className="fill-primary"
                      >
                        <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" />
                      </svg>
                    </div>
                    <p className="text-body-color dark:text-gray-300">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-90 hover:shadow-signUp"
                >
                  <MessageSquare className="h-5 w-5" />
                  Contact for Quote
                </Link>
              </div>
            </div>

            {/* Right side - Visual/Stats */}
            <div className="lg:pl-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-dark">
                  <div className="mb-2 text-3xl font-bold text-primary">
                    150k+
                  </div>
                  <p className="text-sm text-body-color dark:text-gray-300">
                    MXN Projects
                  </p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-dark">
                  <div className="mb-2 text-3xl font-bold text-primary">
                    99.9%
                  </div>
                  <p className="text-sm text-body-color dark:text-gray-300">
                    Uptime SLA
                  </p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-dark">
                  <div className="mb-2 text-3xl font-bold text-primary">
                    24/7
                  </div>
                  <p className="text-sm text-body-color dark:text-gray-300">
                    Support
                  </p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-dark">
                  <div className="mb-2 text-3xl font-bold text-primary">4+</div>
                  <p className="text-sm text-body-color dark:text-gray-300">
                    SaaS Platforms
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-dark">
                <div className="mb-3 flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold text-black dark:text-white">
                    Tech Stack
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Next.js 15",
                    "React 19",
                    "TypeScript",
                    "PostgreSQL",
                    "Stripe",
                    "Supabase",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomQuoteSection;
