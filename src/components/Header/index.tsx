// src/components/Header/index.tsx

"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggler from "./ThemeToggler";

const Header = () => {
  const t = useTranslations("navigation");

  // Memoized menu data with translations - prevents unnecessary recreations
  const menuData = useMemo(
    () => [
      { id: 1, title: t("home"), path: "/", newTab: false },
      { id: 2, title: t("about"), path: "/about", newTab: false },
      { id: 3, title: t("portfolio"), path: "/portfolio", newTab: false },
      { id: 4, title: t("blog"), path: "/blog", newTab: false },
      { id: 5, title: t("plans"), path: "/plans", newTab: false },
      { id: 6, title: t("contact"), path: "/contact", newTab: false },
    ],
    [t],
  );

  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  // Close the menu when a link is clicked
  const handleLinkClick = () => {
    setNavbarOpen(false);
  };

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const _handleSubmenu = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  const usePathName = usePathname();

  return (
    <>
      <header
        className={`header left-0 top-0 z-40 flex w-full items-center ${
          sticky
            ? "fixed z-[9999] bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm transition dark:bg-gray-dark dark:shadow-sticky-dark"
            : "relative bg-transparent"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4 xl:mr-12">
              <Link
                href="/"
                className={`header-logo block w-full ${
                  sticky ? "py-6 lg:py-3" : "py-8"
                } `}
              >
                <Image
                  src="/images/logo/logo-dark.svg"
                  alt="logo"
                  width={140}
                  height={30}
                  className="w-full dark:hidden"
                />
                <Image
                  src="/images/logo/logo.svg"
                  alt="logo"
                  width={140}
                  height={30}
                  className="hidden w-full dark:block"
                />
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div>
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "top-[7px] rotate-45" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "opacity-0" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "top-[-8px] -rotate-45" : " "
                    }`}
                  />
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    navbarOpen
                      ? "visibility top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-12">
                    {menuData.map((menuItem, index) => (
                      <li key={index} className="group relative">
                        <Link
                          href={menuItem.path}
                          onClick={handleLinkClick}
                          className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
                            usePathName === menuItem.path
                              ? "text-primary dark:text-white"
                              : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                          }`}
                        >
                          {menuItem.title}
                        </Link>
                      </li>
                    ))}
                    {/* Language Switcher in Mobile Menu */}
                    <li className="mt-2 border-t border-body-color/20 pt-4 lg:hidden">
                      <LanguageSwitcher />
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="flex items-center justify-end pr-4 lg:pr-0">
                <div className="pl-0 pr-16 lg:px-4">
                  <ThemeToggler />
                </div>
                <div className="hidden px-4 lg:block">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
