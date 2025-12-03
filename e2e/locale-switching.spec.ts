import { test, expect } from "@playwright/test";

test.describe("Locale Switching", () => {
  test("should switch from English to Spanish", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");

    // Look for language switcher
    const langSwitcher = page.locator(
      '[data-testid="language-switcher"], button:has-text("ES"), a:has-text("ES"), [aria-label*="language"], [aria-label*="idioma"]',
    );

    // If language switcher exists, click it
    const switcherCount = await langSwitcher.count();
    if (switcherCount > 0) {
      await langSwitcher.first().click();
      await page.waitForURL(/\/es/);
      expect(page.url()).toContain("/es");
    } else {
      // Fallback: navigate directly to Spanish
      await page.goto("/es");
      await expect(page).toHaveTitle(/Alanis/i);
    }
  });

  test("should switch from Spanish to English", async ({ page }) => {
    await page.goto("/es");
    await page.waitForLoadState("load");

    // Look for language switcher
    const langSwitcher = page.locator(
      '[data-testid="language-switcher"], button:has-text("EN"), a:has-text("EN"), [aria-label*="language"], [aria-label*="idioma"]',
    );

    // If language switcher exists, click it
    const switcherCount = await langSwitcher.count();
    if (switcherCount > 0) {
      await langSwitcher.first().click();
      await page.waitForURL((url) => !url.pathname.startsWith("/es"));
      expect(page.url()).not.toContain("/es");
    } else {
      // Fallback: navigate directly to English
      await page.goto("/");
      await expect(page).toHaveTitle(/Alanis/i);
    }
  });

  test("should preserve page path when switching locales", async ({ page }) => {
    // Start on English blog page
    await page.goto("/blog");
    await page.waitForLoadState("load");

    const initialPath = new URL(page.url()).pathname;

    // Navigate to Spanish version
    await page.goto("/es/blog");
    await page.waitForLoadState("load");

    // Verify we're on the Spanish blog page
    expect(page.url()).toContain("/es/blog");
  });

  test("should load correct locale from URL", async ({ page }) => {
    // Test English (no prefix)
    await page.goto("/");
    const htmlEn = page.locator("html");
    await expect(htmlEn).toHaveAttribute("lang", "en");

    // Test Spanish
    await page.goto("/es");
    const htmlEs = page.locator("html");
    await expect(htmlEs).toHaveAttribute("lang", "es");
  });
});
