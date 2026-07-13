import { getTranslations } from "next-intl/server";
import { Eyebrow, SECTION_CONTAINER, SectionTitle } from "./Eyebrow";

const READYSET_CHIPS = [
  "Next.js 15",
  "React 19",
  "TypeScript",
  "PostgreSQL · Prisma · Supabase · PostGIS",
  "Stripe",
  "Twilio",
  "Mapbox",
];

const DESTINO_CHIPS = [
  "Next.js 15",
  "React 19",
  "TypeScript",
  "PostgreSQL · Prisma · Supabase",
  "Square",
  "Shippo",
];

/** Neutral placeholder block until real product screenshots are provided. */
const ImageSlot = ({
  aspect,
  radius,
  className = "",
}: {
  aspect: string;
  radius: string;
  className?: string;
}) => (
  <div
    aria-hidden="true"
    className={`w-full border border-line bg-slot ${aspect} ${radius} ${className}`}
  />
);

const TechChips = ({ chips }: { chips: string[] }) => (
  <div className="mt-auto flex flex-wrap gap-1.5 md:gap-[7px]">
    {chips.map((chip) => (
      <span
        key={chip}
        className="rounded-full bg-soft px-2.5 py-1 text-xs font-medium text-ink-2 md:px-[11px] md:text-[12.5px]"
      >
        {chip}
      </span>
    ))}
  </div>
);

const Projects = async () => {
  const t = await getTranslations("portfolio.projects");

  const secondaryCard =
    "flex flex-col gap-[13px] rounded-2xl border border-line bg-card p-5 md:gap-3.5 md:p-[clamp(22px,3vw,30px)] md:transition-[transform,box-shadow] md:duration-[0.18s] md:hover:-translate-y-0.5 md:hover:shadow-card-hover";

  return (
    <section id="projects" className={SECTION_CONTAINER}>
      <Eyebrow>{t("eyebrow")}</Eyebrow>
      <SectionTitle>{t("title")}</SectionTitle>

      {/* Flagship card */}
      <div className="mt-7 flex flex-col gap-3.5 rounded-2xl border border-line bg-card p-5 shadow-card md:mt-10 md:grid md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] md:items-start md:gap-[clamp(24px,4vw,44px)] md:p-[clamp(24px,4vw,40px)]">
        <div className="contents md:flex md:flex-col md:gap-4">
          <div className="flex flex-wrap items-center gap-2 md:gap-2.5">
            <span className="rounded-full bg-accent px-[11px] py-[5px] text-[11.5px] font-semibold tracking-[0.06em] text-white uppercase md:px-3 md:text-xs">
              {t("flagship")}
            </span>
            <span className="rounded-full bg-[rgba(22,163,74,0.09)] px-[11px] py-[5px] text-[11.5px] font-semibold text-[#15803D] md:px-3 md:text-xs">
              {t("regulated")}
            </span>
          </div>
          <h3 className="text-xl leading-[1.25] font-bold tracking-[-0.015em] md:text-[clamp(22px,2.6vw,27px)]">
            {t("p1.title")}
          </h3>
          {/* Mobile order: image sits between title and description */}
          <ImageSlot
            aspect="aspect-[4/3]"
            radius="rounded-xl"
            className="md:hidden"
          />
          <p className="text-[15px] leading-[1.65] [text-wrap:pretty] text-ink-2 md:text-base md:leading-[1.7]">
            {t("p1.desc")}
          </p>
          <ul className="flex list-disc flex-col gap-[7px] pl-[18px] text-sm leading-[1.6] text-ink-2 md:pl-5 md:text-[15px]">
            <li>{t("p1.b1")}</li>
            <li>{t("p1.b2")}</li>
            <li>{t("p1.b3")}</li>
          </ul>
          <span className="text-[13.5px] font-semibold text-ink-3 md:text-sm">
            {t("caseStudy")}
          </span>
        </div>
        <ImageSlot
          aspect="aspect-[4/3]"
          radius="rounded-xl"
          className="hidden md:block"
        />
      </div>

      {/* Secondary cards */}
      <div className="mt-[18px] flex flex-col gap-[18px] md:mt-5 md:grid md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] md:gap-5">
        <div className={secondaryCard}>
          <ImageSlot aspect="aspect-[16/10]" radius="rounded-[10px]" />
          <h3 className="text-lg leading-[1.3] font-bold tracking-[-0.01em] md:text-[19px]">
            {t("p2.title")}
          </h3>
          <p className="text-sm leading-[1.65] [text-wrap:pretty] text-ink-2 md:text-[14.5px]">
            {t("p2.desc")}
          </p>
          <TechChips chips={READYSET_CHIPS} />
          <span className="text-[13px] font-semibold text-ink-3 md:text-[13.5px]">
            {t("caseStudy")}
          </span>
        </div>
        <div className={secondaryCard}>
          <ImageSlot aspect="aspect-[16/10]" radius="rounded-[10px]" />
          <h3 className="text-lg leading-[1.3] font-bold tracking-[-0.01em] md:text-[19px]">
            {t("p3.title")}
          </h3>
          <p className="text-sm leading-[1.65] [text-wrap:pretty] text-ink-2 md:text-[14.5px]">
            {t("p3.desc")}
          </p>
          <TechChips chips={DESTINO_CHIPS} />
          <span className="text-[13px] font-semibold text-ink-3 md:text-[13.5px]">
            {t("caseStudy")}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Projects;
