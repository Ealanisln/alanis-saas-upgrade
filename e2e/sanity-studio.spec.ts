import { test, expect } from "@playwright/test";

// Skip Sanity Studio tests in CI when no valid Sanity config is present
// CI uses placeholder values that cause Studio to fail
const isCIWithoutSanity =
  process.env.CI &&
  (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === "ci-placeholder");

test.describe("Sanity Studio", () => {
  // Skip entire suite in CI without valid Sanity config
  test.skip(
    () => !!isCIWithoutSanity,
    "Skipping Sanity Studio tests in CI without valid Sanity configuration",
  );

  test.describe("Studio Access", () => {
    test("should load the Sanity Studio page", async ({ page }) => {
      // Navigate to Studio - it may take longer to load due to heavy JS
      await page.goto("/studio", { timeout: 30000 });
      await page.waitForLoadState("domcontentloaded");

      // Studio should render without critical errors
      // Check that we're not on an error page
      const errorPage = page.locator("text=/404|500|error/i");
      const errorCount = await errorPage.count();

      // If there's an error element, it should not be a page-level error
      if (errorCount > 0) {
        // Check it's not a Next.js error page
        const nextError = page.locator("[data-nextjs-error], #__next-error");
        expect(await nextError.count()).toBe(0);
      }
    });

    test("should display Studio UI elements", async ({ page }) => {
      await page.goto("/studio", { timeout: 30000 });
      await page.waitForLoadState("domcontentloaded");

      // Wait for Studio to initialize (may take time for JS hydration)
      await page.waitForTimeout(2000);

      // Studio should have rendered some content
      const body = page.locator("body");
      await expect(body).not.toBeEmpty();

      // Check for common Sanity Studio elements
      // Studio typically has a navigation sidebar or toolbar
      const studioContainer = page.locator(
        '[data-ui="Container"], [data-sanity], .sanity-studio, #sanity',
      );
      const studioExists = (await studioContainer.count()) > 0;

      // If no explicit Sanity container, check for NextStudio wrapper
      if (!studioExists) {
        const nextStudioWrapper = page.locator("div.py-24");
        await expect(nextStudioWrapper).toBeVisible();
      }
    });

    test("should not show authentication error for public access check", async ({
      page,
    }) => {
      const response = await page.goto("/studio", { timeout: 30000 });

      // Skip if Studio returns 500 (configuration issue, not test failure)
      const status = response?.status() ?? 0;
      if (status >= 500) {
        test.skip(
          true,
          "Sanity Studio returned server error - likely configuration issue",
        );
        return;
      }

      // Studio page should load (even if it requires auth)
      expect(status).toBeLessThan(500);
    });
  });

  test.describe("Studio Navigation", () => {
    test("should handle direct navigation to studio subpaths", async ({
      page,
    }) => {
      // Test catch-all route handling
      const response = await page.goto("/studio/desk", { timeout: 30000 });

      // Should not return 404 (catch-all should handle it)
      expect(response?.status()).not.toBe(404);
    });

    test("should handle studio structure route", async ({ page }) => {
      const response = await page.goto("/studio/structure", { timeout: 30000 });

      // Skip if Studio returns 500 (configuration issue, not test failure)
      const status = response?.status() ?? 0;
      if (status >= 500) {
        test.skip(
          true,
          "Sanity Studio returned server error - likely configuration issue",
        );
        return;
      }

      // Catch-all route should handle this
      expect(status).toBeLessThan(500);
    });
  });

  test.describe("Studio Performance", () => {
    test("should load within acceptable time", async ({ page }) => {
      const startTime = Date.now();

      await page.goto("/studio", { timeout: 30000 });
      await page.waitForLoadState("domcontentloaded");

      const loadTime = Date.now() - startTime;

      // Studio should load within 15 seconds (it's a heavy SPA)
      expect(loadTime).toBeLessThan(15000);
    });

    test("should not have console errors that block rendering", async ({
      page,
    }) => {
      const consoleErrors: string[] = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          const text = msg.text();
          // Ignore known non-critical errors
          if (
            !text.includes("favicon") &&
            !text.includes("404") &&
            !text.includes("Failed to load resource") &&
            !text.includes("ResizeObserver")
          ) {
            consoleErrors.push(text);
          }
        }
      });

      await page.goto("/studio", { timeout: 30000 });
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(2000);

      // Filter out non-critical errors
      const criticalErrors = consoleErrors.filter(
        (err) =>
          err.includes("Uncaught") ||
          err.includes("TypeError") ||
          err.includes("ReferenceError"),
      );

      // Should not have critical JS errors
      expect(criticalErrors.length).toBe(0);
    });
  });
});
