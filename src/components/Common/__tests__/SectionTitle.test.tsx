import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import SectionTitle from "../SectionTitle";

describe("SectionTitle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the title", () => {
      render(<SectionTitle title="Test Title" />);
      expect(
        screen.getByRole("heading", { name: /test title/i }),
      ).toBeInTheDocument();
    });

    it("renders as h2 heading", () => {
      render(<SectionTitle title="Test Title" />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe("paragraph", () => {
    it("does not render paragraph when not provided", () => {
      render(<SectionTitle title="Test Title" />);
      const paragraphs = document.querySelectorAll("p");
      expect(paragraphs.length).toBe(0);
    });

    it("renders paragraph when provided", () => {
      render(<SectionTitle title="Test Title" paragraph="Test paragraph" />);
      expect(screen.getByText("Test paragraph")).toBeInTheDocument();
    });
  });

  describe("subtitle", () => {
    it("does not render subtitle when not provided", () => {
      render(<SectionTitle title="Test Title" />);
      // Only title should be rendered, no badge
      const badges = document.querySelectorAll(".rounded-full");
      expect(badges.length).toBe(0);
    });

    it("renders subtitle badge when provided", () => {
      render(<SectionTitle title="Test Title" subtitle="Our Services" />);
      expect(screen.getByText("Our Services")).toBeInTheDocument();
    });

    it("applies badge styling to subtitle", () => {
      render(<SectionTitle title="Test Title" subtitle="Badge" />);
      const badge = screen.getByText("Badge");
      expect(badge.className).toContain("rounded-full");
    });
  });

  describe("highlight", () => {
    it("renders title without special styling when no highlight", () => {
      render(<SectionTitle title="Simple Title" />);
      expect(screen.getByText("Simple Title")).toBeInTheDocument();
    });

    it("applies highlight styling when provided", () => {
      render(<SectionTitle title="Build Modern Apps" highlight="Modern" />);
      const highlighted = screen.getByText("Modern");
      expect(highlighted.className).toContain("text-blue-600");
    });

    it("splits title around highlight", () => {
      render(<SectionTitle title="Build Modern Apps" highlight="Modern" />);
      // The heading should still be complete
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading.textContent).toContain("Build");
      expect(heading.textContent).toContain("Modern");
      expect(heading.textContent).toContain("Apps");
    });
  });

  describe("center prop", () => {
    it("does not center by default", () => {
      render(<SectionTitle title="Test Title" />);
      const container = document.querySelector(".text-left");
      expect(container).toBeInTheDocument();
    });

    it("centers content when center is true", () => {
      render(<SectionTitle title="Test Title" center />);
      const container = document.querySelector(".text-center");
      expect(container).toBeInTheDocument();
    });
  });

  describe("width prop", () => {
    it("uses default width when not provided", () => {
      render(<SectionTitle title="Test Title" />);
      const container = document.querySelector(".max-w-\\[768px\\]");
      expect(container).toBeInTheDocument();
    });

    it("applies custom width when provided", () => {
      render(<SectionTitle title="Test Title" width="max-w-[500px]" />);
      const container = document.querySelector(".max-w-\\[500px\\]");
      expect(container).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("applies margin bottom classes", () => {
      render(<SectionTitle title="Test Title" />);
      const container = document.querySelector(".mb-12");
      expect(container).toBeInTheDocument();
    });

    it("heading has bold styling", () => {
      render(<SectionTitle title="Test Title" />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading.className).toContain("font-bold");
    });
  });
});
