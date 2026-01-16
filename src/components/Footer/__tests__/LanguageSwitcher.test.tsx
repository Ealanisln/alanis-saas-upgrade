import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FooterLanguageSwitcher from "../LanguageSwitcher";

// Mock useTransition
const mockStartTransition = vi.fn((callback: () => void) => callback());
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useTransition: () => [false, mockStartTransition],
  };
});

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useParams: () => ({}),
}));

// Mock next-intl
vi.mock("next-intl", () => ({
  useLocale: () => "en",
}));

// Mock navigation
const mockReplace = vi.fn();
vi.mock("@/lib/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

// Mock i18n config
vi.mock("@/config/i18n", () => ({
  locales: ["en", "es"] as const,
  defaultLocale: "en",
  localeConfig: {
    en: { name: "English", flag: "🇺🇸" },
    es: { name: "Español", flag: "🇪🇸" },
  },
}));

describe("FooterLanguageSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the language switcher", () => {
      render(<FooterLanguageSwitcher />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBe(2); // Two locale buttons
    });

    it("displays all locale names", () => {
      render(<FooterLanguageSwitcher />);
      expect(screen.getByText("English")).toBeInTheDocument();
      expect(screen.getByText("Español")).toBeInTheDocument();
    });

    it("renders separator between locales", () => {
      render(<FooterLanguageSwitcher />);
      expect(screen.getByText("|")).toBeInTheDocument();
    });

    it("renders inline layout with flexbox", () => {
      render(<FooterLanguageSwitcher />);
      const container = document.querySelector(".flex.items-center");
      expect(container).toBeInTheDocument();
    });
  });

  describe("locale options", () => {
    it("renders English option", () => {
      render(<FooterLanguageSwitcher />);
      expect(screen.getByText("English")).toBeInTheDocument();
    });

    it("renders Spanish option", () => {
      render(<FooterLanguageSwitcher />);
      expect(screen.getByText("Español")).toBeInTheDocument();
    });

    it("highlights current locale with primary color", () => {
      render(<FooterLanguageSwitcher />);
      const englishButton = screen.getByText("English");
      expect(englishButton.className).toContain("text-primary");
      expect(englishButton.className).toContain("font-medium");
    });

    it("current locale button is disabled", () => {
      render(<FooterLanguageSwitcher />);
      const englishButton = screen.getByText("English");
      expect(englishButton).toBeDisabled();
    });

    it("other locale button is enabled", () => {
      render(<FooterLanguageSwitcher />);
      const spanishButton = screen.getByText("Español");
      expect(spanishButton).not.toBeDisabled();
    });
  });

  describe("locale switching", () => {
    it("calls router.replace when different locale is clicked", async () => {
      const user = userEvent.setup();
      render(<FooterLanguageSwitcher />);

      const spanishButton = screen.getByText("Español");
      await user.click(spanishButton);

      expect(mockReplace).toHaveBeenCalledWith(
        expect.objectContaining({ pathname: "/" }),
        expect.objectContaining({ locale: "es" }),
      );
    });

    it("does not call router.replace when same locale is clicked", async () => {
      const user = userEvent.setup();
      render(<FooterLanguageSwitcher />);

      const englishButton = screen.getByText("English");
      await user.click(englishButton);

      // Should not navigate since it's disabled
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it("uses startTransition for navigation", async () => {
      const user = userEvent.setup();
      render(<FooterLanguageSwitcher />);

      const spanishButton = screen.getByText("Español");
      await user.click(spanishButton);

      expect(mockStartTransition).toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("has aria-label on locale buttons", () => {
      render(<FooterLanguageSwitcher />);
      const englishButton = screen.getByLabelText("Switch to English");
      const spanishButton = screen.getByLabelText("Switch to Español");
      expect(englishButton).toBeInTheDocument();
      expect(spanishButton).toBeInTheDocument();
    });

    it("has aria-current on active locale", () => {
      render(<FooterLanguageSwitcher />);
      const englishButton = screen.getByText("English");
      expect(englishButton).toHaveAttribute("aria-current", "true");
    });

    it("does not have aria-current on inactive locale", () => {
      render(<FooterLanguageSwitcher />);
      const spanishButton = screen.getByText("Español");
      expect(spanishButton).not.toHaveAttribute("aria-current");
    });

    it("buttons can be focused", () => {
      render(<FooterLanguageSwitcher />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute("tabindex", "-1");
      });
    });
  });

  describe("styling", () => {
    it("applies text-only minimal design", () => {
      render(<FooterLanguageSwitcher />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button.className).toContain("text-sm");
      });
    });

    it("applies hover styles to inactive locale", () => {
      render(<FooterLanguageSwitcher />);
      const spanishButton = screen.getByText("Español");
      expect(spanishButton.className).toContain("hover:text-primary");
    });

    it("applies transition for smooth color change", () => {
      render(<FooterLanguageSwitcher />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button.className).toContain("transition-colors");
      });
    });
  });
});
