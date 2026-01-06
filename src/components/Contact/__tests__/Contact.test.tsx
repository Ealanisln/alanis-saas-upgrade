import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contact from "../index";

// Mock the sendEmail server action
const mockSendEmail = vi.fn();
vi.mock("@/app/actions/email", () => ({
  default: (data: { name: string; email: string; message: string }) =>
    mockSendEmail(data),
}));

describe("Contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe("rendering", () => {
    it("renders contact section heading", () => {
      render(<Contact />);

      // useTranslations mock returns the key as the text
      expect(screen.getByText("title")).toBeInTheDocument();
      expect(screen.getByText("subtitle")).toBeInTheDocument();
    });

    it("renders name input field with label", () => {
      render(<Contact />);

      expect(screen.getByText("nameLabel")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("namePlaceholder"),
      ).toBeInTheDocument();
    });

    it("renders email input field with label", () => {
      render(<Contact />);

      expect(screen.getByText("emailLabel")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("emailPlaceholder"),
      ).toBeInTheDocument();
    });

    it("renders message textarea with label", () => {
      render(<Contact />);

      expect(screen.getByText("messageLabel")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("messagePlaceholder"),
      ).toBeInTheDocument();
    });

    it("renders submit button", () => {
      render(<Contact />);

      const submitButton = screen.getByRole("button", { name: "submit" });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute("type", "submit");
    });

    it("displays maxChars message for message field", () => {
      render(<Contact />);

      expect(screen.getByText("maxChars")).toBeInTheDocument();
    });
  });

  describe("form validation", () => {
    it("shows error when name is empty on submit", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Contact />);

      const submitButton = screen.getByRole("button", { name: "submit" });
      await user.click(submitButton);

      await waitFor(() => {
        // The error message contains "required" text
        expect(screen.getAllByText("required").length).toBeGreaterThanOrEqual(
          1,
        );
      });
    });

    it("shows error when email is empty on submit", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Contact />);

      const nameInput = screen.getByPlaceholderText("namePlaceholder");
      await user.type(nameInput, "John Doe");

      const submitButton = screen.getByRole("button", { name: "submit" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getAllByText("required").length).toBeGreaterThanOrEqual(
          1,
        );
      });
    });

    it("shows error when message is empty on submit", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Contact />);

      const nameInput = screen.getByPlaceholderText("namePlaceholder");
      const emailInput = screen.getByPlaceholderText("emailPlaceholder");

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");

      const submitButton = screen.getByRole("button", { name: "submit" });
      await user.click(submitButton);

      await waitFor(() => {
        // Message field has "required - " text when error
        expect(screen.getByText("required -")).toBeInTheDocument();
      });
    });

    it("validates message maxLength", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Contact />);

      const nameInput = screen.getByPlaceholderText("namePlaceholder");
      const emailInput = screen.getByPlaceholderText("emailPlaceholder");
      const messageInput = screen.getByPlaceholderText("messagePlaceholder");

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      // Type more than 500 characters
      const longMessage = "a".repeat(501);
      await user.type(messageInput, longMessage);

      const submitButton = screen.getByRole("button", { name: "submit" });
      await user.click(submitButton);

      await waitFor(() => {
        // Should show error for exceeding maxLength
        expect(screen.getByText("required -")).toBeInTheDocument();
      });

      expect(mockSendEmail).not.toHaveBeenCalled();
    });
  });

  describe("form submission - success", () => {
    it("calls sendEmail with correct data on valid submission", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      mockSendEmail.mockResolvedValue("Email sent successfully!");
      render(<Contact />);

      const nameInput = screen.getByPlaceholderText("namePlaceholder");
      const emailInput = screen.getByPlaceholderText("emailPlaceholder");
      const messageInput = screen.getByPlaceholderText("messagePlaceholder");

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(messageInput, "Hello, this is a test message.");

      const submitButton = screen.getByRole("button", { name: "submit" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSendEmail).toHaveBeenCalledWith({
          name: "John Doe",
          email: "john@example.com",
          message: "Hello, this is a test message.",
          locale: "en",
        });
      });
    });

    it("displays success message after submission", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      mockSendEmail.mockResolvedValue("Email sent successfully!");
      render(<Contact />);

      const nameInput = screen.getByPlaceholderText("namePlaceholder");
      const emailInput = screen.getByPlaceholderText("emailPlaceholder");
      const messageInput = screen.getByPlaceholderText("messagePlaceholder");

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(messageInput, "Hello, this is a test message.");

      const submitButton = screen.getByRole("button", { name: "submit" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Email sent successfully!"),
        ).toBeInTheDocument();
      });
    });

    it("resets form after successful submission within 3 seconds", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      mockSendEmail.mockResolvedValue("Email sent successfully!");
      render(<Contact />);

      const nameInput = screen.getByPlaceholderText(
        "namePlaceholder",
      ) as HTMLInputElement;
      const emailInput = screen.getByPlaceholderText(
        "emailPlaceholder",
      ) as HTMLInputElement;
      const messageInput = screen.getByPlaceholderText(
        "messagePlaceholder",
      ) as HTMLTextAreaElement;

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(messageInput, "Hello, this is a test message.");

      const submitButton = screen.getByRole("button", { name: "submit" });
      await user.click(submitButton);

      // Wait for success message
      await waitFor(() => {
        expect(
          screen.getByText("Email sent successfully!"),
        ).toBeInTheDocument();
      });

      // Advance time by 3 seconds
      await act(async () => {
        await vi.advanceTimersByTimeAsync(3000);
      });

      // Form should be reset
      await waitFor(() => {
        expect(nameInput.value).toBe("");
        expect(emailInput.value).toBe("");
        expect(messageInput.value).toBe("");
      });
    });

    it("clears success message after 3 seconds", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      mockSendEmail.mockResolvedValue("Email sent successfully!");
      render(<Contact />);

      const nameInput = screen.getByPlaceholderText("namePlaceholder");
      const emailInput = screen.getByPlaceholderText("emailPlaceholder");
      const messageInput = screen.getByPlaceholderText("messagePlaceholder");

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(messageInput, "Hello, this is a test message.");

      const submitButton = screen.getByRole("button", { name: "submit" });
      await user.click(submitButton);

      // Wait for success message to appear
      await waitFor(() => {
        expect(
          screen.getByText("Email sent successfully!"),
        ).toBeInTheDocument();
      });

      // Advance time by 3 seconds
      await act(async () => {
        await vi.advanceTimersByTimeAsync(3000);
      });

      // Success message should be gone
      await waitFor(() => {
        expect(
          screen.queryByText("Email sent successfully!"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("form submission - error", () => {
    it("displays error message when sendEmail fails", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      mockSendEmail.mockRejectedValue(new Error("Network error"));
      render(<Contact />);

      const nameInput = screen.getByPlaceholderText("namePlaceholder");
      const emailInput = screen.getByPlaceholderText("emailPlaceholder");
      const messageInput = screen.getByPlaceholderText("messagePlaceholder");

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(messageInput, "Hello, this is a test message.");

      const submitButton = screen.getByRole("button", { name: "submit" });
      await user.click(submitButton);

      await waitFor(() => {
        // Error message format: "errorMessage Network error"
        expect(
          screen.getByText(/errorMessage.*Network error/),
        ).toBeInTheDocument();
      });
    });

    it("shows default error when no error message provided", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      mockSendEmail.mockRejectedValue("Unknown error");
      render(<Contact />);

      const nameInput = screen.getByPlaceholderText("namePlaceholder");
      const emailInput = screen.getByPlaceholderText("emailPlaceholder");
      const messageInput = screen.getByPlaceholderText("messagePlaceholder");

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(messageInput, "Hello, this is a test message.");

      const submitButton = screen.getByRole("button", { name: "submit" });
      await user.click(submitButton);

      await waitFor(() => {
        // Falls back to t("errorMessage") twice
        expect(
          screen.getByText(/errorMessage.*errorMessage/),
        ).toBeInTheDocument();
      });
    });

    it("clears error message after 3 seconds", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      mockSendEmail.mockRejectedValue(new Error("Network error"));
      render(<Contact />);

      const nameInput = screen.getByPlaceholderText("namePlaceholder");
      const emailInput = screen.getByPlaceholderText("emailPlaceholder");
      const messageInput = screen.getByPlaceholderText("messagePlaceholder");

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(messageInput, "Hello, this is a test message.");

      const submitButton = screen.getByRole("button", { name: "submit" });
      await user.click(submitButton);

      // Wait for error message to appear
      await waitFor(() => {
        expect(
          screen.getByText(/errorMessage.*Network error/),
        ).toBeInTheDocument();
      });

      // Advance time by 3 seconds
      await act(async () => {
        await vi.advanceTimersByTimeAsync(3000);
      });

      // Error message should be gone
      await waitFor(() => {
        expect(
          screen.queryByText(/errorMessage.*Network error/),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("accessibility", () => {
    it("form fields have associated labels", () => {
      render(<Contact />);

      // Check labels exist
      expect(screen.getByText("nameLabel")).toBeInTheDocument();
      expect(screen.getByText("emailLabel")).toBeInTheDocument();
      expect(screen.getByText("messageLabel")).toBeInTheDocument();
    });

    it("submit button is accessible", () => {
      render(<Contact />);

      const submitButton = screen.getByRole("button", { name: "submit" });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });

    it("success message container has correct styling", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      mockSendEmail.mockResolvedValue("Email sent successfully!");
      render(<Contact />);

      const nameInput = screen.getByPlaceholderText("namePlaceholder");
      const emailInput = screen.getByPlaceholderText("emailPlaceholder");
      const messageInput = screen.getByPlaceholderText("messagePlaceholder");

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(messageInput, "Hello, this is a test message.");

      const submitButton = screen.getByRole("button", { name: "submit" });
      await user.click(submitButton);

      await waitFor(() => {
        const messageContainer = screen.getByText("Email sent successfully!");
        expect(messageContainer).toHaveClass("bg-green-200", "text-green-800");
      });
    });

    it("error message container has correct styling", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      mockSendEmail.mockRejectedValue(new Error("Network error"));
      render(<Contact />);

      const nameInput = screen.getByPlaceholderText("namePlaceholder");
      const emailInput = screen.getByPlaceholderText("emailPlaceholder");
      const messageInput = screen.getByPlaceholderText("messagePlaceholder");

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(messageInput, "Hello, this is a test message.");

      const submitButton = screen.getByRole("button", { name: "submit" });
      await user.click(submitButton);

      await waitFor(() => {
        const messageContainer = screen.getByText(
          /errorMessage.*Network error/,
        );
        expect(messageContainer).toHaveClass("bg-red-200", "text-red-800");
      });
    });
  });
});
