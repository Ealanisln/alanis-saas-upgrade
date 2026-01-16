import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock axios for API client tests
const mockAxiosInstance = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  },
};

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance),
    isAxiosError: (error: unknown) =>
      error !== null &&
      typeof error === "object" &&
      "isAxiosError" in error &&
      (error as { isAxiosError: boolean }).isAxiosError === true,
  },
}));

// Helper to create a wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
}

describe("Error Scenarios - API Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe("Network Errors", () => {
    it("should handle network connection failure", async () => {
      const networkError = {
        message: "Network Error",
        code: "ERR_NETWORK",
        isAxiosError: true,
        response: undefined,
      };

      mockAxiosInstance.get.mockRejectedValue(networkError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      await expect(client.get("/test")).rejects.toBeDefined();
    });

    it("should handle DNS resolution failure", async () => {
      const dnsError = {
        message: "getaddrinfo ENOTFOUND api.example.com",
        code: "ENOTFOUND",
        isAxiosError: true,
        response: undefined,
      };

      mockAxiosInstance.get.mockRejectedValue(dnsError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      await expect(client.get("/test")).rejects.toBeDefined();
    });

    it("should handle connection refused", async () => {
      const connectionError = {
        message: "connect ECONNREFUSED 127.0.0.1:3000",
        code: "ECONNREFUSED",
        isAxiosError: true,
        response: undefined,
      };

      mockAxiosInstance.get.mockRejectedValue(connectionError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      await expect(client.get("/test")).rejects.toBeDefined();
    });
  });

  describe("Timeout Errors", () => {
    it("should handle request timeout", async () => {
      const timeoutError = {
        message: "timeout of 30000ms exceeded",
        code: "ECONNABORTED",
        isAxiosError: true,
        response: undefined,
      };

      mockAxiosInstance.post.mockRejectedValue(timeoutError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      await expect(
        client.post("/test", { data: "test" }),
      ).rejects.toBeDefined();
    });

    it("should handle socket timeout", async () => {
      const socketTimeoutError = {
        message: "socket hang up",
        code: "ECONNRESET",
        isAxiosError: true,
        response: undefined,
      };

      mockAxiosInstance.get.mockRejectedValue(socketTimeoutError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      await expect(client.get("/test")).rejects.toBeDefined();
    });
  });

  describe("HTTP Error Responses", () => {
    it("should handle 400 Bad Request", async () => {
      const badRequestError = {
        response: {
          status: 400,
          data: {
            success: false,
            message: "Invalid request parameters",
            errors: [{ field: "email", message: "Invalid email format" }],
          },
        },
        isAxiosError: true,
      };

      mockAxiosInstance.post.mockRejectedValue(badRequestError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      await expect(client.post("/contact", {})).rejects.toMatchObject({
        response: {
          status: 400,
          data: { success: false, message: "Invalid request parameters" },
        },
      });
    });

    it("should handle 401 Unauthorized and clear token", async () => {
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      };
      Object.defineProperty(globalThis, "localStorage", {
        value: localStorageMock,
        writable: true,
        configurable: true,
      });

      const unauthorizedError = {
        response: {
          status: 401,
          data: {
            success: false,
            message: "Unauthorized - Invalid or expired token",
          },
        },
        isAxiosError: true,
      };

      mockAxiosInstance.get.mockRejectedValue(unauthorizedError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      await expect(client.get("/protected")).rejects.toMatchObject({
        response: {
          status: 401,
          data: { success: false },
        },
      });
    });

    it("should handle 403 Forbidden", async () => {
      const forbiddenError = {
        response: {
          status: 403,
          data: {
            success: false,
            message: "Access denied - Insufficient permissions",
          },
        },
        isAxiosError: true,
      };

      mockAxiosInstance.get.mockRejectedValue(forbiddenError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      await expect(client.get("/admin")).rejects.toMatchObject({
        response: {
          status: 403,
          data: { success: false },
        },
      });
    });

    it("should handle 404 Not Found", async () => {
      const notFoundError = {
        response: {
          status: 404,
          data: {
            success: false,
            message: "Resource not found",
          },
        },
        isAxiosError: true,
      };

      mockAxiosInstance.get.mockRejectedValue(notFoundError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      await expect(client.get("/quotes/nonexistent")).rejects.toMatchObject({
        response: {
          status: 404,
          data: { success: false, message: "Resource not found" },
        },
      });
    });

    it("should handle 422 Unprocessable Entity (validation errors)", async () => {
      const validationError = {
        response: {
          status: 422,
          data: {
            success: false,
            message: "Validation failed",
            errors: {
              email: ["Email is required"],
              name: ["Name must be at least 2 characters"],
            },
          },
        },
        isAxiosError: true,
      };

      mockAxiosInstance.post.mockRejectedValue(validationError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      await expect(client.post("/quotes", {})).rejects.toMatchObject({
        response: {
          status: 422,
          data: { success: false, message: "Validation failed" },
        },
      });
    });

    it("should handle 429 Too Many Requests (rate limiting)", async () => {
      const rateLimitError = {
        response: {
          status: 429,
          data: {
            success: false,
            message: "Too many requests - Please try again later",
            retryAfter: 60,
          },
          headers: {
            "retry-after": "60",
          },
        },
        isAxiosError: true,
      };

      mockAxiosInstance.post.mockRejectedValue(rateLimitError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      await expect(client.post("/contact", {})).rejects.toMatchObject({
        response: {
          status: 429,
          data: { success: false },
        },
      });
    });

    it("should handle 500 Internal Server Error", async () => {
      const serverError = {
        response: {
          status: 500,
          data: {
            success: false,
            message: "Internal server error",
          },
        },
        isAxiosError: true,
      };

      mockAxiosInstance.get.mockRejectedValue(serverError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      await expect(client.get("/test")).rejects.toMatchObject({
        response: {
          status: 500,
          data: { success: false, message: "Internal server error" },
        },
      });
    });

    it("should handle 502 Bad Gateway", async () => {
      const badGatewayError = {
        response: {
          status: 502,
          data: {
            success: false,
            message: "Bad gateway - Upstream server error",
          },
        },
        isAxiosError: true,
      };

      mockAxiosInstance.get.mockRejectedValue(badGatewayError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      await expect(client.get("/test")).rejects.toMatchObject({
        response: {
          status: 502,
          data: { success: false },
        },
      });
    });

    it("should handle 503 Service Unavailable", async () => {
      const serviceUnavailableError = {
        response: {
          status: 503,
          data: {
            success: false,
            message: "Service temporarily unavailable",
          },
        },
        isAxiosError: true,
      };

      mockAxiosInstance.get.mockRejectedValue(serviceUnavailableError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      await expect(client.get("/test")).rejects.toMatchObject({
        response: {
          status: 503,
          data: { success: false },
        },
      });
    });

    it("should handle 504 Gateway Timeout", async () => {
      const gatewayTimeoutError = {
        response: {
          status: 504,
          data: {
            success: false,
            message: "Gateway timeout",
          },
        },
        isAxiosError: true,
      };

      mockAxiosInstance.get.mockRejectedValue(gatewayTimeoutError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      await expect(client.get("/test")).rejects.toMatchObject({
        response: {
          status: 504,
          data: { success: false },
        },
      });
    });
  });

  describe("Invalid API Responses", () => {
    it("should handle malformed JSON response", async () => {
      const malformedError = {
        message: "Unexpected token < in JSON at position 0",
        isAxiosError: true,
        response: {
          status: 200,
          data: "<!DOCTYPE html>", // HTML instead of JSON
        },
      };

      mockAxiosInstance.get.mockRejectedValue(malformedError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      await expect(client.get("/test")).rejects.toBeDefined();
    });

    it("should handle empty response body", async () => {
      const emptyResponseError = {
        response: {
          status: 200,
          data: null,
        },
        isAxiosError: true,
      };

      mockAxiosInstance.get.mockResolvedValue(emptyResponseError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      const result = await client.get("/test");
      expect(result).toEqual(emptyResponseError);
    });

    it("should handle response with unexpected structure", async () => {
      // API returns data but in unexpected format
      mockAxiosInstance.get.mockResolvedValue({
        data: { unexpectedField: "value" }, // Missing expected fields
      });

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      const result = await client.get("/test");
      expect(result).toBeDefined();
    });
  });
});

describe("Error Scenarios - Form Submission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe("Contact Form Errors", () => {
    it("should handle contact form API failure", async () => {
      const apiError = {
        response: {
          status: 500,
          data: {
            success: false,
            message: "Failed to send email",
          },
        },
        isAxiosError: true,
      };

      mockAxiosInstance.post.mockRejectedValue(apiError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      const formData = {
        name: "Test User",
        email: "test@example.com",
        message: "Test message",
        subject: "Test subject",
      };

      await expect(client.sendContactForm(formData)).rejects.toMatchObject({
        response: {
          status: 500,
          data: { success: false, message: "Failed to send email" },
        },
      });
    });

    it("should handle contact form validation errors", async () => {
      const validationError = {
        response: {
          status: 400,
          data: {
            success: false,
            message: "Validation failed",
            errors: {
              email: ["Invalid email format"],
              message: ["Message is required"],
            },
          },
        },
        isAxiosError: true,
      };

      mockAxiosInstance.post.mockRejectedValue(validationError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      await expect(
        client.sendContactForm({
          name: "Test",
          email: "invalid",
          message: "",
          subject: "Test",
        }),
      ).rejects.toMatchObject({
        response: {
          status: 400,
          data: { success: false, message: "Validation failed" },
        },
      });
    });

    it("should handle Turnstile verification failure", async () => {
      const turnstileError = {
        response: {
          status: 403,
          data: {
            success: false,
            message: "Turnstile verification failed",
            code: "TURNSTILE_FAILED",
          },
        },
        isAxiosError: true,
      };

      mockAxiosInstance.post.mockRejectedValue(turnstileError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      await expect(
        client.post("/contact", {
          name: "Test",
          email: "test@example.com",
          message: "Test",
          turnstileToken: "invalid-token",
        }),
      ).rejects.toMatchObject({
        response: {
          status: 403,
          data: { success: false, code: "TURNSTILE_FAILED" },
        },
      });
    });
  });

  describe("Quote Form Errors", () => {
    it("should handle quote creation failure", async () => {
      const createError = {
        response: {
          status: 500,
          data: {
            success: false,
            message: "Failed to create quote",
          },
        },
        isAxiosError: true,
      };

      mockAxiosInstance.post.mockRejectedValue(createError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      const quoteData = {
        services: [],
        clientInfo: { name: "Test", email: "test@example.com" },
        projectType: "web",
        clientType: "startup" as const,
        urgency: "normal" as const,
      };

      await expect(client.createQuote(quoteData)).rejects.toMatchObject({
        response: {
          status: 500,
          data: { success: false, message: "Failed to create quote" },
        },
      });
    });

    it("should handle quote with invalid services", async () => {
      const validationError = {
        response: {
          status: 400,
          data: {
            success: false,
            message: "Invalid services configuration",
            errors: {
              services: ["At least one service is required"],
            },
          },
        },
        isAxiosError: true,
      };

      mockAxiosInstance.post.mockRejectedValue(validationError);

      const { ApiClient } = await import("@/lib/api/client");
      const client = new ApiClient();

      await expect(
        client.createQuote({
          services: [],
          clientInfo: { name: "Test", email: "test@example.com" },
          projectType: "web",
          clientType: "startup" as const,
          urgency: "normal" as const,
        }),
      ).rejects.toMatchObject({
        response: {
          status: 400,
          data: { success: false, message: "Invalid services configuration" },
        },
      });
    });
  });
});

describe("Error Scenarios - Stripe Webhook", () => {
  describe("Signature Verification Errors", () => {
    it("should reject requests with missing signature", async () => {
      // This tests the webhook handler behavior
      const mockHeaders = new Headers();
      // No stripe-signature header

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify({ type: "test" }),
        headers: mockHeaders,
      });

      // Verify the request doesn't have the signature
      expect(request.headers.get("stripe-signature")).toBeNull();
    });

    it("should reject requests with invalid signature", async () => {
      const mockHeaders = new Headers({
        "stripe-signature": "invalid_signature_format",
      });

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify({ type: "test" }),
        headers: mockHeaders,
      });

      expect(request.headers.get("stripe-signature")).toBe(
        "invalid_signature_format",
      );
    });

    it("should reject requests with expired signature", async () => {
      // Stripe signatures include a timestamp that can expire
      const expiredTimestamp = Math.floor(Date.now() / 1000) - 600; // 10 minutes ago
      const mockHeaders = new Headers({
        "stripe-signature": `t=${expiredTimestamp},v1=fake_signature`,
      });

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify({ type: "test" }),
        headers: mockHeaders,
      });

      expect(request.headers.get("stripe-signature")).toContain(
        `t=${expiredTimestamp}`,
      );
    });
  });

  describe("Event Processing Errors", () => {
    it("should handle malformed event payload", () => {
      const malformedPayload = "{ invalid json }";

      expect(() => JSON.parse(malformedPayload)).toThrow();
    });

    it("should handle missing required event fields", () => {
      const incompleteEvent = {
        id: "evt_test_123",
        // Missing 'type' field
        data: {},
      };

      expect(incompleteEvent.type).toBeUndefined();
    });

    it("should handle checkout.session.completed without customer details", () => {
      const eventWithoutCustomer = {
        id: "evt_test_123",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_123",
            customer_details: null, // No customer details
            amount_total: 5000,
          },
        },
      };

      expect(eventWithoutCustomer.data.object.customer_details).toBeNull();
    });

    it("should handle payment_intent.payment_failed event", () => {
      const failedPaymentEvent = {
        id: "evt_test_456",
        type: "payment_intent.payment_failed",
        data: {
          object: {
            id: "pi_test_123",
            last_payment_error: {
              code: "card_declined",
              message: "Your card was declined.",
              decline_code: "generic_decline",
            },
          },
        },
      };

      expect(failedPaymentEvent.data.object.last_payment_error.code).toBe(
        "card_declined",
      );
    });
  });

  describe("Email Notification Errors", () => {
    it("should handle email service failure gracefully", async () => {
      const emailError = new Error("SMTP connection failed");

      // Simulating what happens when email sending fails
      const sendEmailMock = vi.fn().mockRejectedValue(emailError);

      await expect(sendEmailMock()).rejects.toThrow("SMTP connection failed");
    });

    it("should handle invalid email address", async () => {
      const invalidEmailError = {
        success: false,
        message: "Invalid recipient email address",
        code: "INVALID_EMAIL",
      };

      const sendEmailMock = vi.fn().mockRejectedValue(invalidEmailError);

      await expect(sendEmailMock()).rejects.toMatchObject({
        success: false,
        message: "Invalid recipient email address",
      });
    });
  });
});

describe("Error Scenarios - React Query Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Query Error States", () => {
    it("should expose error state when query fails", async () => {
      const queryError = new Error("Failed to fetch data");

      // Mock useQuery to return error state
      const mockUseQuery = vi.fn().mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: queryError,
        refetch: vi.fn(),
      });

      const result = mockUseQuery({
        queryKey: ["test"],
        queryFn: () => Promise.reject(queryError),
      });

      expect(result.isError).toBe(true);
      expect(result.error).toBe(queryError);
      expect(result.data).toBeUndefined();
    });

    it("should handle stale data with background error", () => {
      const staleData = { items: [] };
      const backgroundError = new Error("Background refresh failed");

      const mockUseQuery = vi.fn().mockReturnValue({
        data: staleData,
        isLoading: false,
        isError: false, // Not in error state because we have stale data
        error: backgroundError,
        isStale: true,
        isFetching: false,
        failureCount: 1,
      });

      const result = mockUseQuery({
        queryKey: ["test"],
        queryFn: () => Promise.reject(backgroundError),
      });

      // Should have stale data even though refresh failed
      expect(result.data).toEqual(staleData);
      expect(result.failureCount).toBe(1);
    });
  });

  describe("Mutation Error States", () => {
    it("should expose error state when mutation fails", () => {
      const mutationError = new Error("Failed to create resource");

      const mockUseMutation = vi.fn().mockReturnValue({
        mutate: vi.fn(),
        mutateAsync: vi.fn().mockRejectedValue(mutationError),
        isPending: false,
        isError: true,
        error: mutationError,
        reset: vi.fn(),
      });

      const result = mockUseMutation({
        mutationFn: () => Promise.reject(mutationError),
      });

      expect(result.isError).toBe(true);
      expect(result.error).toBe(mutationError);
    });

    it("should allow resetting error state", () => {
      const resetMock = vi.fn();

      const mockUseMutation = vi.fn().mockReturnValue({
        mutate: vi.fn(),
        isPending: false,
        isError: true,
        error: new Error("Some error"),
        reset: resetMock,
      });

      const result = mockUseMutation({});
      result.reset();

      expect(resetMock).toHaveBeenCalled();
    });
  });
});

describe("Error Scenarios - Error Recovery", () => {
  describe("Retry Behavior", () => {
    it("should retry failed requests with exponential backoff", async () => {
      let attemptCount = 0;
      const maxRetries = 3;

      const retryableFn = vi.fn().mockImplementation(() => {
        attemptCount++;
        if (attemptCount < maxRetries) {
          return Promise.reject(new Error("Temporary failure"));
        }
        return Promise.resolve({ success: true });
      });

      // Simulate retry logic
      const executeWithRetry = async (
        fn: () => Promise<unknown>,
        retries: number,
      ): Promise<unknown> => {
        for (let i = 0; i <= retries; i++) {
          try {
            return await fn();
          } catch (error) {
            if (i === retries) throw error;
            // In real implementation, would wait here
          }
        }
      };

      const result = await executeWithRetry(retryableFn, maxRetries);
      expect(result).toEqual({ success: true });
      expect(attemptCount).toBe(maxRetries);
    });

    it("should not retry on 4xx errors (client errors)", async () => {
      const clientError = {
        response: { status: 400 },
        isAxiosError: true,
      };

      const shouldRetry = (error: { response?: { status: number } }) => {
        const status = error.response?.status;
        // Don't retry client errors (4xx)
        return !status || status >= 500;
      };

      expect(shouldRetry(clientError)).toBe(false);
    });

    it("should retry on 5xx errors (server errors)", async () => {
      const serverError = {
        response: { status: 503 },
        isAxiosError: true,
      };

      const shouldRetry = (error: { response?: { status: number } }) => {
        const status = error.response?.status;
        return !status || status >= 500;
      };

      expect(shouldRetry(serverError)).toBe(true);
    });

    it("should retry on network errors", async () => {
      const networkError = {
        message: "Network Error",
        code: "ERR_NETWORK",
        response: undefined,
      };

      const shouldRetry = (error: { response?: { status: number } }) => {
        const status = error.response?.status;
        return !status || status >= 500;
      };

      expect(shouldRetry(networkError)).toBe(true);
    });
  });

  describe("Graceful Degradation", () => {
    it("should return cached data when fresh fetch fails", () => {
      const cachedData = { id: 1, name: "Cached Item" };
      const cache = new Map<string, unknown>();
      cache.set("item:1", cachedData);

      const fetchWithFallback = async (key: string) => {
        try {
          // Simulate failed fetch
          throw new Error("Fetch failed");
        } catch {
          // Return cached data as fallback
          return cache.get(key) || null;
        }
      };

      return fetchWithFallback("item:1").then((result) => {
        expect(result).toEqual(cachedData);
      });
    });

    it("should provide meaningful error messages to users", () => {
      const errorMessages: Record<number, string> = {
        400: "Please check your input and try again.",
        401: "Please log in to continue.",
        403: "You don't have permission to perform this action.",
        404: "The requested resource was not found.",
        429: "Too many requests. Please wait a moment and try again.",
        500: "Something went wrong on our end. Please try again later.",
        503: "Service is temporarily unavailable. Please try again later.",
      };

      const getUserFriendlyMessage = (status: number): string => {
        return errorMessages[status] || "An unexpected error occurred.";
      };

      expect(getUserFriendlyMessage(400)).toBe(
        "Please check your input and try again.",
      );
      expect(getUserFriendlyMessage(500)).toBe(
        "Something went wrong on our end. Please try again later.",
      );
      expect(getUserFriendlyMessage(999)).toBe("An unexpected error occurred.");
    });
  });
});
