import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Helper type for filtering Framer Motion props from DOM props
interface MotionProps {
  children?: React.ReactNode;
  className?: string;
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  variants?: unknown;
  whileHover?: unknown;
  whileTap?: unknown;
  whileInView?: unknown;
  transition?: unknown;
  viewport?: unknown;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

// Helper to filter out Framer Motion-specific props
const filterMotionProps = (props: MotionProps) => {
  const {
    initial,
    animate,
    exit,
    variants,
    whileHover,
    whileTap,
    whileInView,
    transition,
    viewport,
    ...domProps
  } = props;
  // Suppress unused variable warnings
  void initial;
  void animate;
  void exit;
  void variants;
  void whileHover;
  void whileTap;
  void whileInView;
  void transition;
  void viewport;
  return domProps;
};

// Mock framer-motion before import - filter out motion-specific props
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }: MotionProps) => {
      const domProps = filterMotionProps(props);
      return React.createElement("div", { className, ...domProps }, children);
    },
    h1: ({ children, className, ...props }: MotionProps) => {
      const domProps = filterMotionProps(props);
      return React.createElement("h1", { className, ...domProps }, children);
    },
    p: ({ children, className, ...props }: MotionProps) => {
      const domProps = filterMotionProps(props);
      return React.createElement("p", { className, ...domProps }, children);
    },
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
