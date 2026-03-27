import { getTranslations } from "next-intl/server";

const cardIcons = {
  saas: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  ecommerce: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <path d="M1 10h22" />
    </svg>
  ),
  logistics: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 18V6a2 2 0 00-2-2H4a2 2 0 00-2 2v11a1 1 0 001 1h2" />
      <path d="M15 18h2a1 1 0 001-1v-3.65a1 1 0 00-.22-.624l-3.48-4.35A1 1 0 0013.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  ),
  ai: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z" />
    </svg>
  ),
};

const cardKeys = ["saas", "ecommerce", "logistics", "ai"] as const;

const AboutSectionTwo = async () => {
  const t = await getTranslations("about.section");

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-[620px] text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold text-t-text sm:text-4xl">
            {t("title")}
          </h2>
          <p className="text-t-muted">{t("description")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {cardKeys.map((key) => (
            <div
              key={key}
              className="rounded-lg border border-t-border bg-t-surface p-6 transition-shadow duration-150 hover:shadow-card-hover"
            >
              <div className="bg-t-primary/10 mb-4 flex h-10 w-10 items-center justify-center rounded-md text-t-primary">
                {cardIcons[key]}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-t-text">
                {t(`cards.${key}.title`)}
              </h3>
              <p className="mb-3 text-sm leading-relaxed text-t-muted">
                {t(`cards.${key}.description`)}
              </p>
              <p className="text-t-muted/70 text-xs leading-relaxed">
                {t(`cards.${key}.example`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSectionTwo;
