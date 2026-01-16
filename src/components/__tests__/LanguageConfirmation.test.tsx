import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageConfirmation from "../LanguageConfirmation";

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
const mockUseLocale = vi.fn(() => "en");
const mockUseTranslations = vi.fn(() => {
  return (key: string, params?: { language?: string }) => {
    const translations: Record<string, string> = {
      "languageConfirmation.message": `We noticed you prefer ${params?.language || ""}. Would you like to switch?`,
      "languageConfirmation.switch": "Switch",
      "languageConfirmation.dismiss": "Stay",
      "languageConfirmation.switchLabel": `Switch to ${params?.language || ""}`,
      "languageConfirmation.dismissLabel": "Stay on current language",
      loading: "Loading...",
    };
    return translations[key] || key;
  };
});

vi.mock("next-intl", () => ({
  useLocale: () => mockUseLocale(),
  useTranslations: () => mockUseTranslations(),
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
    en: { name: "English", flag: "🇺🇸", dir: "ltr" },
    es: { name: "Español", flag: "🇪🇸", dir: "ltr" },
  },
}));

// Storage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Navigator mock
const mockNavigator = {
  languages: ["es-MX", "es"],
  language: "es-MX",
};

describe("LanguageConfirmation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    Object.defineProperty(window, "navigator", {
      value: mockNavigator,
      writable: true,
      configurable: true,
    });
    mockUseLocale.mockReturnValue("en");
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("visibility conditions", () => {
    it("shows banner when browser language differs from current locale", () => {
      render(<LanguageConfirmation />);
      expect(
        screen.getByText(/We noticed you prefer Español/i),
      ).toBeInTheDocument();
    });

    it("does not show banner when browser language matches current locale", () => {
      // Set browser to English
      Object.defineProperty(window, "navigator", {
        value: { languages: ["en-US", "en"], language: "en-US" },
        writable: true,
        configurable: true,
      });

      const { container } = render(<LanguageConfirmation />);
      expect(container.firstChild).toBeNull();
    });

    it("does not show banner when user has previously dismissed", () => {
      localStorageMock.setItem("language-preference-dismissed", "true");

      const { container } = render(<LanguageConfirmation />);
      expect(container.firstChild).toBeNull();
    });

    it("does not show banner for unsupported browser languages", () => {
      Object.defineProperty(window, "navigator", {
        value: { languages: ["fr-FR", "fr"], language: "fr-FR" },
        writable: true,
        configurable: true,
      });

      const { container } = render(<LanguageConfirmation />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("user interactions", () => {
    it("switches language when Switch button is clicked", async () => {
      const user = userEvent.setup();
      render(<LanguageConfirmation />);

      expect(screen.getByText("Switch")).toBeInTheDocument();

      await user.click(screen.getByText("Switch"));

      expect(mockReplace).toHaveBeenCalledWith(
        expect.objectContaining({ pathname: "/" }),
        expect.objectContaining({ locale: "es" }),
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "language-preference-dismissed",
        "true",
      );
    });

    it("hides banner when Stay button is clicked", async () => {
      const user = userEvent.setup();
      render(<LanguageConfirmation />);

      expect(screen.getByText("Stay")).toBeInTheDocument();

      await user.click(screen.getByText("Stay"));

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "language-preference-dismissed",
        "true",
      );
      expect(mockReplace).not.toHaveBeenCalled();

      await waitFor(() => {
        expect(
          screen.queryByText(/We noticed you prefer/i),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("accessibility", () => {
    it("has proper role for banner", () => {
      render(<LanguageConfirmation />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("has aria-live for screen readers", () => {
      render(<LanguageConfirmation />);
      const banner = screen.getByRole("banner");
      expect(banner).toHaveAttribute("aria-live", "polite");
    });

    it("Switch button has accessible label", () => {
      render(<LanguageConfirmation />);
      const switchButton = screen.getByRole("button", {
        name: /switch to español/i,
      });
      expect(switchButton).toBeInTheDocument();
    });

    it("Stay button has accessible label", () => {
      render(<LanguageConfirmation />);
      const stayButton = screen.getByRole("button", {
        name: /stay on current language/i,
      });
      expect(stayButton).toBeInTheDocument();
    });
  });

  describe("locale detection", () => {
    it("detects Spanish from es-MX browser language", () => {
      Object.defineProperty(window, "navigator", {
        value: { languages: ["es-MX"], language: "es-MX" },
        writable: true,
        configurable: true,
      });

      render(<LanguageConfirmation />);
      expect(
        screen.getByText(/We noticed you prefer Español/i),
      ).toBeInTheDocument();
    });

    it("detects English from en-US browser language", () => {
      mockUseLocale.mockReturnValue("es");
      Object.defineProperty(window, "navigator", {
        value: { languages: ["en-US"], language: "en-US" },
        writable: true,
        configurable: true,
      });

      render(<LanguageConfirmation />);
      expect(
        screen.getByText(/We noticed you prefer English/i),
      ).toBeInTheDocument();
    });

    it("uses first supported language from browser preferences", () => {
      Object.defineProperty(window, "navigator", {
        value: { languages: ["fr-FR", "de-DE", "es-AR"], language: "fr-FR" },
        writable: true,
        configurable: true,
      });

      render(<LanguageConfirmation />);
      expect(
        screen.getByText(/We noticed you prefer Español/i),
      ).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("displays the correct flag for detected language", () => {
      render(<LanguageConfirmation />);
      expect(screen.getByText("🇪🇸")).toBeInTheDocument();
    });

    it("banner has slide-up animation class", () => {
      render(<LanguageConfirmation />);
      const banner = screen.getByRole("banner");
      expect(banner).toHaveClass("animate-slide-up");
    });
  });
});
