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

    it("renders logo images", () => {
      render(<Footer />);
      const logos = screen.getAllByAltText("logo");
      expect(logos.length).toBeGreaterThan(0);
    });

    it("renders section headings", () => {
      render(<Footer />);
      const headings = document.querySelectorAll("footer h2");
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe("social media links", () => {
    it("renders social media links with aria-labels", () => {
      render(<Footer />);
      const socialLinks = document.querySelectorAll(
        'a[aria-label="social-link"]',
      );
      expect(socialLinks.length).toBeGreaterThan(0);
    });

    it("has Facebook link", () => {
      render(<Footer />);
      const facebookLink = document.querySelector('a[href*="facebook"]');
      expect(facebookLink).toBeInTheDocument();
    });

    it("has Twitter link", () => {
      render(<Footer />);
      const twitterLink = document.querySelector('a[href*="twitter"]');
      expect(twitterLink).toBeInTheDocument();
    });

    it("has Instagram link", () => {
      render(<Footer />);
      const instagramLink = document.querySelector('a[href*="instagram"]');
      expect(instagramLink).toBeInTheDocument();
    });

    it("has LinkedIn link", () => {
      render(<Footer />);
      const linkedinLink = document.querySelector('a[href*="linkedin"]');
      expect(linkedinLink).toBeInTheDocument();
    });
  });

  describe("navigation links", () => {
    it("has blog link", () => {
      render(<Footer />);
      const blogLink = document.querySelector('a[href="/blog"]');
      expect(blogLink).toBeInTheDocument();
    });

    it("has plans link", () => {
      render(<Footer />);
      const plansLink = document.querySelector('a[href="/plans"]');
      expect(plansLink).toBeInTheDocument();
    });

    it("has about link", () => {
      render(<Footer />);
      const aboutLink = document.querySelector('a[href="/about"]');
      expect(aboutLink).toBeInTheDocument();
    });

    it("has terms link", () => {
      render(<Footer />);
      const termsLink = document.querySelector('a[href="/terms"]');
      expect(termsLink).toBeInTheDocument();
    });

    it("has privacy link", () => {
      render(<Footer />);
      const privacyLink = document.querySelector('a[href="/privacy"]');
      expect(privacyLink).toBeInTheDocument();
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

  describe("styling", () => {
    it("applies background styling", () => {
      render(<Footer />);
      const footer = document.querySelector("footer");
      expect(footer?.className).toContain("bg-white");
    });

    it("has decorative SVG elements", () => {
      render(<Footer />);
      const svgs = document.querySelectorAll("footer svg");
      expect(svgs.length).toBeGreaterThan(0);
    });
  });

  describe("language switcher integration", () => {
    it("renders language switcher in footer", () => {
      render(<Footer />);
      // Check that language options are present
      expect(screen.getByText("English")).toBeInTheDocument();
      expect(screen.getByText("Español")).toBeInTheDocument();
    });

    it("language switcher is in bottom section", () => {
      render(<Footer />);
      const footer = document.querySelector("footer");
      const languageSwitcher = screen.getByText("English").closest("div");
      expect(footer).toContainElement(languageSwitcher);
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

  describe("bottom section layout", () => {
    it("has responsive flexbox layout for copyright and language switcher", () => {
      render(<Footer />);
      // Find the container that has both copyright and language switcher
      const flexContainer = document.querySelector(
        ".flex.flex-col.sm\\:flex-row",
      );
      expect(flexContainer).toBeInTheDocument();
    });

    it("contains copyright and language switcher in same container", () => {
      render(<Footer />);
      const currentYear = new Date().getFullYear().toString();
      const copyrightText = screen.getByText((content) =>
        content.includes(currentYear),
      );
      const languageSwitcher = screen.getByText("English");

      // Both should be within the footer's bottom section
      const footer = document.querySelector("footer");
      expect(footer).toContainElement(copyrightText);
      expect(footer).toContainElement(languageSwitcher);
    });
  });
});
