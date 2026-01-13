import { test, expect } from "./fixtures/test-fixtures";

/**
 * E2E tests for dark mode functionality
 * Tests theme toggle dropdown, persistence, and CSS class application
 *
 * The ThemeToggler component now uses a dropdown with 3 options:
 * - Light mode
 * - Dark mode
 * - System (follows device preference)
 */

test.describe("Dark Mode", () => {
  // Helper to get dropdown option by exact text
  const getDropdownOption = (
    page: import("@playwright/test").Page,
    text: string,
  ) => {
    return page.locator(`button:has-text("${text}")`).filter({ hasText: text });
  };

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

    test("should open dropdown when clicked", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Click to open dropdown
      await themeToggle.click();

      // Dropdown should be visible with all 3 options
      await expect(getDropdownOption(page, "Light mode")).toBeVisible();
      await expect(getDropdownOption(page, "Dark mode")).toBeVisible();
      // For System, we need to be more specific to avoid matching other elements
      const dropdown = page.locator(".absolute.right-0.top-full");
      await expect(dropdown.getByText("System")).toBeVisible();
    });

    test("should toggle dark mode when dark option is selected", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const html = page.locator("html");
      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Open dropdown and select dark mode
      await themeToggle.click();
      await getDropdownOption(page, "Dark mode").click();

      // Wait for theme transition
      await page.waitForTimeout(300);

      // Check that dark class is present
      await expect(html).toHaveClass(/dark/);
    });

    test("should toggle to light mode when light option is selected", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const html = page.locator("html");
      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Open dropdown and select light mode
      await themeToggle.click();
      await getDropdownOption(page, "Light mode").click();

      // Wait for theme transition
      await page.waitForTimeout(300);

      // Check that dark class is NOT present
      const finalClass = await html.getAttribute("class");
      expect(finalClass).not.toContain("dark");
    });

    test("should close dropdown when option is selected", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Open dropdown
      await themeToggle.click();
      await expect(getDropdownOption(page, "Light mode")).toBeVisible();

      // Select an option
      await getDropdownOption(page, "Dark mode").click();

      // Wait for dropdown to close
      await page.waitForTimeout(300);

      // Dropdown should be closed
      await expect(getDropdownOption(page, "Light mode")).not.toBeVisible();
    });

    test("should close dropdown when clicking outside", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Open dropdown
      await themeToggle.click();
      await expect(getDropdownOption(page, "Light mode")).toBeVisible();

      // Click outside (on the page body)
      await page.locator("body").click({ position: { x: 10, y: 10 } });

      // Wait for dropdown to close
      await page.waitForTimeout(300);

      // Dropdown should be closed
      await expect(getDropdownOption(page, "Light mode")).not.toBeVisible();
    });
  });

  test.describe("Dark Mode CSS Classes", () => {
    test("should apply dark class to html element when dark mode is selected", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const html = page.locator("html");
      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Open dropdown and select dark mode
      await themeToggle.click();
      await getDropdownOption(page, "Dark mode").click();
      await page.waitForTimeout(300);

      // Verify dark class is present
      await expect(html).toHaveClass(/dark/);
    });

    test("should remove dark class when light mode is selected", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const html = page.locator("html");
      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // First set to dark mode
      await themeToggle.click();
      await getDropdownOption(page, "Dark mode").click();
      await page.waitForTimeout(300);

      // Now set to light mode
      await themeToggle.click();
      await getDropdownOption(page, "Light mode").click();
      await page.waitForTimeout(300);

      // Verify dark class is NOT present
      const finalClass = await html.getAttribute("class");
      expect(finalClass).not.toContain("dark");
    });
  });

  test.describe("Theme Persistence", () => {
    test("should persist theme across page navigation", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Set to dark mode
      await themeToggle.click();
      await getDropdownOption(page, "Dark mode").click();
      await page.waitForTimeout(300);

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

      // Set to dark mode
      await themeToggle.click();
      await getDropdownOption(page, "Dark mode").click();
      await page.waitForTimeout(300);

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
    test("should show sun icon when in light mode", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Set to light mode
      await themeToggle.click();
      await getDropdownOption(page, "Light mode").click();
      await page.waitForTimeout(300);

      // In light mode, the button should contain an SVG (sun icon)
      const icon = themeToggle.locator("svg");
      await expect(icon).toBeVisible();
    });

    test("should show moon icon when in dark mode", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Set to dark mode
      await themeToggle.click();
      await getDropdownOption(page, "Dark mode").click();
      await page.waitForTimeout(300);

      // In dark mode, the button should contain an SVG (moon icon)
      const icon = themeToggle.locator("svg");
      await expect(icon).toBeVisible();
    });

    test("should show system icon when in system mode", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const themeToggle = page.locator('button[aria-label="theme toggler"]');
      const dropdown = page.locator(".absolute.right-0.top-full");

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Set to system mode
      await themeToggle.click();
      await dropdown.getByText("System").click();
      await page.waitForTimeout(300);

      // In system mode, the button should contain an SVG (system/monitor icon)
      const icon = themeToggle.locator("svg");
      await expect(icon).toBeVisible();
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

    test("theme toggle should have aria-expanded attribute", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Initially should be false
      await expect(themeToggle).toHaveAttribute("aria-expanded", "false");

      // Open dropdown
      await themeToggle.click();

      // Now should be true
      await expect(themeToggle).toHaveAttribute("aria-expanded", "true");
    });

    test("theme toggle should be keyboard accessible", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const themeToggle = page.locator('button[aria-label="theme toggler"]');

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Focus the button
      await themeToggle.focus();
      await expect(themeToggle).toBeFocused();

      // Should open dropdown with Enter
      await page.keyboard.press("Enter");
      await page.waitForTimeout(300);

      // Dropdown should be open
      await expect(getDropdownOption(page, "Dark mode")).toBeVisible();

      // Navigate with Tab to dark mode option and press Enter
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");
      await page.waitForTimeout(300);

      // Should have changed to dark mode
      const html = page.locator("html");
      await expect(html).toHaveClass(/dark/);
    });

    test("dropdown options should be buttons", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const themeToggle = page.locator('button[aria-label="theme toggler"]');
      const dropdown = page.locator(".absolute.right-0.top-full");

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Open dropdown
      await themeToggle.click();

      // All options should be buttons within the dropdown
      const buttons = dropdown.locator("button");
      await expect(buttons).toHaveCount(3);
    });
  });

  test.describe("System Theme Option", () => {
    test("should have system option in dropdown", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const themeToggle = page.locator('button[aria-label="theme toggler"]');
      const dropdown = page.locator(".absolute.right-0.top-full");

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // Open dropdown
      await themeToggle.click();

      // System option should be visible in dropdown
      await expect(dropdown.getByText("System")).toBeVisible();
    });

    test("should be able to select system theme", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const themeToggle = page.locator('button[aria-label="theme toggler"]');
      const dropdown = page.locator(".absolute.right-0.top-full");

      // Wait for theme to be initialized
      await page.waitForTimeout(500);

      // First set to dark mode
      await themeToggle.click();
      await getDropdownOption(page, "Dark mode").click();
      await page.waitForTimeout(300);

      // Now set to system mode
      await themeToggle.click();
      await dropdown.getByText("System").click();
      await page.waitForTimeout(300);

      // Dropdown should be closed (selection was made)
      await expect(dropdown).not.toBeVisible();
    });
  });
});
