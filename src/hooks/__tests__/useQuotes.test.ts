import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useQuotes, useQuotesLegacy } from "../useQuotes";

// Mock data
const mockQuotesResponse = {
  success: true,
  data: [
    {
      id: "1",
      quoteNumber: "Q-001",
      total: 1000,
      status: "draft" as const,
      validUntil: "2024-12-31",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      services: [],
      clientInfo: { name: "Test Client", email: "test@test.com" },
    },
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
};

// Mock React Query
const mockInvalidateQueries = vi.fn();
const mockRemoveQueries = vi.fn();
const mockQueryClient = {
  invalidateQueries: mockInvalidateQueries,
  removeQueries: mockRemoveQueries,
};

const mockRefetch = vi.fn();
const mockReset = vi.fn();

let mockQueryData: typeof mockQuotesResponse | null = mockQuotesResponse;
let mockQueryLoading = false;
let mockQueryError: Error | null = null;
let mockMutationPending = false;
let mockMutationError: Error | null = null;

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(() => ({
    data: mockQueryData,
    isLoading: mockQueryLoading,
    error: mockQueryError,
    refetch: mockRefetch,
  })),
  useMutation: vi.fn((options) => ({
    mutate: vi.fn(),
    mutateAsync: options.mutationFn,
    isPending: mockMutationPending,
    error: mockMutationError,
    reset: mockReset,
  })),
  useQueryClient: vi.fn(() => mockQueryClient),
}));

// Mock API client
const mockFetchQuotes = vi.fn().mockResolvedValue(mockQuotesResponse);
const mockPost = vi.fn();

const mockApiClient = {
  fetchQuotes: mockFetchQuotes,
  createQuote: vi.fn(),
  sendEmail: vi.fn(),
  syncWithInvoiceNinja: vi.fn(),
  post: mockPost,
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

vi.mock("@/lib/api/client", () => ({
  createApiClient: vi.fn(() => mockApiClient),
}));

// Mock useApi
vi.mock("../useApi", () => ({
  useApi: vi.fn(() => ({
    client: mockApiClient,
    queries: { useQuotes: vi.fn() },
    mutations: {
      useCreateQuote: vi.fn(),
      useSendEmail: vi.fn(),
      useSyncWithInvoiceNinja: vi.fn(),
    },
  })),
}));

import { useQuery, useMutation } from "@tanstack/react-query";

describe("useQuotes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQueryData = mockQuotesResponse;
    mockQueryLoading = false;
    mockQueryError = null;
    mockMutationPending = false;
    mockMutationError = null;
    mockPost.mockReset();
  });

  describe("return structure", () => {
    it("returns correct object structure", () => {
      const { result } = renderHook(() => useQuotes());

      // Data
      expect(result.current).toHaveProperty("quotes");
      expect(result.current).toHaveProperty("pagination");

      // Loading states
      expect(result.current).toHaveProperty("loading");
      expect(result.current).toHaveProperty("creating");
      expect(result.current).toHaveProperty("syncing");

      // Error state
      expect(result.current).toHaveProperty("error");

      // Actions
      expect(result.current).toHaveProperty("createQuote");
      expect(result.current).toHaveProperty("syncWithInvoiceNinja");
      expect(result.current).toHaveProperty("refetch");

      // Utilities
      expect(result.current).toHaveProperty("clearError");
      expect(result.current).toHaveProperty("reset");
    });
  });

  describe("query behavior", () => {
    it("calls useQuery with correct queryKey including options", () => {
      const options = {
        page: 2,
        limit: 20,
        status: "draft",
        clientType: "startup",
      };
      renderHook(() => useQuotes(options));

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ["quotes", options],
          staleTime: 5 * 60 * 1000,
          enabled: true,
        }),
      );
    });

    it("works with empty options", () => {
      renderHook(() => useQuotes());

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ["quotes", {}],
        }),
      );
    });

    it("returns quotes array from response data", () => {
      const { result } = renderHook(() => useQuotes());

      expect(result.current.quotes).toEqual(mockQuotesResponse.data);
    });

    it("returns empty array if data is not an array", () => {
      mockQueryData = {
        ...mockQuotesResponse,
        data: null as unknown as typeof mockQuotesResponse.data,
      };
      const { result } = renderHook(() => useQuotes());

      expect(result.current.quotes).toEqual([]);
    });

    it("returns empty array if no data", () => {
      mockQueryData = null;
      const { result } = renderHook(() => useQuotes());

      expect(result.current.quotes).toEqual([]);
    });

    it("returns pagination from response", () => {
      const { result } = renderHook(() => useQuotes());

      expect(result.current.pagination).toEqual(mockQuotesResponse.pagination);
    });
  });

  describe("loading states", () => {
    it("returns loading state from query", () => {
      mockQueryLoading = true;
      const { result } = renderHook(() => useQuotes());

      expect(result.current.loading).toBe(true);
    });

    it("returns creating state from mutation", () => {
      mockMutationPending = true;
      const { result } = renderHook(() => useQuotes());

      expect(result.current.creating).toBe(true);
    });
  });

  describe("error handling", () => {
    it("returns error message from query error", () => {
      mockQueryError = new Error("Query failed");
      const { result } = renderHook(() => useQuotes());

      expect(result.current.error).toBe("Query failed");
    });

    it("returns null when no errors", () => {
      const { result } = renderHook(() => useQuotes());

      expect(result.current.error).toBeNull();
    });
  });

  describe("createQuote mutation", () => {
    it("transforms QuoteRequest to API format", async () => {
      mockPost.mockResolvedValue({
        success: true,
        data: { id: "new-quote-id" },
      });

      const { result } = renderHook(() => useQuotes());

      const quoteRequest = {
        clientInfo: {
          name: "John Doe",
          email: "john@example.com",
          company: "ACME Inc",
          phone: "123-456-7890",
        },
        clientType: "startup" as const,
        urgency: "normal" as const,
        services: [
          {
            id: "1",
            name: "Web Dev",
            quantity: 1,
            price: 1000,
            total: 1000,
            category: "dev",
          },
        ],
        projectDetails: {
          description: "A new project",
          deadline: new Date("2024-12-31"),
          budget: 5000,
          requirements: ["req1", "req2"],
        },
        projectType: "web",
      };

      await result.current.createQuote(quoteRequest);

      expect(mockPost).toHaveBeenCalledWith("/quotes", {
        clientName: "John Doe",
        clientEmail: "john@example.com",
        clientCompany: "ACME Inc",
        clientPhone: "123-456-7890",
        clientType: "startup",
        urgency: "normal",
        services: quoteRequest.services,
        subtotal: 0,
        discounts: 0,
        taxes: 0,
        total: 0,
        estimatedDelivery: 0,
        totalHours: 0,
        projectDescription: "A new project",
        deadline: "2024-12-31T00:00:00.000Z",
        budget: 5000,
        requirements: ["req1", "req2"],
      });
    });

    it("throws error when response is not successful", async () => {
      mockPost.mockResolvedValue({
        success: false,
        message: "Validation failed",
      });

      const { result } = renderHook(() => useQuotes());

      await expect(
        result.current.createQuote({
          clientInfo: {},
          clientType: "startup",
          urgency: "normal",
          services: [],
          projectType: "web",
        }),
      ).rejects.toThrow("Validation failed");
    });

    it("throws default error message when no message provided", async () => {
      mockPost.mockResolvedValue({
        success: false,
      });

      const { result } = renderHook(() => useQuotes());

      await expect(
        result.current.createQuote({
          clientInfo: {},
          clientType: "startup",
          urgency: "normal",
          services: [],
          projectType: "web",
        }),
      ).rejects.toThrow("Error creating quote");
    });

    it("returns response data on success", async () => {
      const responseData = { id: "quote-123", quoteNumber: "Q-001" };
      mockPost.mockResolvedValue({
        success: true,
        data: responseData,
      });

      const { result } = renderHook(() => useQuotes());

      const response = await result.current.createQuote({
        clientInfo: {},
        clientType: "startup",
        urgency: "normal",
        services: [],
        projectType: "web",
      });

      expect(response).toEqual(responseData);
    });
  });

  describe("syncWithInvoiceNinja mutation", () => {
    it("posts to correct endpoint", async () => {
      mockPost.mockResolvedValue({
        success: true,
        data: { invoiceId: "inv-123" },
      });

      const { result } = renderHook(() => useQuotes());

      const quoteData = {
        id: "quote-1",
        quoteNumber: "Q-001",
        total: 1000,
        status: "draft" as const,
        validUntil: "2024-12-31",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
        services: [],
        clientInfo: { name: "Test" },
      };

      await result.current.syncWithInvoiceNinja(quoteData);

      expect(mockPost).toHaveBeenCalledWith("/quotes/invoice-ninja", quoteData);
    });

    it("throws error when sync fails", async () => {
      mockPost.mockResolvedValue({
        success: false,
        message: "Sync failed",
      });

      const { result } = renderHook(() => useQuotes());

      await expect(
        result.current.syncWithInvoiceNinja({
          id: "1",
          quoteNumber: "Q-001",
          total: 1000,
          status: "draft",
          validUntil: "2024-12-31",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
          services: [],
          clientInfo: {},
        }),
      ).rejects.toThrow("Sync failed");
    });
  });

  describe("utility functions", () => {
    it("refetch calls query refetch", () => {
      const { result } = renderHook(() => useQuotes());

      result.current.refetch();

      expect(mockRefetch).toHaveBeenCalled();
    });

    it("clearError resets mutations", () => {
      const { result } = renderHook(() => useQuotes());

      result.current.clearError();

      // clearError should reset both mutations
      expect(mockReset).toHaveBeenCalledTimes(2);
    });

    it("reset removes queries and resets mutations", () => {
      const { result } = renderHook(() => useQuotes());

      result.current.reset();

      expect(mockRemoveQueries).toHaveBeenCalledWith({ queryKey: ["quotes"] });
      // reset should reset both mutations
      expect(mockReset).toHaveBeenCalledTimes(2);
    });
  });
});

describe("useQuotesLegacy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQueryData = mockQuotesResponse;
    mockQueryLoading = false;
    mockMutationPending = false;
  });

  it("returns backwards-compatible shape", () => {
    const { result } = renderHook(() => useQuotesLegacy());

    expect(result.current).toHaveProperty("loading");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("quotes");
    expect(result.current).toHaveProperty("currentQuote");
    expect(result.current).toHaveProperty("createQuote");
    expect(result.current).toHaveProperty("getQuotes");
    expect(result.current).toHaveProperty("clearError");
    expect(result.current).toHaveProperty("reset");
  });

  it("currentQuote is null", () => {
    const { result } = renderHook(() => useQuotesLegacy());

    expect(result.current.currentQuote).toBeNull();
  });

  it("loading combines loading and creating states", () => {
    mockQueryLoading = true;
    const { result } = renderHook(() => useQuotesLegacy());

    expect(result.current.loading).toBe(true);
  });

  it("getQuotes logs deprecation warning in development", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { result } = renderHook(() => useQuotesLegacy());
    await result.current.getQuotes();

    expect(consoleSpy).toHaveBeenCalledWith(
      "getQuotes is deprecated. Use the reactive queries instead.",
    );

    consoleSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });
});
