import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ServiceCalculator from "../ServiceCalculator";

// Mock next-intl
vi.mock("next-intl", () => ({
  useLocale: () => "en",
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Calculator: () => <span data-testid="calculator-icon">Calculator</span>,
  Plus: () => <span>+</span>,
  Minus: () => <span>-</span>,
  Check: () => <span>✓</span>,
  X: () => <span>×</span>,
}));

// Mock quote action
const mockSubmitQuoteRequest = vi.fn();
vi.mock("@/app/actions/quote", () => ({
  submitQuoteRequest: (...args: unknown[]) => mockSubmitQuoteRequest(...args),
}));

// Mock child components
vi.mock("../ProjectConfiguration", () => ({
  ProjectConfiguration: ({
    clientType,
    urgency,
    onClientTypeChange,
    onUrgencyChange,
  }: {
    clientType: string;
    urgency: string;
    onClientTypeChange: (type: string) => void;
    onUrgencyChange: (level: string) => void;
  }) => (
    <div data-testid="project-configuration">
      <select
        data-testid="client-type-select"
        value={clientType}
        onChange={(e) => onClientTypeChange(e.target.value)}
      >
        <option value="pyme">PYME</option>
        <option value="startup">Startup</option>
        <option value="enterprise">Enterprise</option>
      </select>
      <select
        data-testid="urgency-select"
        value={urgency}
        onChange={(e) => onUrgencyChange(e.target.value)}
      >
        <option value="normal">Normal</option>
        <option value="urgente">Urgente</option>
        <option value="express">Express</option>
      </select>
    </div>
  ),
}));

vi.mock("../QuoteSummary", () => ({
  QuoteSummary: ({
    quote,
    onRequestQuote,
  }: {
    quote: { total: number } | null;
    onRequestQuote: () => void;
  }) => (
    <div data-testid="quote-summary">
      {quote && (
        <>
          <span data-testid="quote-total">${quote.total}</span>
          <button data-testid="request-quote-btn" onClick={onRequestQuote}>
            Request Quote
          </button>
        </>
      )}
      {!quote && <span>Select services to see quote</span>}
    </div>
  ),
}));

vi.mock("../QuoteFormModal", () => ({
  QuoteFormModal: ({
    isOpen,
    onCloseAction,
    onSubmit,
    loading,
  }: {
    isOpen: boolean;
    onCloseAction: () => void;
    onSubmit: (request: unknown) => Promise<void>;
    loading: boolean;
  }) =>
    isOpen ? (
      <div data-testid="quote-modal">
        <button data-testid="modal-close" onClick={onCloseAction}>
          Close
        </button>
        <button
          data-testid="modal-submit"
          disabled={loading}
          onClick={() =>
            onSubmit({
              clientInfo: { name: "Test", email: "test@test.com" },
              services: [],
              clientType: "pyme",
              urgency: "normal",
            })
          }
        >
          Submit
        </button>
      </div>
    ) : null,
}));

vi.mock("../ServiceCard", () => ({
  ServiceCard: ({
    category,
    option,
    quantity,
    onAdd,
    onRemove,
  }: {
    category: { name: string };
    option: { id: string; name: string };
    quantity: number;
    onAdd: () => void;
    onRemove: () => void;
  }) => (
    <div data-testid={`service-card-${option.id}`}>
      <span>
        {category.name} - {option.name}
      </span>
      <span data-testid={`quantity-${option.id}`}>{quantity}</span>
      <button data-testid={`add-${option.id}`} onClick={onAdd}>
        Add
      </button>
      <button data-testid={`remove-${option.id}`} onClick={onRemove}>
        Remove
      </button>
    </div>
  ),
}));

// Mock service config with minimal data
vi.mock("../service-config", () => ({
  serviceCategories: [
    {
      id: "web",
      name: "Web Development",
      description: "Custom web solutions",
      icon: "🌐",
      basePrice: 1000,
      options: [
        { id: "landing", name: "Landing Page", priceMultiplier: 1 },
        { id: "ecommerce", name: "E-commerce", priceMultiplier: 3 },
      ],
    },
    {
      id: "design",
      name: "UI/UX Design",
      description: "Professional design",
      icon: "🎨",
      basePrice: 500,
      options: [{ id: "ui", name: "UI Design", priceMultiplier: 1 }],
    },
  ],
}));

// Mock quote calculator
vi.mock("../quote-calculator", () => ({
  quoteCalculator: {
    calculateQuote: vi.fn(
      (
        services: Array<{
          categoryId: string;
          optionId: string;
          quantity: number;
        }>,
      ) => {
        if (services.length === 0) return { total: 0, breakdown: [] };
        // Calculate a simple total based on quantity
        const total = services.reduce((acc, s) => acc + s.quantity * 1000, 0);
        return { total, breakdown: services };
      },
    ),
    formatCurrency: (amount: number) => `$${amount.toLocaleString()}`,
  },
}));

describe("ServiceCalculator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the service calculator", () => {
      render(<ServiceCalculator />);
      expect(screen.getByText("Cotizador de Servicios")).toBeInTheDocument();
    });

    it("renders calculator icon", () => {
      render(<ServiceCalculator />);
      expect(screen.getByTestId("calculator-icon")).toBeInTheDocument();
    });

    it("renders project configuration section", () => {
      render(<ServiceCalculator />);
      expect(screen.getByTestId("project-configuration")).toBeInTheDocument();
    });

    it("renders quote summary section", () => {
      render(<ServiceCalculator />);
      expect(screen.getByTestId("quote-summary")).toBeInTheDocument();
    });

    it("renders service categories", () => {
      render(<ServiceCalculator />);
      expect(screen.getByText("Web Development")).toBeInTheDocument();
      expect(screen.getByText("UI/UX Design")).toBeInTheDocument();
    });

    it("renders service cards", () => {
      render(<ServiceCalculator />);
      expect(screen.getByTestId("service-card-landing")).toBeInTheDocument();
      expect(screen.getByTestId("service-card-ecommerce")).toBeInTheDocument();
      expect(screen.getByTestId("service-card-ui")).toBeInTheDocument();
    });
  });

  describe("service selection", () => {
    it("adds service when add button is clicked", async () => {
      const user = userEvent.setup();
      render(<ServiceCalculator />);

      const addButton = screen.getByTestId("add-landing");
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByTestId("quantity-landing")).toHaveTextContent("1");
      });
    });

    it("increments quantity when adding same service", async () => {
      const user = userEvent.setup();
      render(<ServiceCalculator />);

      const addButton = screen.getByTestId("add-landing");
      await user.click(addButton);
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByTestId("quantity-landing")).toHaveTextContent("2");
      });
    });

    it("removes service when remove button is clicked", async () => {
      const user = userEvent.setup();
      render(<ServiceCalculator />);

      // First add a service
      await user.click(screen.getByTestId("add-landing"));
      await user.click(screen.getByTestId("add-landing"));

      // Then remove one
      await user.click(screen.getByTestId("remove-landing"));

      await waitFor(() => {
        expect(screen.getByTestId("quantity-landing")).toHaveTextContent("1");
      });
    });

    it("removes service completely when quantity reaches 0", async () => {
      const user = userEvent.setup();
      render(<ServiceCalculator />);

      // Add then remove
      await user.click(screen.getByTestId("add-landing"));
      await user.click(screen.getByTestId("remove-landing"));

      await waitFor(() => {
        expect(screen.getByTestId("quantity-landing")).toHaveTextContent("0");
      });
    });
  });

  describe("project configuration", () => {
    it("changes client type", async () => {
      const user = userEvent.setup();
      render(<ServiceCalculator />);

      const select = screen.getByTestId("client-type-select");
      await user.selectOptions(select, "enterprise");

      expect(select).toHaveValue("enterprise");
    });

    it("changes urgency level", async () => {
      const user = userEvent.setup();
      render(<ServiceCalculator />);

      const select = screen.getByTestId("urgency-select");
      await user.selectOptions(select, "urgente");

      expect(select).toHaveValue("urgente");
    });
  });

  describe("quote summary", () => {
    it("shows quote total when services are selected", async () => {
      const user = userEvent.setup();
      render(<ServiceCalculator />);

      await user.click(screen.getByTestId("add-landing"));

      await waitFor(() => {
        expect(screen.getByTestId("quote-total")).toBeInTheDocument();
      });
    });
  });

  describe("quote modal", () => {
    it("opens modal when request quote is clicked", async () => {
      const user = userEvent.setup();
      render(<ServiceCalculator />);

      // Add a service first
      await user.click(screen.getByTestId("add-landing"));

      // Click request quote
      await waitFor(() => {
        expect(screen.getByTestId("request-quote-btn")).toBeInTheDocument();
      });
      await user.click(screen.getByTestId("request-quote-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("quote-modal")).toBeInTheDocument();
      });
    });

    it("closes modal when close button is clicked", async () => {
      const user = userEvent.setup();
      render(<ServiceCalculator />);

      // Add a service and open modal
      await user.click(screen.getByTestId("add-landing"));
      await waitFor(() => {
        expect(screen.getByTestId("request-quote-btn")).toBeInTheDocument();
      });
      await user.click(screen.getByTestId("request-quote-btn"));

      // Close modal
      await user.click(screen.getByTestId("modal-close"));

      await waitFor(() => {
        expect(screen.queryByTestId("quote-modal")).not.toBeInTheDocument();
      });
    });

    it("submits quote when submit is clicked", async () => {
      const user = userEvent.setup();
      mockSubmitQuoteRequest.mockResolvedValue({
        success: true,
        message: "Success",
      });

      render(<ServiceCalculator />);

      // Add a service and open modal
      await user.click(screen.getByTestId("add-landing"));
      await waitFor(() => {
        expect(screen.getByTestId("request-quote-btn")).toBeInTheDocument();
      });
      await user.click(screen.getByTestId("request-quote-btn"));

      // Submit
      await user.click(screen.getByTestId("modal-submit"));

      await waitFor(() => {
        expect(mockSubmitQuoteRequest).toHaveBeenCalled();
      });
    });

    it("shows success message after successful submission", async () => {
      const user = userEvent.setup();
      mockSubmitQuoteRequest.mockResolvedValue({
        success: true,
        message: "Success",
      });

      render(<ServiceCalculator />);

      // Add a service and submit
      await user.click(screen.getByTestId("add-landing"));
      await waitFor(() => {
        expect(screen.getByTestId("request-quote-btn")).toBeInTheDocument();
      });
      await user.click(screen.getByTestId("request-quote-btn"));
      await user.click(screen.getByTestId("modal-submit"));

      await waitFor(() => {
        expect(
          screen.getByText(/cotización enviada exitosamente/i),
        ).toBeInTheDocument();
      });
    });
  });
});
