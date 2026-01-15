import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PricingBox from "../PricingBox";

// Mock translations
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      mostPopular: "Most Popular",
      cta: "Get Started",
    };
    return translations[key] || key;
  },
  useLocale: () => "en",
}));

// Mock stripe action
const mockCreateCheckoutSession = vi.fn();
vi.mock("@/app/actions/stripe", () => ({
  createCheckoutSession: (...args: unknown[]) =>
    mockCreateCheckoutSession(...args),
}));

// Mock config
vi.mock("@/config", () => ({
  CURRENCY: "usd",
}));

// Mock stripe helpers
vi.mock("@/lib/utils/stripe-helpers", () => ({
  formatAmountForStripe: vi.fn((amount: number) => amount * 100),
}));

describe("PricingBox", () => {
  const defaultProps = {
    price: 99,
    packageName: "Basic Plan",
    subtitle: "Perfect for small projects",
    children: <div data-testid="features">Feature list</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the pricing box", () => {
      render(<PricingBox {...defaultProps} />);
      expect(screen.getByText("Basic Plan")).toBeInTheDocument();
    });

    it("renders the package name", () => {
      render(<PricingBox {...defaultProps} />);
      expect(screen.getByText("Basic Plan")).toBeInTheDocument();
    });

    it("renders the price with currency", () => {
      render(<PricingBox {...defaultProps} />);
      expect(screen.getByText(/\$99/)).toBeInTheDocument();
      expect(screen.getByText("USD")).toBeInTheDocument();
    });

    it("formats price with locale", () => {
      render(<PricingBox {...defaultProps} price={1999} />);
      expect(screen.getByText(/\$1,999/)).toBeInTheDocument();
    });

    it("renders the subtitle", () => {
      render(<PricingBox {...defaultProps} />);
      expect(
        screen.getByText("Perfect for small projects"),
      ).toBeInTheDocument();
    });

    it("renders children (features)", () => {
      render(<PricingBox {...defaultProps} />);
      expect(screen.getByTestId("features")).toBeInTheDocument();
    });

    it("renders CTA button", () => {
      render(<PricingBox {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: "Get Started" }),
      ).toBeInTheDocument();
    });
  });

  describe("popular badge", () => {
    it("does not render popular badge by default", () => {
      render(<PricingBox {...defaultProps} />);
      expect(screen.queryByText("Most Popular")).not.toBeInTheDocument();
    });

    it("renders popular badge when popular is true", () => {
      render(<PricingBox {...defaultProps} popular={true} />);
      expect(screen.getByText("Most Popular")).toBeInTheDocument();
    });

    it("applies special styling when popular", () => {
      render(<PricingBox {...defaultProps} popular={true} />);
      const container = document.querySelector(".lg\\:scale-105");
      expect(container).toBeInTheDocument();
    });
  });

  describe("checkout functionality", () => {
    it("calls createCheckoutSession when CTA is clicked", async () => {
      const user = userEvent.setup();
      render(<PricingBox {...defaultProps} />);

      const button = screen.getByRole("button", { name: "Get Started" });
      await user.click(button);

      expect(mockCreateCheckoutSession).toHaveBeenCalledWith(
        9900, // price * 100
        "Basic Plan",
        "en",
      );
    });

    it("passes correct package name to checkout", async () => {
      const user = userEvent.setup();
      render(
        <PricingBox {...defaultProps} packageName="Enterprise" price={499} />,
      );

      const button = screen.getByRole("button", { name: "Get Started" });
      await user.click(button);

      expect(mockCreateCheckoutSession).toHaveBeenCalledWith(
        49900,
        "Enterprise",
        "en",
      );
    });
  });

  describe("styling", () => {
    it("applies base styling classes", () => {
      render(<PricingBox {...defaultProps} />);
      const card = document.querySelector(".rounded-2xl");
      expect(card).toBeInTheDocument();
    });

    it("applies different button styling for popular plan", () => {
      render(<PricingBox {...defaultProps} popular={true} />);
      const button = screen.getByRole("button", { name: "Get Started" });
      expect(button).toHaveClass("bg-primary");
    });

    it("applies border styling for non-popular plan", () => {
      render(<PricingBox {...defaultProps} popular={false} />);
      const card = document.querySelector(".border-gray-200\\/50");
      expect(card).toBeInTheDocument();
    });
  });
});
