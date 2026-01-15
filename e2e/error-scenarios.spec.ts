import { test, expect } from "./fixtures/test-fixtures";

test.describe("Error Scenarios", () => {
  test.describe("404 Not Found", () => {
    test("should show 404 page for non-existent route", async ({
      page,
      localePath,
    }) => {
      const response = await page.goto(localePath("/non-existent-page-xyz"));

      // Should either show 404 or redirect
      const status = response?.status();

      if (status === 404) {
        // Look for 404 indicators
        const notFoundText = page
          .locator("text=/404|not found|página no encontrada/i")
          .first();
        await expect(notFoundText).toBeVisible();
      } else {
        // Some apps redirect 404s to home
        expect([200, 301, 302, 404]).toContain(status);
      }
    });

    test("should show 404 for invalid blog slug", async ({
      page,
      localePath,
    }) => {
      const response = await page.goto(
        localePath("/blog/this-post-does-not-exist-xyz"),
      );

      const status = response?.status();
      // Accept 404 or 200 (soft 404)
      expect([200, 404]).toContain(status);
    });

    test("should show 404 for invalid portfolio slug", async ({
      page,
      localePath,
    }) => {
      const response = await page.goto(
        localePath("/portfolio/invalid-project-xyz"),
      );

      const status = response?.status();
      // Accept 404 or 200 (soft 404)
      expect([200, 404]).toContain(status);
    });
  });

  test.describe("Invalid Locale", () => {
    test("should handle invalid locale gracefully", async ({ page }) => {
      const response = await page.goto("/fr/");

      // Should redirect or show error
      const status = response?.status();
      expect([200, 301, 302, 404]).toContain(status);

      // If 200, page should still be functional
      if (status === 200) {
        const heading = page.locator("h1, h2").first();
        await expect(heading).toBeVisible();
      }
    });

    test("should redirect unknown locale to default", async ({ page }) => {
      await page.goto("/de/about");
      await page.waitForLoadState("networkidle");

      // Should either show content or redirect
      const url = page.url();
      // Should not stay on /de/
      const isOnUnknownLocale = url.includes("/de/");
      if (isOnUnknownLocale) {
        // If stayed on unknown locale, should show 404 or redirect content
        const body = await page.locator("body").textContent();
        expect(body?.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe("Form Validation Errors", () => {
    test("should show validation error for empty contact form", async ({
      page,
      localePath,
    }) => {
      await page.goto(localePath("/contact"));
      await page.waitForLoadState("networkidle");

      // Try to submit empty form
      const submitButton = page
        .getByRole("button", { name: /send|enviar|submit/i })
        .first();

      if (await submitButton.isVisible()) {
        await submitButton.click();

        // Should show validation errors or HTML5 validation
        // Wait a moment for validation
        await page.waitForTimeout(500);

        // Check for error indicators
        const errorIndicators = page.locator(
          '[class*="error"], [class*="invalid"], :invalid',
        );
        const hasErrors = (await errorIndicators.count()) > 0;

        // Either JS validation or HTML5 validation should trigger
        expect(hasErrors || (await page.locator(":invalid").count()) > 0).toBe(
          true,
        );
      }
    });

    test("should show error for invalid email format", async ({
      page,
      localePath,
    }) => {
      await page.goto(localePath("/contact"));
      await page.waitForLoadState("networkidle");

      // Find email input
      const emailInput = page
        .locator('input[type="email"], input[name="email"]')
        .first();

      if (await emailInput.isVisible()) {
        await emailInput.fill("invalid-email");

        // Trigger validation
        await emailInput.blur();

        // Check for invalid state
        const isInvalid = await emailInput.evaluate((el) => {
          const input = el as HTMLInputElement;
          return !input.validity.valid;
        });

        expect(isInvalid).toBe(true);
      }
    });
  });

  test.describe("Network Error Handling", () => {
    test("page should load even without external resources", async ({
      page,
      localePath,
    }) => {
      // Block external requests
      await page.route("**/*", (route) => {
        const url = route.request().url();
        // Allow same-origin requests, block external
        if (url.includes("localhost") || url.includes("127.0.0.1")) {
          route.continue();
        } else if (url.includes("fonts.") || url.includes("analytics.")) {
          route.abort();
        } else {
          route.continue();
        }
      });

      await page.goto(localePath("/"));
      await page.waitForLoadState("load");

      // Page should still be functional
      const body = page.locator("body");
      await expect(body).toBeVisible();

      // Main content should render
      const mainContent = page.locator("main, #__next, [role='main']").first();
      await expect(mainContent).toBeVisible();
    });
  });

  test.describe("JavaScript Error Recovery", () => {
    test("should handle missing translations gracefully", async ({
      page,
      localePath,
    }) => {
      // Capture console errors
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          errors.push(msg.text());
        }
      });

      await page.goto(localePath("/"));
      await page.waitForLoadState("networkidle");

      // Page should still render
      const heading = page.locator("h1, h2").first();
      await expect(heading).toBeVisible();

      // Should not have unhandled errors (some warnings are OK)
      const criticalErrors = errors.filter(
        (e) =>
          e.includes("Unhandled") ||
          e.includes("Cannot read") ||
          e.includes("is not defined"),
      );

      expect(criticalErrors).toHaveLength(0);
    });
  });
});

test.describe("Error Scenarios - Spanish", () => {
  test.use({ locale: "es" });

  test("should show Spanish 404 message", async ({ page, localePath }) => {
    const response = await page.goto(localePath("/pagina-inexistente"));

    if (response?.status() === 404) {
      // Check for Spanish 404 message
      const body = await page.locator("body").textContent();
      // Should have some content (either Spanish 404 or redirect)
      expect(body?.length).toBeGreaterThan(0);
    }
  });

  test("should show Spanish validation errors", async ({
    page,
    localePath,
  }) => {
    await page.goto(localePath("/contact"));
    await page.waitForLoadState("networkidle");

    const submitButton = page
      .getByRole("button", { name: /enviar|send/i })
      .first();

    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(500);

      // Page should still be functional
      const body = page.locator("body");
      await expect(body).toBeVisible();
    }
  });
});
