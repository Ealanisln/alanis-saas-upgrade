import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "../index";

// Mock useTransition for the FooterLanguageSwitcher
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useTransition: () => [false, vi.fn((callback: () => void) => callback())],
  };
});

// Mock next/navigation for FooterLanguageSwitcher
vi.mock("next/navigation", () => ({
  useParams: () => ({}),
}));

// Mock next-intl for Footer and FooterLanguageSwitcher
vi.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string) => key,
}));

// Mock navigation for FooterLanguageSwitcher
vi.mock("@/lib/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    replace: vi.fn(),
  }),
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock i18n config for FooterLanguageSwitcher
vi.mock("@/config/i18n", () => ({
  locales: ["en", "es"] as const,
  defaultLocale: "en",
  localeConfig: {
    en: { name: "English", flag: "🇺🇸" },
    es: { name: "Español", flag: "🇪🇸" },
  },
  siteConfig: {
    author: "Emmanuel Alanis",
    social: {
      github: "https://github.com/Ealanisln",
      linkedin: "https://www.linkedin.com/in/emmanuel-alanis/",
    },
  },
}));

describe("Footer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the footer element", () => {
      render(<Footer />);
      const footer = document.querySelector("footer");
      expect(footer).toBeInTheDocument();
    });

    it("renders section headings", () => {
      render(<Footer />);
      const headings = document.querySelectorAll("footer h3");
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe("social media links", () => {
    it("has GitHub link", () => {
      render(<Footer />);
      const githubLink = document.querySelector('a[aria-label="GitHub"]');
      expect(githubLink).toBeInTheDocument();
    });

    it("has LinkedIn link", () => {
      render(<Footer />);
      const linkedinLink = document.querySelector('a[aria-label="LinkedIn"]');
      expect(linkedinLink).toBeInTheDocument();
    });
  });

  describe("navigation links", () => {
    it("has blog link", () => {
      render(<Footer />);
      const blogLink = document.querySelector('a[href="/blog"]');
      expect(blogLink).toBeInTheDocument();
    });

    it("has about link", () => {
      render(<Footer />);
      const aboutLink = document.querySelector('a[href="/about"]');
      expect(aboutLink).toBeInTheDocument();
    });

    it("has contact link", () => {
      render(<Footer />);
      const contactLink = document.querySelector('a[href="/contact"]');
      expect(contactLink).toBeInTheDocument();
    });
  });

  describe("copyright", () => {
    it("displays copyright with current year", () => {
      render(<Footer />);
      const currentYear = new Date().getFullYear().toString();
      const footer = document.querySelector("footer");
      expect(footer?.textContent).toContain(currentYear);
    });
  });

  describe("language switcher integration", () => {
    it("renders language switcher in footer", () => {
      render(<Footer />);
      expect(screen.getByText("English")).toBeInTheDocument();
      expect(screen.getByText("Español")).toBeInTheDocument();
    });

    it("language switcher has separator between languages", () => {
      render(<Footer />);
      expect(screen.getByText("|")).toBeInTheDocument();
    });

    it("current language is highlighted", () => {
      render(<Footer />);
      const englishButton = screen.getByText("English");
      expect(englishButton.className).toContain("text-primary");
    });

    it("language buttons have accessible labels", () => {
      render(<Footer />);
      expect(screen.getByLabelText("Switch to English")).toBeInTheDocument();
      expect(screen.getByLabelText("Switch to Español")).toBeInTheDocument();
    });
  });
});
