import { getTranslations } from "next-intl/server";
import { Eyebrow, SectionTitle } from "./Eyebrow";

const About = async () => {
  const t = await getTranslations("portfolio.about");

  return (
    <section
      id="about"
      className="mx-auto max-w-[1080px] px-5 py-14 md:px-6 md:py-[clamp(64px,9vw,112px)]"
    >
      <div className="grid grid-cols-1 gap-[22px] md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] md:gap-[clamp(28px,5vw,64px)]">
        <div>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <SectionTitle className="leading-[1.18] md:leading-[1.15]">
            {t("title")}
          </SectionTitle>
        </div>
        <div className="flex flex-col gap-4 text-[15.5px] leading-[1.7] text-ink-2 md:gap-[18px] md:text-[16.5px]">
          <p className="[text-wrap:pretty]">{t("p1")}</p>
          <p className="[text-wrap:pretty]">{t("p2")}</p>
          <p className="[text-wrap:pretty]">{t("p3")}</p>
        </div>
      </div>
    </section>
  );
};

export default About;
