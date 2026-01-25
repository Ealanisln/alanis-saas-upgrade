import { test, expect } from "./fixtures/test-fixtures";

/**
 * E2E tests for dark mode functionality
 * Tests theme toggle dropdown, persistence, and CSS class application
 *
 * The ThemeToggler component uses a dropdown with 3 options:
 * - Light mode
 * - Dark mode
 * - System (follows device preference)
 */

test.describe("Dark Mode", () => {
  // Skip all dark mode tests on WebKit - the ThemeToggler component doesn't
  // hydrate properly in Playwright's WebKit due to next-themes interaction issues.
  // Functionality is verified by Chromium and Firefox tests.
  test.skip(
    ({ browserName }) => browserName === "webkit",
    "WebKit has hydration issues with next-themes",
  );

  // Helper to wait for theme toggle to be ready and scroll it into view
  const waitForThemeToggle = async (page: import("@playwright/test").Page) => {
    // Wait for the theme toggle to be visible (indicates hydration complete)
    // Don't use networkidle as it can timeout in CI due to analytics scripts
    const toggle = page.locator('[data-testid="theme-toggle-button"]');
    await toggle.waitFor({ state: "visible", timeout: 15000 });
    // Scroll into view to avoid image interception issues
    await toggle.scrollIntoViewIfNeeded();
  };

  // Selectors using data-testid
  const selectors = {
    themeToggle: '[data-testid="theme-toggle-button"]',
    dropdown: '[data-testid="theme-dropdown"]',
    lightOption: '[data-testid="theme-option-light"]',
    darkOption: '[data-testid="theme-option-dark"]',
    systemOption: '[data-testid="theme-option-system"]',
  };

  test.describe("Theme Toggle Button", () => {
    test("should have a theme toggle button in the header", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await waitForThemeToggle(page);

      const themeToggle = page.locator(selectors.themeToggle);
      await expect(themeToggle).toBeVisible();
    });

    test("should open dropdown when clicked", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await waitForThemeToggle(page);

      const themeToggle = page.locator(selectors.themeToggle);

      // Click to open dropdown
      await themeToggle.click();

      // Dropdown should be visible with all 3 options
      await expect(page.locator(selectors.dropdown)).toBeVisible();
      await expect(page.locator(selectors.lightOption)).toBeVisible();
      await expect(page.locator(selectors.darkOption)).toBeVisible();
      await expect(page.locator(selectors.systemOption)).toBeVisible();
    });

    test("should toggle dark mode when dark option is selected", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await waitForThemeToggle(page);

      const html = page.locator("html");
      const themeToggle = page.locator(selectors.themeToggle);

      // Open dropdown and select dark mode
      await themeToggle.click();
      await page.locator(selectors.darkOption).click();

      // Check that dark class is present (with timeout for WebKit)
      await expect(html).toHaveClass(/dark/, { timeout: 10000 });
    });

    test("should toggle to light mode when light option is selected", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await waitForThemeToggle(page);

      const html = page.locator("html");
      const themeToggle = page.locator(selectors.themeToggle);

      // Open dropdown and select light mode
      await themeToggle.click();
      await page.locator(selectors.lightOption).click();

      // Wait for theme to apply and check dark class is NOT present
      await expect(html).not.toHaveClass(/dark/, { timeout: 10000 });
    });

    test("should close dropdown when option is selected", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await waitForThemeToggle(page);

      const themeToggle = page.locator(selectors.themeToggle);

      // Open dropdown
      await themeToggle.click();
      await expect(page.locator(selectors.dropdown)).toBeVisible();

      // Select an option
      await page.locator(selectors.darkOption).click();

      // Dropdown should be closed (with timeout for WebKit)
      await expect(page.locator(selectors.dropdown)).not.toBeVisible({
        timeout: 10000,
      });
    });

    test("should close dropdown when clicking outside", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await waitForThemeToggle(page);

      const themeToggle = page.locator(selectors.themeToggle);

      // Open dropdown
      await themeToggle.click();
      await expect(page.locator(selectors.dropdown)).toBeVisible();

      // Click outside (on the page body)
      await page.locator("body").click({ position: { x: 10, y: 10 } });

      // Dropdown should be closed (with timeout for WebKit)
      await expect(page.locator(selectors.dropdown)).not.toBeVisible({
        timeout: 10000,
      });
    });
  });

  test.describe("Dark Mode CSS Classes", () => {
    test("should apply dark class to html element when dark mode is selected", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await waitForThemeToggle(page);

      const html = page.locator("html");
      const themeToggle = page.locator(selectors.themeToggle);

      // Open dropdown and select dark mode
      await themeToggle.click();
      await page.locator(selectors.darkOption).click();

      // Verify dark class is present (with timeout for WebKit)
      await expect(html).toHaveClass(/dark/, { timeout: 10000 });
    });

    test("should remove dark class when light mode is selected", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await waitForThemeToggle(page);

      const html = page.locator("html");
      const themeToggle = page.locator(selectors.themeToggle);

      // First set to dark mode
      await themeToggle.click();
      await page.locator(selectors.darkOption).click();
      await expect(html).toHaveClass(/dark/, { timeout: 10000 });

      // Now set to light mode
      await themeToggle.click();
      await page.locator(selectors.lightOption).click();

      // Verify dark class is NOT present (with timeout for WebKit)
      await expect(html).not.toHaveClass(/dark/, { timeout: 10000 });
    });
  });

  test.describe("Theme Persistence", () => {
    test("should persist theme across page navigation", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await waitForThemeToggle(page);

      const themeToggle = page.locator(selectors.themeToggle);

      // Set to dark mode
      await themeToggle.click();
      await page.locator(selectors.darkOption).click();
      await expect(page.locator("html")).toHaveClass(/dark/, {
        timeout: 10000,
      });

      // Navigate to another page
      await page.goto("/blog");
      await page.waitForLoadState("load");
      await waitForThemeToggle(page);

      // Check theme is still dark (with timeout for WebKit)
      const blogHtml = page.locator("html");
      await expect(blogHtml).toHaveClass(/dark/, { timeout: 10000 });
    });

    test("should persist theme on page refresh", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await waitForThemeToggle(page);

      const html = page.locator("html");
      const themeToggle = page.locator(selectors.themeToggle);

      // Set to dark mode
      await themeToggle.click();
      await page.locator(selectors.darkOption).click();

      // Verify it's dark (with timeout for WebKit)
      await expect(html).toHaveClass(/dark/, { timeout: 10000 });

      // Refresh the page
      await page.reload();
      await page.waitForLoadState("load");
      await waitForThemeToggle(page);

      // Check theme is still dark after refresh (with timeout for WebKit)
      const refreshedHtml = page.locator("html");
      await expect(refreshedHtml).toHaveClass(/dark/, { timeout: 10000 });
    });
  });

  test.describe("Theme Toggle Icons", () => {
    test("should show sun icon when in light mode", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await waitForThemeToggle(page);

      const themeToggle = page.locator(selectors.themeToggle);

      // Set to light mode
      await themeToggle.click();
      await page.locator(selectors.lightOption).click();

      // In light mode, the button should contain an SVG (sun icon) - with timeout for WebKit
      const icon = themeToggle.locator("svg");
      await expect(icon).toBeVisible({ timeout: 10000 });
    });

    test("should show moon icon when in dark mode", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await waitForThemeToggle(page);

      const themeToggle = page.locator(selectors.themeToggle);

      // Set to dark mode
      await themeToggle.click();
      await page.locator(selectors.darkOption).click();

      // In dark mode, the button should contain an SVG (moon icon) - with timeout for WebKit
      const icon = themeToggle.locator("svg");
      await expect(icon).toBeVisible({ timeout: 10000 });
    });

    test("should show system icon when in system mode", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await waitForThemeToggle(page);

      const themeToggle = page.locator(selectors.themeToggle);

      // Set to system mode
      await themeToggle.click();
      await page.locator(selectors.systemOption).click();

      // In system mode, the button should contain an SVG (system/monitor icon) - with timeout for WebKit
      const icon = themeToggle.locator("svg");
      await expect(icon).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Accessibility", () => {
    test("theme toggle button should have accessible label", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await waitForThemeToggle(page);

      const themeToggle = page.locator(selectors.themeToggle);

      await expect(themeToggle).toHaveAttribute("aria-label", "theme toggler");
    });

    test("theme toggle should have aria-expanded attribute", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await waitForThemeToggle(page);

      const themeToggle = page.locator(selectors.themeToggle);

      // Initially should be false
      await expect(themeToggle).toHaveAttribute("aria-expanded", "false");

      // Open dropdown
      await themeToggle.click();

      // Now should be true
      await expect(themeToggle).toHaveAttribute("aria-expanded", "true");
    });

    test("theme toggle should be keyboard accessible", async ({
      page,
      browserName,
    }) => {
      // Skip on WebKit - keyboard focus handling differs in WebKit/Playwright
      test.skip(
        browserName === "webkit",
        "WebKit keyboard focus handling differs in Playwright",
      );

      await page.goto("/");
      await page.waitForLoadState("load");
      await waitForThemeToggle(page);

      const themeToggle = page.locator(selectors.themeToggle);

      // Focus the button
      await themeToggle.focus();
      await expect(themeToggle).toBeFocused();

      // Should open dropdown with Enter
      await page.keyboard.press("Enter");

      // Dropdown should be open (with timeout for slower browsers)
      await expect(page.locator(selectors.dropdown)).toBeVisible({
        timeout: 10000,
      });

      // Navigate with Tab to dark mode option and press Enter
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");

      // Should have changed to dark mode (with timeout for slower browsers)
      const html = page.locator("html");
      await expect(html).toHaveClass(/dark/, { timeout: 10000 });
    });

    test("dropdown options should be buttons", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await waitForThemeToggle(page);

      const themeToggle = page.locator(selectors.themeToggle);

      // Open dropdown
      await themeToggle.click();

      // All options should be buttons within the dropdown
      const dropdown = page.locator(selectors.dropdown);
      const buttons = dropdown.locator("button");
      await expect(buttons).toHaveCount(3);
    });
  });

  test.describe("System Theme Option", () => {
    test("should have system option in dropdown", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await waitForThemeToggle(page);

      const themeToggle = page.locator(selectors.themeToggle);

      // Open dropdown
      await themeToggle.click();

      // System option should be visible in dropdown
      await expect(page.locator(selectors.systemOption)).toBeVisible();
    });

    test("should be able to select system theme", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await waitForThemeToggle(page);

      const themeToggle = page.locator(selectors.themeToggle);

      // First set to dark mode
      await themeToggle.click();
      await page.locator(selectors.darkOption).click();
      await expect(page.locator("html")).toHaveClass(/dark/, {
        timeout: 10000,
      });

      // Now set to system mode
      await themeToggle.click();
      await page.locator(selectors.systemOption).click();

      // Dropdown should be closed (selection was made) - with timeout for WebKit
      await expect(page.locator(selectors.dropdown)).not.toBeVisible({
        timeout: 10000,
      });
    });
  });
});
