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
      // At least one nav link should be present in mobile or desktop nav
      const navLinks = page.locator("nav a");
      const count = await navLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test("container uses custom breakpoint steps, not Tailwind defaults", async ({
      page,
    }) => {
      // Guards the @utility container cascade-order override in index.css:
      // at a 1000px viewport the custom 992px step must win (v4's built-in
      // .container would give 768px here).
      await page.setViewportSize({ width: 1000, height: 800 });
      await page.goto("/");
      const container = page.locator(".container").first();
      const maxWidth = await container.evaluate(
        (el) => getComputedStyle(el).maxWidth,
      );
      expect(maxWidth).toBe("992px");
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
