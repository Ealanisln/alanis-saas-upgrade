import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { renderHook } from "@testing-library/react";
import { useApi } from "../useApi";

// Mock React Query
const mockInvalidateQueries = vi.fn();
const mockQueryClient = {
  invalidateQueries: mockInvalidateQueries,
  removeQueries: vi.fn(),
};

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn((options) => ({
    data: null,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
    ...options,
  })),
  useMutation: vi.fn((options) => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isPending: false,
    error: null,
    reset: vi.fn(),
    ...options,
  })),
  useQueryClient: vi.fn(() => mockQueryClient),
}));

// Mock API client
const mockFetchQuotes = vi.fn();
const mockCreateQuote = vi.fn();
const mockSendEmail = vi.fn();
const mockSyncWithInvoiceNinja = vi.fn();
const mockPost = vi.fn();

const mockApiClient = {
  fetchQuotes: mockFetchQuotes,
  createQuote: mockCreateQuote,
  sendEmail: mockSendEmail,
  syncWithInvoiceNinja: mockSyncWithInvoiceNinja,
  post: mockPost,
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

vi.mock("@/lib/api/client", () => ({
  createApiClient: vi.fn(() => mockApiClient),
}));

import { useQuery, useMutation } from "@tanstack/react-query";

describe("useApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("hook structure", () => {
    it("returns correct object structure", () => {
      const { result } = renderHook(() => useApi());

      expect(result.current).toHaveProperty("client");
      expect(result.current).toHaveProperty("queries");
      expect(result.current).toHaveProperty("mutations");
      expect(result.current.queries).toHaveProperty("useQuotes");
      expect(result.current.mutations).toHaveProperty("useCreateQuote");
      expect(result.current.mutations).toHaveProperty("useSendEmail");
      expect(result.current.mutations).toHaveProperty(
        "useSyncWithInvoiceNinja",
      );
    });

    it("returns functions for queries and mutations", () => {
      const { result } = renderHook(() => useApi());

      expect(typeof result.current.queries.useQuotes).toBe("function");
      expect(typeof result.current.mutations.useCreateQuote).toBe("function");
      expect(typeof result.current.mutations.useSendEmail).toBe("function");
      expect(typeof result.current.mutations.useSyncWithInvoiceNinja).toBe(
        "function",
      );
    });

    it("memoizes the API client across re-renders", () => {
      const { result, rerender } = renderHook(() => useApi());
      const firstClient = result.current.client;

      rerender();
      const secondClient = result.current.client;

      expect(firstClient).toBe(secondClient);
    });
  });

  describe("queries.useQuotes", () => {
    it("calls useQuery with correct parameters", () => {
      const { result } = renderHook(() => useApi());
      result.current.queries.useQuotes();

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ["quotes"],
          staleTime: 5 * 60 * 1000, // 5 minutes
        }),
      );
    });

    it("uses queryFn that calls client.fetchQuotes", () => {
      const { result } = renderHook(() => useApi());
      result.current.queries.useQuotes();

      const lastCall = (useQuery as Mock).mock.calls[
        (useQuery as Mock).mock.calls.length - 1
      ][0];
      expect(lastCall.queryFn).toBeDefined();

      // Execute the queryFn to verify it calls fetchQuotes
      lastCall.queryFn();
      expect(mockFetchQuotes).toHaveBeenCalled();
    });
  });

  describe("mutations.useCreateQuote", () => {
    it("calls useMutation with correct mutationFn", () => {
      const { result } = renderHook(() => useApi());
      result.current.mutations.useCreateQuote();

      expect(useMutation).toHaveBeenCalled();
      const lastCall = (useMutation as Mock).mock.calls[
        (useMutation as Mock).mock.calls.length - 1
      ][0];
      expect(lastCall.mutationFn).toBeDefined();
    });

    it("mutationFn calls client.createQuote with data", async () => {
      const { result } = renderHook(() => useApi());
      result.current.mutations.useCreateQuote();

      const lastCall = (useMutation as Mock).mock.calls[
        (useMutation as Mock).mock.calls.length - 1
      ][0];

      const mockQuoteData = {
        services: [],
        clientInfo: { name: "Test", email: "test@test.com" },
        projectType: "web",
        clientType: "startup" as const,
        urgency: "normal" as const,
      };

      await lastCall.mutationFn(mockQuoteData);
      expect(mockCreateQuote).toHaveBeenCalledWith(mockQuoteData);
    });

    it("invalidates quotes cache on success", () => {
      const { result } = renderHook(() => useApi());
      result.current.mutations.useCreateQuote();

      const lastCall = (useMutation as Mock).mock.calls[
        (useMutation as Mock).mock.calls.length - 1
      ][0];

      expect(lastCall.onSuccess).toBeDefined();
      lastCall.onSuccess();
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ["quotes"],
      });
    });
  });

  describe("mutations.useSendEmail", () => {
    it("calls useMutation with correct mutationFn", () => {
      const { result } = renderHook(() => useApi());
      result.current.mutations.useSendEmail();

      expect(useMutation).toHaveBeenCalled();
    });

    it("mutationFn calls client.sendEmail with data", async () => {
      const { result } = renderHook(() => useApi());
      result.current.mutations.useSendEmail();

      const lastCall = (useMutation as Mock).mock.calls[
        (useMutation as Mock).mock.calls.length - 1
      ][0];

      const mockEmailData = {
        to: ["test@test.com"],
        subject: "Test",
        content: "Test content",
      };

      await lastCall.mutationFn(mockEmailData);
      expect(mockSendEmail).toHaveBeenCalledWith(mockEmailData);
    });

    it("does not have onSuccess callback", () => {
      const { result } = renderHook(() => useApi());
      result.current.mutations.useSendEmail();

      const lastCall = (useMutation as Mock).mock.calls[
        (useMutation as Mock).mock.calls.length - 1
      ][0];

      expect(lastCall.onSuccess).toBeUndefined();
    });
  });

  describe("mutations.useSyncWithInvoiceNinja", () => {
    it("calls useMutation with correct mutationFn", () => {
      const { result } = renderHook(() => useApi());
      result.current.mutations.useSyncWithInvoiceNinja();

      expect(useMutation).toHaveBeenCalled();
    });

    it("mutationFn calls client.syncWithInvoiceNinja with data", async () => {
      const { result } = renderHook(() => useApi());
      result.current.mutations.useSyncWithInvoiceNinja();

      const lastCall = (useMutation as Mock).mock.calls[
        (useMutation as Mock).mock.calls.length - 1
      ][0];

      const mockQuoteData = {
        services: [],
        clientInfo: { name: "Test", email: "test@test.com" },
        projectType: "web",
        clientType: "startup" as const,
        urgency: "normal" as const,
      };

      await lastCall.mutationFn(mockQuoteData);
      expect(mockSyncWithInvoiceNinja).toHaveBeenCalledWith(mockQuoteData);
    });
  });
});
