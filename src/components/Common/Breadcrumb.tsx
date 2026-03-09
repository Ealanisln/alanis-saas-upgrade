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
    <section className="border-b border-t-border pb-8 pt-28 lg:pb-12 lg:pt-[150px]">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <nav className="mb-4">
            <ul className="flex items-center gap-2 text-sm">
              <li>
                <Link href="/" className="text-t-muted hover:text-t-primary">
                  {t("home")}
                </Link>
              </li>
              <li className="text-t-muted/50">/</li>
              <li className="text-t-primary">{pageName}</li>
            </ul>
          </nav>
          <h1 className="mb-3 font-heading text-3xl font-bold text-t-text sm:text-4xl">
            {pageName}
          </h1>
          <p className="text-lg text-t-muted">{description}</p>
        </div>
      </div>
    </section>
  );
};

export default Breadcrumb;
