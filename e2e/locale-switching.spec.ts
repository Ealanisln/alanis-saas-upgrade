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
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const footer = page.locator("footer");
      const spanishButton = footer.getByRole("button", {
        name: /Switch to Español/i,
      });

      await spanishButton.click();
      await page.waitForLoadState("load");

      // Should navigate to Spanish version
      expect(page.url()).toContain("/es");
      await expect(page.locator("html")).toHaveAttribute("lang", "es");
    });

    test("should switch to English when clicking English in footer from Spanish page", async ({
      page,
    }) => {
      await page.goto("/es");
      await page.waitForLoadState("load");

      const footer = page.locator("footer");
      const englishButton = footer.getByRole("button", {
        name: /Switch to English/i,
      });

      await englishButton.click();
      await page.waitForLoadState("load");

      // Should navigate to English version
      expect(page.url()).not.toContain("/es");
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
    });

    test("should preserve current path when switching language via footer", async ({
      page,
    }) => {
      // Start on English blog page
      await page.goto("/blog");
      await page.waitForLoadState("load");

      const footer = page.locator("footer");
      const spanishButton = footer.getByRole("button", {
        name: /Switch to Español/i,
      });

      await spanishButton.click();
      await page.waitForLoadState("load");

      // Should be on Spanish blog page
      expect(page.url()).toContain("/es/blog");
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
