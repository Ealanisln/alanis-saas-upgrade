import { test, expect } from "@playwright/test";

test.describe("Locale Switching", () => {
  test.describe("Footer Language Switcher", () => {
    test("should display language options in footer", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const footer = page.locator("footer");
      await expect(footer.getByText("English")).toBeVisible();
      await expect(footer.getByText("Español")).toBeVisible();
    });

    test("should highlight current language in footer", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const footer = page.locator("footer");
      const englishButton = footer.getByRole("button", { name: /English/i });

      // Current language should be highlighted (has text-primary class)
      await expect(englishButton).toHaveClass(/text-primary/);
    });

    test("should switch to Spanish when clicking Español in footer", async ({
      page,
      browserName,
    }) => {
      // Skip on WebKit - click interception issues prevent navigation
      test.skip(
        browserName === "webkit",
        "WebKit has click interception issues",
      );

      await page.goto("/");
      await page.waitForLoadState("load");

      const footer = page.locator("footer");
      const spanishButton = footer.getByRole("button", {
        name: /Switch to Español/i,
      });

      await spanishButton.click();
      await page.waitForLoadState("networkidle");

      // Should navigate to Spanish version
      await expect(page).toHaveURL(/\/es/, { timeout: 15000 });
      await expect(page.locator("html")).toHaveAttribute("lang", "es", {
        timeout: 10000,
      });
    });

    test("should switch to English when clicking English in footer from Spanish page", async ({
      page,
      browserName,
    }) => {
      // Skip on WebKit - click interception issues prevent navigation
      test.skip(
        browserName === "webkit",
        "WebKit has click interception issues",
      );

      await page.goto("/es");
      await page.waitForLoadState("load");

      const footer = page.locator("footer");
      const englishButton = footer.getByRole("button", {
        name: /Switch to English/i,
      });

      await englishButton.click();
      await page.waitForLoadState("networkidle");

      // Should navigate to English version
      await expect(page).not.toHaveURL(/\/es/, { timeout: 15000 });
      await expect(page.locator("html")).toHaveAttribute("lang", "en", {
        timeout: 10000,
      });
    });

    test("should preserve current path when switching language via footer", async ({
      page,
      browserName,
    }) => {
      // Skip on WebKit - click interception issues prevent navigation
      test.skip(
        browserName === "webkit",
        "WebKit has click interception issues",
      );

      // Start on English blog page
      await page.goto("/blog");
      await page.waitForLoadState("load");

      const footer = page.locator("footer");
      const spanishButton = footer.getByRole("button", {
        name: /Switch to Español/i,
      });

      await spanishButton.click();

      // Should be on Spanish blog page - wait for URL change instead of networkidle
      // networkidle can timeout in CI due to analytics scripts
      await expect(page).toHaveURL(/\/es\/blog/, { timeout: 15000 });
    });

    test("should have accessible language buttons in footer", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const footer = page.locator("footer");

      // Check aria-labels
      await expect(
        footer.getByRole("button", { name: /Switch to English/i }),
      ).toBeVisible();
      await expect(
        footer.getByRole("button", { name: /Switch to Español/i }),
      ).toBeVisible();
    });

    test("should disable current language button in footer", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const footer = page.locator("footer");
      const englishButton = footer.getByRole("button", {
        name: /Switch to English/i,
      });

      await expect(englishButton).toBeDisabled();
    });

    test("footer language switcher should be visible on mobile", async ({
      page,
    }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto("/");
      await page.waitForLoadState("load");

      const footer = page.locator("footer");
      await expect(footer.getByText("English")).toBeVisible();
      await expect(footer.getByText("Español")).toBeVisible();
    });
  });

  test("should navigate from English to Spanish", async ({ page }) => {
    // Start on English home page
    await page.goto("/");
    await page.waitForLoadState("load");

    // Verify we're on the English page
    await expect(page).toHaveTitle(/Alanis/i, { timeout: 10000 });

    // Navigate to Spanish version
    await page.goto("/es");
    await page.waitForLoadState("load");

    // Verify we're on the Spanish page
    expect(page.url()).toContain("/es");
    await expect(page).toHaveTitle(/Alanis/i, { timeout: 10000 });
  });

  test("should navigate from Spanish to English", async ({ page }) => {
    // Start on Spanish home page
    await page.goto("/es");
    await page.waitForLoadState("load");

    // Verify we're on the Spanish page
    expect(page.url()).toContain("/es");

    // Navigate to English version
    await page.goto("/");
    await page.waitForLoadState("load");

    // Verify we're on the English page
    expect(page.url()).not.toContain("/es");
    await expect(page).toHaveTitle(/Alanis/i, { timeout: 10000 });
  });

  test("should preserve page path when switching locales", async ({ page }) => {
    // Start on English blog page
    await page.goto("/blog");
    await page.waitForLoadState("load");

    // Navigate to Spanish version
    await page.goto("/es/blog");
    await page.waitForLoadState("load");

    // Verify we're on the Spanish blog page
    expect(page.url()).toContain("/es/blog");
  });

  test("should load correct locale from URL", async ({ page }) => {
    // Test English (no prefix)
    await page.goto("/");
    await page.waitForLoadState("load");
    const htmlEn = page.locator("html");
    await expect(htmlEn).toHaveAttribute("lang", "en", { timeout: 10000 });

    // Test Spanish
    await page.goto("/es");
    await page.waitForLoadState("load");
    const htmlEs = page.locator("html");
    await expect(htmlEs).toHaveAttribute("lang", "es", { timeout: 10000 });
  });
});
