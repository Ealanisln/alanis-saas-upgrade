import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "../index";

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
});
