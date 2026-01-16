import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageNotFound } from "../PageNotFound";

// Mock useTranslations to return actual translation keys for testing
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      "notFound.heading": "404",
      "notFound.title": "Page Not Found",
      "notFound.description":
        "Sorry, the page you are looking for doesn't exist or has been moved.",
      "notFound.backHome": "Go Back Home",
      "notFound.suggestions.title": "Here are some helpful links:",
      "notFound.suggestions.home": "Home",
      "notFound.suggestions.blog": "Blog",
      "notFound.suggestions.portfolio": "Portfolio",
      "notFound.suggestions.contact": "Contact",
    };
    return translations[key] || key;
  },
}));

describe("PageNotFound", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the 404 heading", () => {
      render(<PageNotFound />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("404");
    });

    it("renders the page not found title", () => {
      render(<PageNotFound />);
      const title = screen.getByRole("heading", { level: 2 });
      expect(title).toHaveTextContent("Page Not Found");
    });

    it("renders the description text", () => {
      render(<PageNotFound />);
      expect(
        screen.getByText(
          /Sorry, the page you are looking for doesn't exist or has been moved/i,
        ),
      ).toBeInTheDocument();
    });

    it("renders the sad face icon SVG", () => {
      render(<PageNotFound />);
      const svgs = document.querySelectorAll('svg[aria-hidden="true"]');
      expect(svgs.length).toBeGreaterThan(0);
    });
  });

  describe("navigation links", () => {
    it("renders the Go Back Home button", () => {
      render(<PageNotFound />);
      const homeButton = screen.getByRole("link", { name: /Go Back Home/i });
      expect(homeButton).toBeInTheDocument();
      expect(homeButton).toHaveAttribute("href", "/");
    });

    it("renders helpful links section title", () => {
      render(<PageNotFound />);
      expect(
        screen.getByText("Here are some helpful links:"),
      ).toBeInTheDocument();
    });

    it("renders Home helpful link", () => {
      render(<PageNotFound />);
      const links = screen.getAllByRole("link");
      const homeLink = links.find(
        (link) =>
          link.textContent === "Home" && link.getAttribute("href") === "/",
      );
      expect(homeLink).toBeInTheDocument();
    });

    it("renders Blog helpful link", () => {
      render(<PageNotFound />);
      const blogLink = screen.getByRole("link", { name: "Blog" });
      expect(blogLink).toBeInTheDocument();
      expect(blogLink).toHaveAttribute("href", "/blog");
    });

    it("renders Portfolio helpful link", () => {
      render(<PageNotFound />);
      const portfolioLink = screen.getByRole("link", { name: "Portfolio" });
      expect(portfolioLink).toBeInTheDocument();
      expect(portfolioLink).toHaveAttribute("href", "/portfolio");
    });

    it("renders Contact helpful link", () => {
      render(<PageNotFound />);
      const contactLink = screen.getByRole("link", { name: "Contact" });
      expect(contactLink).toBeInTheDocument();
      expect(contactLink).toHaveAttribute("href", "/contact");
    });
  });

  describe("styling", () => {
    it("applies dark mode classes to container", () => {
      render(<PageNotFound />);
      const container = document.querySelector(".dark\\:bg-gray-dark");
      expect(container).toBeInTheDocument();
    });

    it("applies primary color to heading", () => {
      render(<PageNotFound />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.className).toContain("text-primary");
    });

    it("applies correct layout classes", () => {
      render(<PageNotFound />);
      const container = document.querySelector(".min-h-\\[70vh\\]");
      expect(container).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has proper heading hierarchy", () => {
      render(<PageNotFound />);
      const h1 = screen.getByRole("heading", { level: 1 });
      const h2 = screen.getByRole("heading", { level: 2 });
      expect(h1).toBeInTheDocument();
      expect(h2).toBeInTheDocument();
    });

    it("SVG icons have aria-hidden attribute", () => {
      render(<PageNotFound />);
      const svgs = document.querySelectorAll('svg[aria-hidden="true"]');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it("all links have accessible text", () => {
      render(<PageNotFound />);
      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link.textContent?.trim()).not.toBe("");
      });
    });
  });
});
