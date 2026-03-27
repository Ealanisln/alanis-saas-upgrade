import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock child components before importing Header
vi.mock("../LanguageSwitcher", () => ({
  default: () => <div data-testid="language-switcher">Language Switcher</div>,
}));

vi.mock("../ThemeToggler", () => ({
  default: () => <div data-testid="theme-toggler">Theme Toggler</div>,
}));

// Import after mocks
import Header from "../index";

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
      configurable: true,
    });
  });

  describe("rendering", () => {
    it("renders the header element", () => {
      render(<Header />);
      const header = document.querySelector("header");
      expect(header).toBeInTheDocument();
    });

    it("renders navigation items", () => {
      render(<Header />);
      // Desktop nav links
      const links = document.querySelectorAll("nav a");
      expect(links.length).toBeGreaterThan(0);
    });

    it("renders ThemeToggler component", () => {
      render(<Header />);
      expect(screen.getByTestId("theme-toggler")).toBeInTheDocument();
    });

    it("renders LanguageSwitcher components", () => {
      render(<Header />);
      const switchers = screen.getAllByTestId("language-switcher");
      expect(switchers.length).toBeGreaterThan(0);
    });

    it("renders mobile menu button", () => {
      render(<Header />);
      const button = screen.getByRole("button", { name: /mobile menu/i });
      expect(button).toBeInTheDocument();
    });

    it("renders site name link", () => {
      render(<Header />);
      const homeLink = document.querySelector('a[href="/"]');
      expect(homeLink).toBeInTheDocument();
    });
  });

  describe("navigation structure", () => {
    it("has navigation links with hrefs", () => {
      render(<Header />);
      const links = document.querySelectorAll("nav a[href]");
      expect(links.length).toBeGreaterThan(0);
    });

    it("includes home link", () => {
      render(<Header />);
      const homeLink = document.querySelector('a[href="/"]');
      expect(homeLink).toBeInTheDocument();
    });
  });

  describe("mobile menu toggle", () => {
    it("toggles navbar visibility on button click", async () => {
      const user = userEvent.setup();
      render(<Header />);

      const toggleButton = screen.getByRole("button", { name: /mobile menu/i });

      // Initially no mobile nav visible (rendered conditionally)
      const mobileNavBefore = document.querySelectorAll("header nav");
      // Desktop nav is always rendered, mobile nav only when open
      const initialNavCount = mobileNavBefore.length;

      // Click to open
      await user.click(toggleButton);
      await waitFor(() => {
        const mobileNavAfter = document.querySelectorAll("header nav");
        expect(mobileNavAfter.length).toBeGreaterThan(initialNavCount);
      });

      // Click to close
      await user.click(toggleButton);
      await waitFor(() => {
        const mobileNavClosed = document.querySelectorAll("header nav");
        expect(mobileNavClosed.length).toBe(initialNavCount);
      });
    });
  });

  describe("sticky behavior", () => {
    it("applies fixed class when scrolled", () => {
      render(<Header />);

      Object.defineProperty(window, "scrollY", {
        value: 100,
        configurable: true,
      });
      fireEvent.scroll(window);

      const header = document.querySelector("header");
      expect(header?.className).toContain("fixed");
    });

    it("applies relative class when at top", () => {
      render(<Header />);

      Object.defineProperty(window, "scrollY", {
        value: 0,
        configurable: true,
      });
      fireEvent.scroll(window);

      const header = document.querySelector("header");
      expect(header?.className).toContain("relative");
    });
  });
});
