import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Sanity Environment Configuration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("apiVersion", () => {
    it("uses environment variable when set", async () => {
      process.env.NEXT_PUBLIC_SANITY_API_VERSION = "2025-01-01";
      const { apiVersion } = await import("../env");
      expect(apiVersion).toBe("2025-01-01");
    });

    it("uses default value when not set", async () => {
      delete process.env.NEXT_PUBLIC_SANITY_API_VERSION;
      const { apiVersion } = await import("../env");
      expect(apiVersion).toBe("2024-01-14");
    });
  });

  describe("dataset", () => {
    it("uses environment variable when set", async () => {
      process.env.NEXT_PUBLIC_SANITY_DATASET = "staging";
      const { dataset } = await import("../env");
      expect(dataset).toBe("staging");
    });

    it("uses default value when not set", async () => {
      delete process.env.NEXT_PUBLIC_SANITY_DATASET;
      const { dataset } = await import("../env");
      expect(dataset).toBe("production");
    });
  });

  describe("projectId", () => {
    it("uses environment variable when set", async () => {
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "my-project-id";
      const { projectId } = await import("../env");
      expect(projectId).toBe("my-project-id");
    });

    it("uses empty string when not set", async () => {
      delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
      const { projectId } = await import("../env");
      expect(projectId).toBe("");
    });
  });

  describe("useCdn", () => {
    it("is set to false", async () => {
      const { useCdn } = await import("../env");
      expect(useCdn).toBe(false);
    });
  });

  describe("isSanityConfigured", () => {
    it("returns true when projectId and dataset are valid", async () => {
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "valid-project-id";
      process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
      const { isSanityConfigured } = await import("../env");
      expect(isSanityConfigured()).toBe(true);
    });

    it("returns false when projectId is missing", async () => {
      delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
      process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
      const { isSanityConfigured } = await import("../env");
      expect(isSanityConfigured()).toBe(false);
    });

    it("returns false when dataset is missing", async () => {
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "valid-project-id";
      delete process.env.NEXT_PUBLIC_SANITY_DATASET;
      const { isSanityConfigured } = await import("../env");
      expect(isSanityConfigured()).toBe(false);
    });

    it("returns false when projectId is ci-placeholder", async () => {
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "ci-placeholder";
      process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
      const { isSanityConfigured } = await import("../env");
      expect(isSanityConfigured()).toBe(false);
    });

    it("returns false when projectId contains placeholder", async () => {
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "test-placeholder-id";
      process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
      const { isSanityConfigured } = await import("../env");
      expect(isSanityConfigured()).toBe(false);
    });

    it("returns false when both are empty strings", async () => {
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "";
      process.env.NEXT_PUBLIC_SANITY_DATASET = "";
      const { isSanityConfigured } = await import("../env");
      expect(isSanityConfigured()).toBe(false);
    });
  });
});
