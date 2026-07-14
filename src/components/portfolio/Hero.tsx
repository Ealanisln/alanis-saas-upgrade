import { getLocale, getTranslations } from "next-intl/server";
import Terminal from "./Terminal";

const fadeDelay = (s: string) => ({ "--fade-delay": s }) as React.CSSProperties;

const Hero = async () => {
  const t = await getTranslations("portfolio.hero");
  const locale = await getLocale();
  const resumeFile =
    locale === "es"
      ? "Emmanuel-Alanis-CV-ES.pdf"
      : "Emmanuel-Alanis-Resume.pdf";

  return (
    <header className="relative bg-gradient-to-b from-[var(--bg-card)] to-[var(--bg)]">
      <div className="hero-dot-grid absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-[1080px] grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-[clamp(32px,5vw,56px)] px-5 pt-12 pb-11 md:px-6 md:pt-[clamp(64px,8vw,104px)] md:pb-[clamp(56px,8vw,96px)]">
        <div>
          <div className="fade-up inline-flex items-center gap-[9px] rounded-full border border-line-2 bg-card py-2 pr-[13px] pl-3 md:gap-2.5 md:pr-[15px] md:pl-[13px]">
            <span className="size-[7px] shrink-0 animate-pulse-dot rounded-full bg-[#16A34A]" />
            <span className="font-mono text-[10.5px] font-medium tracking-[0.06em] text-ink-2 uppercase md:text-[11.5px] md:tracking-[0.07em]">
              {t("badge")}
            </span>
            <span className="h-[11px] w-px bg-line-2 md:h-3" />
            <span className="font-mono text-[10.5px] tracking-[0.06em] text-ink-4 md:text-[11.5px] md:tracking-[0.07em]">
              <span className="md:hidden">{t("badgeZoneShort")}</span>
              <span className="hidden md:inline">{t("badgeZone")}</span>
            </span>
          </div>
          <h1
            className="fade-up mt-5 text-[40px] leading-[1.06] font-bold tracking-[-0.03em] text-ink md:mt-6 md:text-[clamp(38px,4.6vw,56px)] md:leading-[1.04]"
            style={fadeDelay("0.08s")}
          >
            {t("name")}
          </h1>
          <p
            className="fade-up mt-2.5 text-[19px] font-semibold tracking-[-0.01em] text-accent md:mt-3.5 md:text-[clamp(20px,2.6vw,26px)]"
            style={fadeDelay("0.14s")}
          >
            {t("role")}
          </p>
          <p
            className="fade-up mt-4 max-w-[520px] text-[15.5px] leading-[1.65] [text-wrap:pretty] text-ink-3 md:mt-[22px] md:text-[clamp(16px,1.8vw,18px)]"
            style={fadeDelay("0.2s")}
          >
            {t("summary")}
          </p>
          <div
            className="fade-up mt-7 flex flex-col gap-2.5 md:mt-9 md:flex-row md:flex-wrap md:gap-3.5"
            style={fadeDelay("0.26s")}
          >
            <a
              href={`/assets/${resumeFile}`}
              download={resumeFile}
              className="rounded-[10px] bg-accent p-3.5 text-center text-[15px] font-semibold text-white shadow-btn transition-[filter,transform] hover:brightness-[0.92] md:rounded-[9px] md:px-[26px] md:py-[13px] md:hover:-translate-y-px"
            >
              {t("ctaResume")}
            </a>
            <a
              href="#contact"
              className="rounded-[10px] border border-line-2 bg-card p-[13px] text-center text-[15px] font-semibold text-ink transition-[border-color,transform] hover:border-ink-4 md:rounded-[9px] md:px-[26px] md:py-3 md:hover:-translate-y-px"
            >
              {t("ctaContact")}
            </a>
          </div>
        </div>
        <Terminal />
      </div>
    </header>
  );
};

export default Hero;
