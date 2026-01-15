import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Testimonials from "../index";

describe("Testimonials", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the testimonials section", () => {
      render(<Testimonials />);
      const section = document.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    it("renders section title", () => {
      render(<Testimonials />);
      const heading = screen.getByRole("heading", {
        name: /what our users says/i,
      });
      expect(heading).toBeInTheDocument();
    });

    it("renders testimonial grid", () => {
      render(<Testimonials />);
      const grid = document.querySelector(".grid");
      expect(grid).toBeInTheDocument();
    });
  });

  describe("testimonial cards", () => {
    it("renders multiple testimonial cards", () => {
      render(<Testimonials />);
      const gridItems = document.querySelectorAll(".grid > div");
      expect(gridItems.length).toBeGreaterThan(0);
    });

    it("displays testimonial names", () => {
      render(<Testimonials />);
      // Check for at least one testimonial name
      const section = document.querySelector("section");
      expect(section?.textContent).toMatch(/Musharof|Devid|Lethium/);
    });

    it("displays testimonial content", () => {
      render(<Testimonials />);
      const section = document.querySelector("section");
      expect(section?.textContent).toContain("impressed");
    });
  });

  describe("layout", () => {
    it("uses 3-column grid on large screens", () => {
      render(<Testimonials />);
      const grid = document.querySelector(".lg\\:grid-cols-3");
      expect(grid).toBeInTheDocument();
    });

    it("uses 2-column grid on medium screens", () => {
      render(<Testimonials />);
      const grid = document.querySelector(".md\\:grid-cols-2");
      expect(grid).toBeInTheDocument();
    });

    it("uses 1-column grid on small screens", () => {
      render(<Testimonials />);
      const grid = document.querySelector(".grid-cols-1");
      expect(grid).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("applies background color", () => {
      render(<Testimonials />);
      const section = document.querySelector("section");
      expect(section?.className).toContain("bg-gray-light");
    });

    it("has decorative SVG elements", () => {
      render(<Testimonials />);
      const svgs = document.querySelectorAll("section svg");
      expect(svgs.length).toBeGreaterThan(0);
    });
  });
});
