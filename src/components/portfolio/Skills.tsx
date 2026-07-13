import { getTranslations } from "next-intl/server";
import { Eyebrow, SectionTitle } from "./Eyebrow";

interface SkillGroup {
  name: string;
  items: string[];
}

const Skills = async () => {
  const t = await getTranslations("portfolio.skills");
  const groups = t.raw("groups") as SkillGroup[];

  return (
    <section id="skills" className="border-y border-line bg-card">
      <div className="mx-auto max-w-[1080px] px-5 py-14 md:px-6 md:py-[clamp(64px,9vw,112px)]">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <SectionTitle>{t("title")}</SectionTitle>
        <div className="mt-8 flex flex-col gap-[26px] md:mt-11 md:grid md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] md:gap-[clamp(24px,4vw,40px)]">
          {groups.map((group) => (
            <div
              key={group.name}
              className="flex flex-col gap-[11px] border-t-2 border-accent pt-3.5 md:gap-3 md:pt-4"
            >
              <h3 className="text-[13px] font-bold uppercase tracking-[0.05em] text-ink md:text-sm">
                {group.name}
              </h3>
              {/* Chips on mobile, plain stacked list on desktop */}
              <div className="flex flex-wrap gap-1.5 md:hidden">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-soft px-3 py-[5px] text-[13px] font-medium text-ink-2"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="hidden md:flex md:flex-col md:gap-[7px]">
                {group.items.map((skill) => (
                  <span key={skill} className="text-[14.5px] text-ink-2">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
