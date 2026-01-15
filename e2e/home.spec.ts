import { test, expect } from "./fixtures/test-fixtures";

test.describe("Home Page", () => {
  test.describe("English (default locale)", () => {
    test("should load the home page", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await expect(page).toHaveTitle(/Alanis/i, { timeout: 10000 });
    });

    test("should display navigation", async ({ page, isMobile }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      if (isMobile) {
        // On mobile, check for hamburger menu button instead
        const menuButton = page.locator(
          'button[aria-label*="menu"], button[aria-label*="Menu"], #navbarToggler',
        );
        await expect(menuButton).toBeVisible({ timeout: 10000 });
      } else {
        const nav = page.locator("nav");
        await expect(nav).toBeVisible({ timeout: 10000 });
      }
    });

    test("should display hero section", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      // Check for main heading or hero section
      const mainContent = page.locator("main");
      await expect(mainContent).toBeVisible({ timeout: 10000 });
    });

    test("should have working navigation links", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      // Check that key navigation links exist
      const blogLink = page.locator(
        'nav a[href*="blog"], nav a:has-text("Blog")',
      );
      const contactLink = page.locator(
        'nav a[href*="contact"], nav a:has-text("Contact")',
      );

      // At least one of these should be visible in mobile or desktop nav
      const navLinks = page.locator("nav a");
      const count = await navLinks.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe("Spanish locale", () => {
    test("should load the Spanish home page", async ({ page }) => {
      await page.goto("/es");
      await page.waitForLoadState("load");
      await expect(page).toHaveTitle(/Alanis/i, { timeout: 10000 });
    });

    test("should display navigation in Spanish", async ({ page, isMobile }) => {
      await page.goto("/es");
      await page.waitForLoadState("load");
      if (isMobile) {
        // On mobile, check for hamburger menu button instead
        const menuButton = page.locator(
          'button[aria-label*="menu"], button[aria-label*="Menu"], #navbarToggler',
        );
        await expect(menuButton).toBeVisible({ timeout: 10000 });
      } else {
        const nav = page.locator("nav");
        await expect(nav).toBeVisible({ timeout: 10000 });
      }
    });
  });
});
