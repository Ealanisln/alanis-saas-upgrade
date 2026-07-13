"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { defaultLocale } from "@/config/i18n";
import { usePathname, useRouter } from "@/lib/navigation";
import {
  CloseIcon,
  GlobeIcon,
  HamburgerIcon,
  MoonIcon,
  SunIcon,
} from "./icons";

const SECTIONS = ["about", "experience", "projects", "skills", "blog"] as const;

// Pure hash links on the home page keep smooth scrolling. From other pages
// (e.g. /blog) these are plain <a> full navigations on purpose: the App
// Router's client-side navigation does not scroll to the URL hash, while the
// browser's initial-load handling does.
const NavAnchor = ({
  id,
  homeHref,
  className,
  onClick,
  children,
}: {
  id: string;
  homeHref: string | null;
  className: string;
  onClick?: () => void;
  children: React.ReactNode;
}) => (
  <a
    href={homeHref === null ? `#${id}` : `${homeHref}#${id}`}
    className={className}
    onClick={onClick}
  >
    {children}
  </a>
);

const Nav = () => {
  const t = useTranslations("portfolio.nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";
  // null on the home page (pure hash anchors); otherwise the locale-prefixed
  // home path, matching the router's `as-needed` prefix strategy
  const homeHref = isHome
    ? null
    : locale === defaultLocale
      ? "/"
      : `/${locale}`;

  // The root layout stamps <html lang> from the request cookie; a client-side
  // locale switch is a soft navigation that never re-renders it, so sync here.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  const toggleLocale = () =>
    router.replace(pathname, { locale: locale === "en" ? "es" : "en" });

  const iconButton =
    "inline-flex cursor-pointer items-center justify-center rounded-[10px] border border-line-2 bg-card text-ink-3 transition-colors hover:border-ink-4 hover:text-ink md:rounded-lg";

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-[var(--nav-bg)] backdrop-blur-[12px]">
      <div className="mx-auto flex h-[60px] max-w-[1080px] items-center justify-between gap-2.5 px-[18px] md:h-[68px] md:gap-4 md:px-6">
        {/* Logo — dark chip on desktop, bare wordmark on mobile */}
        <NavAnchor
          homeHref={homeHref}
          id="top"
          className="flex shrink-0 items-center"
        >
          <span className="hidden items-center rounded-lg border border-[var(--chip-line)] bg-[var(--chip-bg)] pt-[7px] pr-3 pb-[5px] pl-3 md:inline-flex">
            <Image
              src="/assets/logo-light.svg"
              alt={t("logoAlt")}
              width={107}
              height={24}
              priority
              className="block h-6 w-auto"
            />
          </span>
          <Image
            src="/assets/logo-dark.svg"
            alt={t("logoAlt")}
            width={107}
            height={24}
            priority
            className="block h-6 w-auto md:hidden dark:hidden"
          />
          <Image
            src="/assets/logo-light.svg"
            alt={t("logoAlt")}
            width={107}
            height={24}
            priority
            className="hidden h-6 w-auto max-md:dark:block"
          />
        </NavAnchor>

        <div className="flex items-center gap-2 md:gap-6">
          {/* Desktop text links */}
          <div className="hidden items-center gap-[22px] md:flex">
            {SECTIONS.map((id) => (
              <NavAnchor
                homeHref={homeHref}
                key={id}
                id={id}
                className="text-sm font-medium text-ink-3 transition-colors hover:text-ink"
              >
                {t(id)}
              </NavAnchor>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLocale}
              aria-label={t("langAria")}
              title={t("langAria")}
              className={`${iconButton} h-11 min-w-11 gap-1.5 px-2.5 md:h-9 md:min-w-0 md:gap-[5px] md:px-[9px]`}
            >
              <GlobeIcon className="size-[15px] md:size-3.5" />
              <span className="text-xs font-bold tracking-[0.05em] md:text-[11.5px]">
                {locale.toUpperCase()}
              </span>
            </button>
            <button
              onClick={toggleTheme}
              aria-label={t("themeAria")}
              title={t("themeAria")}
              className={`${iconButton} size-11 md:size-9`}
            >
              <MoonIcon className="size-[17px] md:size-4 dark:hidden" />
              <SunIcon className="hidden size-[17px] md:size-4 dark:block" />
            </button>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={t("menuAria")}
              aria-expanded={menuOpen}
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-[10px] border border-line-2 bg-card text-ink md:hidden"
            >
              {menuOpen ? (
                <CloseIcon className="size-[18px]" />
              ) : (
                <HamburgerIcon className="size-[18px]" />
              )}
            </button>
          </div>

          {/* Desktop CTA */}
          <NavAnchor
            homeHref={homeHref}
            id="contact"
            className="hidden rounded-lg bg-accent px-[18px] py-[9px] text-sm font-semibold text-white transition-[filter] hover:brightness-[0.92] md:inline-block"
          >
            {t("cta")}
          </NavAnchor>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="flex animate-menu-in flex-col gap-0.5 border-t border-line px-[18px] pt-1.5 pb-4 md:hidden">
          {SECTIONS.map((id) => (
            <NavAnchor
              homeHref={homeHref}
              key={id}
              id={id}
              onClick={() => setMenuOpen(false)}
              className="border-b border-line px-0.5 py-3 text-base font-semibold text-ink"
            >
              {t(id)}
            </NavAnchor>
          ))}
          <NavAnchor
            homeHref={homeHref}
            id="contact"
            onClick={() => setMenuOpen(false)}
            className="mt-3.5 rounded-[10px] bg-accent p-[13px] text-center text-[15px] font-semibold text-white"
          >
            {t("cta")}
          </NavAnchor>
        </div>
      )}
    </nav>
  );
};

export default Nav;
