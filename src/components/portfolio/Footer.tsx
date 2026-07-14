import Image from "next/image";
import { getTranslations } from "next-intl/server";

const FOOTER_LINKS = [
  { label: "GitHub", href: "https://github.com/Ealanisln", external: true },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ealanis/",
    external: true,
  },
  {
    label: "emmanuel@alanis.dev",
    href: "mailto:emmanuel@alanis.dev",
    external: false,
  },
];

const Footer = async () => {
  const t = await getTranslations("portfolio");

  return (
    <footer className="border-t border-[var(--footer-line)] bg-[var(--footer-bg)]">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-[18px] px-5 py-8 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-5 md:px-6 md:py-10">
        <div className="flex items-center gap-[18px]">
          <Image
            src="/assets/logo-light.png"
            alt={t("nav.logoAlt")}
            width={97}
            height={26}
            className="block h-6 w-auto self-start md:h-[26px] md:self-auto"
          />
          <span className="hidden text-[13.5px] text-ink-4 md:inline">
            {t("footer.copy")}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-[18px]">
          {FOOTER_LINKS.map(({ label, href, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener" } : {})}
              className="text-[13.5px] font-medium text-[#C6CBD4] transition-colors hover:text-white"
            >
              {label}
            </a>
          ))}
        </div>
        <span className="text-[13px] text-ink-4 md:hidden">
          {t("footer.copy")}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
