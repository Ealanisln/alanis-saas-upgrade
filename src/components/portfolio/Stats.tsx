import { getTranslations } from "next-intl/server";

const Stats = async () => {
  const t = await getTranslations("portfolio.stats");

  return (
    <section className="border-y border-line bg-card">
      <div className="mx-auto grid max-w-[1080px] grid-cols-2 gap-x-[18px] gap-y-[22px] px-5 py-7 md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] md:gap-[clamp(24px,4vw,48px)] md:px-6 md:py-[clamp(36px,5vw,56px)]">
        {([1, 2, 3, 4] as const).map((n) => (
          <div key={n} className="flex flex-col gap-1 md:gap-1.5">
            <span className="text-2xl font-bold tracking-[-0.02em] text-ink md:text-[clamp(26px,3vw,32px)]">
              {t(`stat${n}Value`)}
            </span>
            <span className="text-[13px] leading-normal text-ink-3 [text-wrap:pretty] md:text-sm">
              {t(`stat${n}`)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
