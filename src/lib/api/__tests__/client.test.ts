import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { InternalAxiosRequestConfig } from "axios";

// Store interceptor callbacks for testing
let requestInterceptorSuccess:
  | ((config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig)
  | null = null;
let requestInterceptorError: ((error: unknown) => Promise<never>) | null = null;
let responseInterceptorSuccess: ((response: unknown) => unknown) | null = null;
let responseInterceptorError: ((error: unknown) => Promise<never>) | null =
  null;

// Mock axios instance methods
const mockGet = vi.fn();
const mockPost = vi.fn();
const mockPut = vi.fn();
const mockDelete = vi.fn();

// Mock axios before importing the client
vi.mock("axios", () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: {
        use: vi.fn(),
      },
      response: {
        use: vi.fn(),
      },
    },
  };

  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
  };
});

// Import axios to get access to mocked functions
import axios from "axios";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

describe("ApiClient", () => {
  let originalWindow: typeof globalThis.window;
  let originalEnv: string | undefined;
  let mockAxiosInstance: ReturnType<typeof axios.create>;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Reset modules to get fresh ApiClient
    vi.resetModules();

    originalWindow = globalThis.window;
    originalEnv = process.env.NODE_ENV;

    // Setup localStorage mock
    Object.defineProperty(globalThis, "localStorage", {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });

    // Reset interceptor callbacks
    requestInterceptorSuccess = null;
    requestInterceptorError = null;
    responseInterceptorSuccess = null;
    responseInterceptorError = null;

    // Setup mock axios instance with interceptor capture
    mockAxiosInstance = {
      get: mockGet,
      post: mockPost,
      put: mockPut,
      delete: mockDelete,
      interceptors: {
        request: {
          use: vi.fn((successFn, errorFn) => {
            requestInterceptorSuccess = successFn;
            requestInterceptorError = errorFn;
            return 0;
          }),
        },
        response: {
          use: vi.fn((successFn, errorFn) => {
            responseInterceptorSuccess = successFn;
            responseInterceptorError = errorFn;
            return 0;
          }),
        },
      },
    } as unknown as ReturnType<typeof axios.create>;

    // Update the mock to use our instance
    vi.mocked(axios.create).mockReturnValue(mockAxiosInstance);
  });

  afterEach(() => {
    globalThis.window = originalWindow;
    process.env.NODE_ENV = originalEnv;
  });

  describe("constructor", () => {
    it("creates axios instance with default baseURL", async () => {
      const { ApiClient } = await import("../client");
      new ApiClient();

      expect(axios.create).toHaveBeenCalledWith({
        baseURL: "https://api.alanis.dev",
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
        },
      });
    });

    it("creates axios instance with custom baseURL", async () => {
      const { ApiClient } = await import("../client");
      new ApiClient("https://custom.api.com");

      expect(axios.create).toHaveBeenCalledWith({
        baseURL: "https://custom.api.com",
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
        },
      });
    });

    it("sets up request interceptor", async () => {
      const { ApiClient } = await import("../client");
      new ApiClient();

      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
    });

    it("sets up response interceptor", async () => {
      const { ApiClient } = await import("../client");
      new ApiClient();

      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe("request interceptor", () => {
    it("adds Bearer token when present in localStorage", async () => {
      localStorageMock.getItem.mockReturnValue("test-token-123");
      const { ApiClient } = await import("../client");
      new ApiClient();

      const config = {
        headers: {},
      } as InternalAxiosRequestConfig;

      const result = requestInterceptorSuccess!(config);

      expect(result.headers.Authorization).toBe("Bearer test-token-123");
    });

    it("does not add token when localStorage returns null", async () => {
      localStorageMock.getItem.mockReturnValue(null);
      const { ApiClient } = await import("../client");
      new ApiClient();

      const config = {
        headers: {},
      } as InternalAxiosRequestConfig;

      const result = requestInterceptorSuccess!(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it("preserves existing headers", async () => {
      localStorageMock.getItem.mockReturnValue("token");
      const { ApiClient } = await import("../client");
      new ApiClient();

      const config = {
        headers: {
          "X-Custom-Header": "custom-value",
        },
      } as InternalAxiosRequestConfig;

      const result = requestInterceptorSuccess!(config);

      expect(result.headers["X-Custom-Header"]).toBe("custom-value");
      expect(result.headers.Authorization).toBe("Bearer token");
    });

    it("rejects request errors", async () => {
      const { ApiClient } = await import("../client");
      new ApiClient();

      const error = new Error("Request failed");

      await expect(requestInterceptorError!(error)).rejects.toThrow(
        "Request failed",
      );
    });

    it("does not add token in SSR mode (window undefined)", async () => {
      // @ts-expect-error - simulating SSR
      delete globalThis.window;
      const { ApiClient } = await import("../client");
      new ApiClient();

      const config = {
        headers: {},
      } as InternalAxiosRequestConfig;

      const result = requestInterceptorSuccess!(config);

      expect(result.headers.Authorization).toBeUndefined();
    });
  });

  describe("response interceptor - success", () => {
    it("unwraps response.data", async () => {
      const { ApiClient } = await import("../client");
      new ApiClient();

      const response = {
        data: { success: true, data: { id: "123" } },
        status: 200,
      };

      const result = responseInterceptorSuccess!(response);

      expect(result).toEqual({ success: true, data: { id: "123" } });
    });
  });

  describe("response interceptor - error handling", () => {
    it("removes token on 401 error", async () => {
      const { ApiClient } = await import("../client");
      new ApiClient();

      const error = {
        response: {
          status: 401,
          data: { success: false, message: "Unauthorized" },
        },
      };

      await expect(responseInterceptorError!(error)).rejects.toEqual({
        success: false,
        message: "Unauthorized",
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith("auth_token");
    });

    it("logs error in development mode", async () => {
      process.env.NODE_ENV = "development";
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const { ApiClient } = await import("../client");
      new ApiClient();

      const error = {
        response: {
          status: 500,
          data: { success: false, message: "Server error" },
        },
      };

      await expect(responseInterceptorError!(error)).rejects.toBeDefined();

      expect(consoleSpy).toHaveBeenCalledWith("API Error:", error);
      consoleSpy.mockRestore();
    });

    it("does not log error in production mode", async () => {
      process.env.NODE_ENV = "production";
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const { ApiClient } = await import("../client");
      new ApiClient();

      const error = {
        response: {
          status: 500,
          data: { success: false, message: "Server error" },
        },
      };

      await expect(responseInterceptorError!(error)).rejects.toBeDefined();

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("returns API error from response data", async () => {
      const { ApiClient } = await import("../client");
      new ApiClient();

      const error = {
        response: {
          status: 400,
          data: {
            success: false,
            message: "Validation failed",
            data: null,
          },
        },
      };

      await expect(responseInterceptorError!(error)).rejects.toEqual({
        success: false,
        message: "Validation failed",
        data: null,
      });
    });

    it("handles network errors with fallback message", async () => {
      const { ApiClient } = await import("../client");
      new ApiClient();

      const error = {
        message: "Network Error",
        response: undefined,
      };

      await expect(responseInterceptorError!(error)).rejects.toEqual({
        success: false,
        message: "Network Error",
        data: null,
      });
    });

    it("handles errors without message with default fallback", async () => {
      const { ApiClient } = await import("../client");
      new ApiClient();

      const error = {
        response: undefined,
        message: undefined,
      };

      await expect(responseInterceptorError!(error)).rejects.toEqual({
        success: false,
        message: "Network error occurred",
        data: null,
      });
    });

    it("does not remove token on non-401 errors", async () => {
      const { ApiClient } = await import("../client");
      new ApiClient();

      const error = {
        response: {
          status: 500,
          data: { success: false, message: "Server error" },
        },
      };

      await expect(responseInterceptorError!(error)).rejects.toBeDefined();

      expect(localStorageMock.removeItem).not.toHaveBeenCalled();
    });
  });

  describe("generic HTTP methods", () => {
    it("get() calls axios.get with endpoint and params", async () => {
      const { ApiClient } = await import("../client");
      const client = new ApiClient();

      const mockResponse = { success: true, data: [] };
      mockGet.mockResolvedValue(mockResponse);

      await client.get("/test", { page: 1 });

      expect(mockGet).toHaveBeenCalledWith("/test", { params: { page: 1 } });
    });

    it("get() works without params", async () => {
      const { ApiClient } = await import("../client");
      const client = new ApiClient();

      const mockResponse = { success: true };
      mockGet.mockResolvedValue(mockResponse);

      await client.get("/test");

      expect(mockGet).toHaveBeenCalledWith("/test", { params: undefined });
    });

    it("post() calls axios.post with endpoint and data", async () => {
      const { ApiClient } = await import("../client");
      const client = new ApiClient();

      const mockResponse = { success: true };
      mockPost.mockResolvedValue(mockResponse);

      await client.post("/test", { name: "test" });

      expect(mockPost).toHaveBeenCalledWith("/test", { name: "test" });
    });

    it("put() calls axios.put with endpoint and data", async () => {
      const { ApiClient } = await import("../client");
      const client = new ApiClient();

      const mockResponse = { success: true };
      mockPut.mockResolvedValue(mockResponse);

      await client.put("/test/123", { name: "updated" });

      expect(mockPut).toHaveBeenCalledWith("/test/123", { name: "updated" });
    });

    it("delete() calls axios.delete with endpoint", async () => {
      const { ApiClient } = await import("../client");
      const client = new ApiClient();

      const mockResponse = { success: true };
      mockDelete.mockResolvedValue(mockResponse);

      await client.delete("/test/123");

      expect(mockDelete).toHaveBeenCalledWith("/test/123");
    });
  });

  describe("domain-specific methods", () => {
    describe("fetchQuotes", () => {
      it("calls GET /quotes with params", async () => {
        const { ApiClient } = await import("../client");
        const client = new ApiClient();

        const mockResponse = { success: true, data: [], pagination: {} };
        mockGet.mockResolvedValue(mockResponse);

        await client.fetchQuotes({ page: 1, limit: 10, status: "draft" });

        expect(mockGet).toHaveBeenCalledWith("/quotes", {
          params: { page: 1, limit: 10, status: "draft" },
        });
      });

      it("calls GET /quotes without params", async () => {
        const { ApiClient } = await import("../client");
        const client = new ApiClient();

        const mockResponse = { success: true, data: [] };
        mockGet.mockResolvedValue(mockResponse);

        await client.fetchQuotes();

        expect(mockGet).toHaveBeenCalledWith("/quotes", { params: undefined });
      });
    });

    describe("createQuote", () => {
      it("calls POST /quotes with request data", async () => {
        const { ApiClient } = await import("../client");
        const client = new ApiClient();

        const mockResponse = { success: true, data: { id: "123" } };
        mockPost.mockResolvedValue(mockResponse);

        const request = {
          services: [],
          clientInfo: { name: "Test" },
          projectType: "web",
          clientType: "startup" as const,
          urgency: "normal" as const,
        };

        await client.createQuote(request);

        expect(mockPost).toHaveBeenCalledWith("/quotes", request);
      });
    });

    describe("getQuote", () => {
      it("calls GET /quotes/:id", async () => {
        const { ApiClient } = await import("../client");
        const client = new ApiClient();

        const mockResponse = { success: true, data: { id: "123" } };
        mockGet.mockResolvedValue(mockResponse);

        await client.getQuote("123");

        expect(mockGet).toHaveBeenCalledWith("/quotes/123", {
          params: undefined,
        });
      });
    });

    describe("updateQuote", () => {
      it("calls PUT /quotes/:id with partial request", async () => {
        const { ApiClient } = await import("../client");
        const client = new ApiClient();

        const mockResponse = { success: true, data: { id: "123" } };
        mockPut.mockResolvedValue(mockResponse);

        await client.updateQuote("123", { projectType: "mobile" });

        expect(mockPut).toHaveBeenCalledWith("/quotes/123", {
          projectType: "mobile",
        });
      });
    });

    describe("deleteQuote", () => {
      it("calls DELETE /quotes/:id", async () => {
        const { ApiClient } = await import("../client");
        const client = new ApiClient();

        const mockResponse = { success: true, data: { id: "123" } };
        mockDelete.mockResolvedValue(mockResponse);

        await client.deleteQuote("123");

        expect(mockDelete).toHaveBeenCalledWith("/quotes/123");
      });
    });

    describe("sendEmail", () => {
      it("calls POST /emails/send with email data", async () => {
        const { ApiClient } = await import("../client");
        const client = new ApiClient();

        const mockResponse = { success: true, data: { messageId: "msg-123" } };
        mockPost.mockResolvedValue(mockResponse);

        const request = {
          to: ["test@example.com"],
          subject: "Test",
          content: "Test content",
        };

        await client.sendEmail(request);

        expect(mockPost).toHaveBeenCalledWith("/emails/send", request);
      });
    });

    describe("syncWithInvoiceNinja", () => {
      it("calls POST /quotes/sync/invoice-ninja", async () => {
        const { ApiClient } = await import("../client");
        const client = new ApiClient();

        const mockResponse = { success: true, data: { invoiceId: "inv-123" } };
        mockPost.mockResolvedValue(mockResponse);

        const quoteData = {
          services: [],
          clientInfo: { name: "Test" },
          projectType: "web",
          clientType: "startup" as const,
          urgency: "normal" as const,
        };

        await client.syncWithInvoiceNinja(quoteData);

        expect(mockPost).toHaveBeenCalledWith(
          "/quotes/sync/invoice-ninja",
          quoteData,
        );
      });
    });

    describe("sendContactForm", () => {
      it("calls POST /contact with form data", async () => {
        const { ApiClient } = await import("../client");
        const client = new ApiClient();

        const mockResponse = { success: true, data: { success: true } };
        mockPost.mockResolvedValue(mockResponse);

        const data = {
          name: "John Doe",
          email: "john@example.com",
          message: "Hello",
          subject: "Inquiry",
        };

        await client.sendContactForm(data);

        expect(mockPost).toHaveBeenCalledWith("/contact", data);
      });
    });

    describe("healthCheck", () => {
      it("calls GET /health", async () => {
        const { ApiClient } = await import("../client");
        const client = new ApiClient();

        const mockResponse = {
          success: true,
          data: { status: "ok", timestamp: "2024-01-01" },
        };
        mockGet.mockResolvedValue(mockResponse);

        await client.healthCheck();

        expect(mockGet).toHaveBeenCalledWith("/health", { params: undefined });
      });
    });
  });
});

describe("createApiClient (singleton)", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns same instance on subsequent calls", async () => {
    const { createApiClient } = await import("../client");
    const client1 = createApiClient();
    const client2 = createApiClient();

    expect(client1).toBe(client2);
  });

  it("returns an ApiClient instance with expected methods", async () => {
    const { createApiClient } = await import("../client");
    const client = createApiClient();

    expect(client).toHaveProperty("get");
    expect(client).toHaveProperty("post");
    expect(client).toHaveProperty("put");
    expect(client).toHaveProperty("delete");
    expect(client).toHaveProperty("fetchQuotes");
    expect(client).toHaveProperty("createQuote");
  });
});
