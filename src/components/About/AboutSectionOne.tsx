import { getTranslations } from "next-intl/server";

const AboutSectionOne = async () => {
  const t = await getTranslations("about");

  const stats = [
    { value: t("stats.projects.value"), label: t("stats.projects.label") },
    { value: t("stats.commits.value"), label: t("stats.commits.label") },
    { value: t("stats.languages.value"), label: t("stats.languages.label") },
  ];

  return (
    <section id="about" className="py-16 md:py-20 lg:py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <p className="mb-6 text-lg leading-relaxed text-t-muted">
            {t("hero.intro")}
          </p>
          <p className="mb-10 text-lg leading-relaxed text-t-muted">
            {t("hero.focus")}
          </p>

          <div className="grid grid-cols-3 gap-4 rounded-lg border border-t-border bg-t-surface p-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-2xl font-bold text-t-primary sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-t-muted sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionOne;
