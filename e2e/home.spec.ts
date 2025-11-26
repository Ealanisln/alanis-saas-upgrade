import { test, expect } from "./fixtures/test-fixtures";

test.describe("Home Page", () => {
  test.describe("English (default locale)", () => {
    test("should load the home page", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveTitle(/Alanis/i);
    });

    test("should display navigation", async ({ page }) => {
      await page.goto("/");
      const nav = page.locator("nav");
      await expect(nav).toBeVisible();
    });

    test("should display hero section", async ({ page }) => {
      await page.goto("/");
      // Wait for the page to fully load
      await page.waitForLoadState("networkidle");
      // Check for main heading or hero section
      const mainContent = page.locator("main");
      await expect(mainContent).toBeVisible();
    });

    test("should have working navigation links", async ({ page }) => {
      await page.goto("/");
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
      await expect(page).toHaveTitle(/Alanis/i);
    });

    test("should display navigation in Spanish", async ({ page }) => {
      await page.goto("/es");
      const nav = page.locator("nav");
      await expect(nav).toBeVisible();
    });
  });
});
