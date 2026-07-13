import { getTranslations } from "next-intl/server";
import { Eyebrow, SECTION_CONTAINER, SectionTitle } from "./Eyebrow";

const Experience = async () => {
  const t = await getTranslations("portfolio.experience");

  return (
    <section id="experience" className="border-y border-line bg-card">
      <div className={SECTION_CONTAINER}>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <SectionTitle>{t("title")}</SectionTitle>
        <div className="mt-8 flex flex-col md:mt-12">
          {/* Current role — filled dot with accent ring + connector */}
          <div className="grid grid-cols-[16px_1fr] gap-3.5 md:grid-cols-[20px_1fr] md:gap-[clamp(16px,3vw,32px)]">
            <div className="flex flex-col items-center">
              <span className="mt-1.5 size-[11px] shrink-0 rounded-full bg-accent shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_12%,transparent)] md:size-3" />
              <span className="mt-2 w-0.5 flex-1 bg-line" />
            </div>
            <div className="pb-10 md:pb-12">
              <div className="md:flex md:flex-wrap md:items-baseline md:gap-3">
                <h3 className="text-lg leading-[1.3] font-bold tracking-[-0.01em] md:text-xl">
                  {t("job1.title")}
                </h3>
                <p className="mt-1 text-[13px] font-medium text-ink-3 md:mt-0 md:text-[13.5px]">
                  {t("job1.dates")}
                </p>
              </div>
              <p className="mt-2 text-sm font-semibold [text-wrap:pretty] text-accent md:mt-1.5 md:text-[15px]">
                {t("job1.org")}
              </p>
              <p className="mt-3 max-w-[720px] text-[14.5px] leading-[1.65] [text-wrap:pretty] text-ink-2 md:mt-3.5 md:text-[15.5px]">
                {t("job1.desc")}
              </p>
              <ul className="mt-3 flex max-w-[720px] list-disc flex-col gap-2 pl-[18px] text-sm leading-[1.6] text-ink-2 md:mt-3.5 md:pl-5 md:text-[15px]">
                <li className="[text-wrap:pretty]">{t("job1.b1")}</li>
                <li className="[text-wrap:pretty]">{t("job1.b2")}</li>
                <li className="[text-wrap:pretty]">{t("job1.b3")}</li>
              </ul>
            </div>
          </div>

          {/* Prior role — hollow dot */}
          <div className="grid grid-cols-[16px_1fr] gap-3.5 md:grid-cols-[20px_1fr] md:gap-[clamp(16px,3vw,32px)]">
            <div className="flex flex-col items-center">
              <span className="mt-1.5 box-border size-[11px] shrink-0 rounded-full border-2 border-accent bg-card md:size-3" />
            </div>
            <div>
              <div className="md:flex md:flex-wrap md:items-baseline md:gap-3">
                <h3 className="text-lg leading-[1.3] font-bold tracking-[-0.01em] md:text-xl">
                  {t("job2.title")}
                </h3>
                <p className="mt-1 text-[13px] font-medium text-ink-3 md:mt-0 md:text-[13.5px]">
                  {t("job2.dates")}
                </p>
              </div>
              <p className="mt-2 text-sm font-semibold [text-wrap:pretty] text-accent md:mt-1.5 md:text-[15px]">
                {t("job2.org")}
              </p>
              <p className="mt-3 max-w-[720px] text-[14.5px] leading-[1.65] [text-wrap:pretty] text-ink-2 md:mt-3.5 md:text-[15.5px]">
                {t("job2.desc")}
              </p>
              <ul className="mt-3 flex max-w-[720px] list-disc flex-col gap-2 pl-[18px] text-sm leading-[1.6] text-ink-2 md:mt-3.5 md:pl-5 md:text-[15px]">
                <li className="[text-wrap:pretty]">
                  <strong className="font-semibold text-ink">
                    {t("job2.b1Lead")}
                  </strong>{" "}
                  {t("job2.b1")}
                </li>
                <li className="[text-wrap:pretty]">
                  <strong className="font-semibold text-ink">
                    {t("job2.b2Lead")}
                  </strong>{" "}
                  {t("job2.b2")}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
