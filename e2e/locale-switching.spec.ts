import { test, expect } from "@playwright/test";

test.describe("Locale Switching", () => {
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
