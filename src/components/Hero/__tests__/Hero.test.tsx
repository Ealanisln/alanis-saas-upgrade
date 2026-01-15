import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock framer-motion before import
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      ...props
    }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    h1: ({
      children,
      className,
      ...props
    }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className={className} {...props}>
        {children}
      </h1>
    ),
    p: ({
      children,
      className,
      ...props
    }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className={className} {...props}>
        {children}
      </p>
    ),
  },
}));

import HeroSection from "../index";

describe("HeroSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the hero section container", () => {
      render(<HeroSection locale="en" />);
      const container = document.querySelector(".min-h-\\[100dvh\\]");
      expect(container).toBeInTheDocument();
    });

    it("renders a heading", () => {
      render(<HeroSection locale="en" />);
      const headings = document.querySelectorAll("h1");
      expect(headings.length).toBeGreaterThan(0);
    });

    it("renders buttons", () => {
      render(<HeroSection locale="en" />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("renders links to portfolio and contact", () => {
      render(<HeroSection locale="en" />);
      const portfolioLink = document.querySelector('a[href="/portfolio"]');
      const contactLink = document.querySelector('a[href="/contact"]');
      expect(portfolioLink).toBeInTheDocument();
      expect(contactLink).toBeInTheDocument();
    });

    it("renders hero images", () => {
      render(<HeroSection locale="en" />);
      const images = screen.getAllByAltText("Hero illustration");
      expect(images.length).toBeGreaterThan(0);
    });
  });

  describe("styling", () => {
    it("applies gradient background", () => {
      render(<HeroSection locale="en" />);
      const gradient = document.querySelector(".bg-gradient-to-br");
      expect(gradient).toBeInTheDocument();
    });

    it("has animated blob elements", () => {
      render(<HeroSection locale="en" />);
      const blobs = document.querySelectorAll(".animate-blob");
      expect(blobs.length).toBeGreaterThan(0);
    });
  });

  describe("props", () => {
    it("accepts locale prop", () => {
      expect(() => render(<HeroSection locale="es" />)).not.toThrow();
    });
  });
});
