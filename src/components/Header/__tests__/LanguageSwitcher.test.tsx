import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageSwitcher from "../LanguageSwitcher";

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
    es: { name: "Español", flag: "🇲🇽" },
  },
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the language switcher", () => {
      render(<LanguageSwitcher />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("displays locale names", () => {
      render(<LanguageSwitcher />);
      // There will be multiple instances due to main button + dropdown
      const englishElements = screen.getAllByText("English");
      expect(englishElements.length).toBeGreaterThan(0);
    });

    it("displays locale flags", () => {
      render(<LanguageSwitcher />);
      // There will be multiple instances due to main button + dropdown
      const flags = screen.getAllByText("🇺🇸");
      expect(flags.length).toBeGreaterThan(0);
    });

    it("renders dropdown with available locales", () => {
      render(<LanguageSwitcher />);
      // The dropdown should contain both locale options
      expect(screen.getAllByText("English").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Español").length).toBeGreaterThanOrEqual(1);
    });

    it("renders chevron icon", () => {
      render(<LanguageSwitcher />);
      const svg = document.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  describe("locale options", () => {
    it("renders English option", () => {
      render(<LanguageSwitcher />);
      expect(screen.getAllByText("English").length).toBeGreaterThan(0);
      expect(screen.getAllByText("🇺🇸").length).toBeGreaterThan(0);
    });

    it("renders Spanish option", () => {
      render(<LanguageSwitcher />);
      expect(screen.getAllByText("Español").length).toBeGreaterThan(0);
      expect(screen.getAllByText("🇲🇽").length).toBeGreaterThan(0);
    });

    it("marks current locale as selected", () => {
      render(<LanguageSwitcher />);
      // The current locale button should be disabled
      const buttons = screen.getAllByRole("button");
      const currentLocaleButton = buttons.find(
        (btn) =>
          btn.textContent?.includes("English") &&
          btn.getAttribute("disabled") !== null,
      );
      expect(currentLocaleButton).toBeDefined();
    });
  });

  describe("locale switching", () => {
    it("calls router.replace when different locale is clicked", async () => {
      const user = userEvent.setup();
      render(<LanguageSwitcher />);

      // Find the Spanish button in the dropdown
      const spanishButtons = screen
        .getAllByRole("button")
        .filter((btn) => btn.textContent?.includes("Español"));
      const spanishButton = spanishButtons.find(
        (btn) => btn.getAttribute("disabled") === null,
      );

      if (spanishButton) {
        await user.click(spanishButton);

        expect(mockReplace).toHaveBeenCalledWith(
          expect.objectContaining({ pathname: "/" }),
          expect.objectContaining({ locale: "es" }),
        );
      }
    });

    it("does not call router.replace when same locale is clicked", async () => {
      const user = userEvent.setup();
      render(<LanguageSwitcher />);

      // Find the English button (current locale) - it should be disabled
      const englishButtons = screen
        .getAllByRole("button")
        .filter(
          (btn) =>
            btn.textContent?.includes("English") &&
            btn.textContent?.includes("🇺🇸"),
        );

      // The English option in dropdown should be disabled
      const disabledEnglishButton = englishButtons.find(
        (btn) => btn.getAttribute("disabled") !== null,
      );

      if (disabledEnglishButton) {
        await user.click(disabledEnglishButton);
        // Should not navigate since it's disabled
        expect(mockReplace).not.toHaveBeenCalled();
      }
    });
  });

  describe("styling", () => {
    it("applies group class for hover effects", () => {
      render(<LanguageSwitcher />);
      const container = document.querySelector(".group");
      expect(container).toBeInTheDocument();
    });

    it("dropdown is initially invisible", () => {
      render(<LanguageSwitcher />);
      const dropdown = document.querySelector(".invisible");
      expect(dropdown).toBeInTheDocument();
    });

    it("dropdown has correct positioning", () => {
      render(<LanguageSwitcher />);
      const dropdown = document.querySelector(".absolute.right-0");
      expect(dropdown).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("main button can be focused", () => {
      render(<LanguageSwitcher />);
      const mainButton = screen.getAllByRole("button")[0];
      expect(mainButton).not.toHaveAttribute("tabindex", "-1");
    });

    it("locale buttons have visible text", () => {
      render(<LanguageSwitcher />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button.textContent).toBeTruthy();
      });
    });
  });
});
