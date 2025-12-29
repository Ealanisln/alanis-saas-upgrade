import { test, expect } from "./fixtures/test-fixtures";

/**
 * E2E tests for dark mode functionality
 * Tests theme toggle, persistence, and CSS class application
 */

test.describe("Dark Mode", () => {
  test.describe("Theme Toggle Button", () => {
    test("should have a theme toggle button in the header", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      // Find theme toggle button by aria-label
      const themeToggle = page.locator('button[aria-label="theme toggler"]');
      await expect(themeToggle).toBeVisible();
    });

    test("should toggle dark mode when clicked", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const html = page.locator("html");
      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Get initial theme state
      const initialClass = await html.getAttribute("class");
      const isDarkInitially = initialClass?.includes("dark");

      // Click the toggle button
      await themeToggle.click();

      // Wait for theme transition
      await page.waitForTimeout(300);

      // Check that theme has changed
      const newClass = await html.getAttribute("class");
      const isDarkNow = newClass?.includes("dark");

      expect(isDarkNow).not.toBe(isDarkInitially);
    });

    test("should toggle back to original theme when clicked twice", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const html = page.locator("html");
      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Get initial theme state
      const initialClass = await html.getAttribute("class");
      const isDarkInitially = initialClass?.includes("dark");

      // Click toggle twice
      await themeToggle.click();
      await page.waitForTimeout(300);
      await themeToggle.click();
      await page.waitForTimeout(300);

      // Check that we're back to initial state
      const finalClass = await html.getAttribute("class");
      const isDarkNow = finalClass?.includes("dark");

      expect(isDarkNow).toBe(isDarkInitially);
    });
  });

  test.describe("Dark Mode CSS Classes", () => {
    test("should apply dark class to html element when in dark mode", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const html = page.locator("html");
      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Get initial state
      const initialClass = await html.getAttribute("class");
      const isDarkInitially = initialClass?.includes("dark");

      // If not dark, toggle to dark
      if (!isDarkInitially) {
        await themeToggle.click();
        await page.waitForTimeout(300);
      }

      // Verify dark class is present
      await expect(html).toHaveClass(/dark/);
    });

    test("should remove dark class when in light mode", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const html = page.locator("html");
      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Get initial state
      const initialClass = await html.getAttribute("class");
      const isDarkInitially = initialClass?.includes("dark");

      // If dark, toggle to light
      if (isDarkInitially) {
        await themeToggle.click();
        await page.waitForTimeout(300);
      }

      // Verify dark class is NOT present
      const finalClass = await html.getAttribute("class");
      expect(finalClass).not.toContain("dark");
    });
  });

  test.describe("Theme Persistence", () => {
    test("should persist theme across page navigation", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const html = page.locator("html");
      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Get initial state and force dark mode
      const initialClass = await html.getAttribute("class");
      const isDarkInitially = initialClass?.includes("dark");

      if (!isDarkInitially) {
        await themeToggle.click();
        await page.waitForTimeout(300);
      }

      // Navigate to another page
      await page.goto("/blog");
      await page.waitForLoadState("load");
      await page.waitForTimeout(500);

      // Check theme is still dark
      const blogHtml = page.locator("html");
      await expect(blogHtml).toHaveClass(/dark/);
    });

    test("should persist theme on page refresh", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const html = page.locator("html");
      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Get initial state and set to dark
      const initialClass = await html.getAttribute("class");
      const isDarkInitially = initialClass?.includes("dark");

      if (!isDarkInitially) {
        await themeToggle.click();
        await page.waitForTimeout(300);
      }

      // Verify it's dark
      await expect(html).toHaveClass(/dark/);

      // Refresh the page
      await page.reload();
      await page.waitForLoadState("load");
      await page.waitForTimeout(500);

      // Check theme is still dark after refresh
      const refreshedHtml = page.locator("html");
      await expect(refreshedHtml).toHaveClass(/dark/);
    });
  });

  test.describe("Theme Toggle Icons", () => {
    test("should show moon icon in light mode", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const html = page.locator("html");
      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Ensure we're in light mode
      const initialClass = await html.getAttribute("class");
      if (initialClass?.includes("dark")) {
        await themeToggle.click();
        await page.waitForTimeout(300);
      }

      // In light mode, moon icon should be visible (dark:hidden class)
      const moonIcon = themeToggle.locator("svg.dark\\:hidden");
      await expect(moonIcon).toBeVisible();
    });

    test("should show sun icon in dark mode", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const html = page.locator("html");
      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Ensure we're in dark mode
      const initialClass = await html.getAttribute("class");
      if (!initialClass?.includes("dark")) {
        await themeToggle.click();
        await page.waitForTimeout(300);
      }

      // In dark mode, sun icon should be visible (dark:block class)
      const sunIcon = themeToggle.locator("svg.dark\\:block");
      await expect(sunIcon).toBeVisible();
    });
  });

  test.describe("Accessibility", () => {
    test("theme toggle button should have accessible label", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      await expect(themeToggle).toHaveAttribute("aria-label", "theme toggler");
    });

    test("theme toggle should be keyboard accessible", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      // Focus the button
      await themeToggle.focus();
      await expect(themeToggle).toBeFocused();

      // Should be activatable with Enter
      const html = page.locator("html");
      const initialClass = await html.getAttribute("class");
      const isDarkInitially = initialClass?.includes("dark");

      await page.keyboard.press("Enter");
      await page.waitForTimeout(300);

      const newClass = await html.getAttribute("class");
      const isDarkNow = newClass?.includes("dark");

      expect(isDarkNow).not.toBe(isDarkInitially);
    });
  });
});
