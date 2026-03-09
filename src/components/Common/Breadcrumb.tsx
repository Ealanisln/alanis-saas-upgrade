"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";

const Breadcrumb = ({
  pageName,
  description,
}: {
  pageName: string;
  description: string;
}) => {
  const t = useTranslations("common");
  return (
    <section className="border-b border-neutral-200 pb-8 pt-28 dark:border-neutral-800 lg:pb-12 lg:pt-[150px]">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-[570px]">
            <h1 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">
              {pageName}
            </h1>
            <p className="text-base text-neutral-600 dark:text-neutral-400">
              {description}
            </p>
          </div>
          <nav>
            <ul className="flex items-center gap-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-neutral-500 hover:text-primary dark:text-neutral-400"
                >
                  {t("home")}
                </Link>
              </li>
              <li className="text-neutral-400 dark:text-neutral-600">/</li>
              <li className="text-primary">{pageName}</li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default Breadcrumb;
