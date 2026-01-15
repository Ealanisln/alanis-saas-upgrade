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
    // Reset scroll position
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

    it("renders navigation element", () => {
      render(<Header />);
      const nav = document.querySelector("nav");
      expect(nav).toBeInTheDocument();
    });

    it("renders navigation items", () => {
      render(<Header />);
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

    it("renders logo images", () => {
      render(<Header />);
      const logos = screen.getAllByAltText("logo");
      expect(logos.length).toBeGreaterThan(0);
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
      const nav = document.getElementById("navbarCollapse");

      // Initially invisible
      expect(nav?.className).toContain("invisible");

      // Click to open
      await user.click(toggleButton);
      await waitFor(() => {
        expect(nav?.className).toContain("visibility");
      });

      // Click to close
      await user.click(toggleButton);
      await waitFor(() => {
        expect(nav?.className).toContain("invisible");
      });
    });
  });

  describe("sticky behavior", () => {
    it("applies fixed class when scrolled", () => {
      render(<Header />);

      // Scroll down
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

      // Ensure at top
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
