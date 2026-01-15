import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Features from "../index";

describe("Features", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the features section", () => {
      render(<Features />);
      const section = document.getElementById("features");
      expect(section).toBeInTheDocument();
    });

    it("renders as a section element", () => {
      render(<Features />);
      const section = document.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    it("renders feature items in a grid", () => {
      render(<Features />);
      const grid = document.querySelector(".grid");
      expect(grid).toBeInTheDocument();
    });

    it("renders multiple feature items", () => {
      render(<Features />);
      // Features should render multiple items
      const gridItems = document.querySelectorAll(".grid > div");
      expect(gridItems.length).toBeGreaterThan(0);
    });
  });

  describe("layout", () => {
    it("uses 3-column grid on large screens", () => {
      render(<Features />);
      const grid = document.querySelector(".lg\\:grid-cols-3");
      expect(grid).toBeInTheDocument();
    });

    it("uses 2-column grid on medium screens", () => {
      render(<Features />);
      const grid = document.querySelector(".md\\:grid-cols-2");
      expect(grid).toBeInTheDocument();
    });

    it("uses 1-column grid on small screens", () => {
      render(<Features />);
      const grid = document.querySelector(".grid-cols-1");
      expect(grid).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("applies gradient background", () => {
      render(<Features />);
      const section = document.querySelector("section");
      expect(section?.className).toContain("bg-gradient-to-b");
    });

    it("has decorative background elements", () => {
      render(<Features />);
      const decorativeElements = document.querySelectorAll(".blur-3xl");
      expect(decorativeElements.length).toBeGreaterThan(0);
    });
  });

  describe("section title", () => {
    it("renders a section heading", () => {
      render(<Features />);
      const headings = document.querySelectorAll("h2");
      expect(headings.length).toBeGreaterThan(0);
    });
  });
});
