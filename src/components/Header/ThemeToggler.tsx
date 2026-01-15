"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("navigation");

  // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional one-time hydration check
  useEffect(() => setMounted(true), []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9 md:h-14 md:w-14" />;
  }

  const themes = [
    { value: "light", label: t("lightMode"), icon: SunIcon },
    { value: "dark", label: t("darkMode"), icon: MoonIcon },
    { value: "system", label: t("systemMode"), icon: SystemIcon },
  ];

  const currentTheme = themes.find((t) => t.value === theme) || themes[2];
  const CurrentIcon = currentTheme.icon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        data-testid="theme-toggle-button"
        aria-label="theme toggler"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-2 dark:bg-dark-bg flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-black dark:text-white md:h-14 md:w-14"
      >
        <CurrentIcon className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {isOpen && (
        <div
          data-testid="theme-dropdown"
          className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            return (
              <button
                key={themeOption.value}
                data-testid={`theme-option-${themeOption.value}`}
                onClick={() => {
                  setTheme(themeOption.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  theme === themeOption.value
                    ? "bg-gray-100 font-medium text-primary dark:bg-gray-700"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {themeOption.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Sun icon for light mode
const SunIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

// Moon icon for dark mode
const MoonIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// System/Computer icon for system mode
const SystemIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

export default ThemeToggler;
