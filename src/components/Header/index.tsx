"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggler from "./ThemeToggler";

const Header = () => {
  const t = useTranslations("navigation");

  const menuData = useMemo(
    () => [
      { id: 1, title: t("home"), path: "/" },
      { id: 2, title: t("about"), path: "/about" },
      { id: 3, title: t("blog"), path: "/blog" },
      { id: 4, title: t("contact"), path: "/contact" },
    ],
    [t],
  );

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY >= 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`left-0 top-0 z-40 flex w-full items-center transition-all duration-150 ${
        sticky
          ? "bg-t-bg/80 fixed z-[9999] border-b border-t-border backdrop-blur-md"
          : "relative bg-transparent"
      }`}
    >
      <div className="container">
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="block">
            <Image
              src="/images/logo/logo-dark.svg"
              alt="logo"
              width={120}
              height={26}
              className="dark:hidden"
            />
            <Image
              src="/images/logo/logo.svg"
              alt="logo"
              width={120}
              height={26}
              className="hidden dark:block"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {menuData.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className={`rounded-md px-3 py-1.5 font-mono text-sm transition-colors duration-150 ${
                  pathname === item.path
                    ? "bg-t-surface text-t-primary"
                    : "text-t-muted hover:bg-t-surface hover:text-t-text"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggler />
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-t-muted transition-colors hover:bg-t-surface hover:text-t-text lg:hidden"
              aria-label="Mobile Menu"
            >
              {navbarOpen ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M2 4h12M2 8h12M2 12h12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {navbarOpen && (
          <nav className="border-t border-t-border pb-4 lg:hidden">
            <ul className="flex flex-col gap-1 pt-3">
              {menuData.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.path}
                    onClick={() => setNavbarOpen(false)}
                    className={`block rounded-md px-3 py-2 font-mono text-sm transition-colors ${
                      pathname === item.path
                        ? "bg-t-surface text-t-primary"
                        : "text-t-muted hover:bg-t-surface hover:text-t-text"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              <li className="mt-2 border-t border-t-border pt-3">
                <LanguageSwitcher />
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
