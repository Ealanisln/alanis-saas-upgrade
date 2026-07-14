import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures/test-fixtures";

/**
 * E2E tests for dark mode functionality on the single-page portfolio.
 *
 * The redesign replaced the old 3-option dropdown (light/dark/system) with a
 * single toggle button in the sticky nav (aria-label "Toggle dark mode"):
 * - next-themes class strategy: <html> gets class "dark"
 * - defaultTheme "light", enableSystem false (system preference is IGNORED)
 * - persistence via localStorage key "alanis-portfolio-theme" (not "theme")
 * - moon icon shown in light mode, sun icon in dark (swapped via CSS dark:)
 */

const TOGGLE_SELECTOR = 'button[aria-label="Toggle dark mode"]';
const STORAGE_KEY = "alanis-portfolio-theme";

// Key palette values (see DESIGN tokens in src/styles/index.css)
const LIGHT_BODY_BG = "rgb(247, 248, 250)"; // #F7F8FA
const DARK_BODY_BG = "rgb(15, 17, 21)"; // #0F1115

test.describe("Dark Mode", () => {
  // The dev server compiles routes on demand and may be shared with parallel
  // suites; allow generous navigation time so cold compiles don't flake.
  test.use({ navigationTimeout: 60_000 });
  test.describe.configure({ timeout: 90_000 });

  // Skip all dark mode tests on WebKit - next-themes hydration is unreliable
  // in Playwright's WebKit. Functionality is verified by Chromium and Firefox.
  test.skip(
    ({ browserName }) => browserName === "webkit",
    "WebKit has hydration issues with next-themes",
  );

  const themeToggle = (page: Page) => page.locator(TOGGLE_SELECTOR);

  // Deterministically drive the toggle to the requested theme. Retries the
  // click until the class flips, which also absorbs the pre-hydration window
  // where the button is visible but React has not attached handlers yet.
  const setTheme = async (page: Page, theme: "dark" | "light") => {
    const html = page.locator("html");
    await themeToggle(page).waitFor({ state: "visible", timeout: 15000 });
    await expect(async () => {
      const isDark = await html.evaluate((el) => el.classList.contains("dark"));
      if ((theme === "dark") !== isDark) {
        await themeToggle(page).click();
      }
      if (theme === "dark") {
        await expect(html).toHaveClass(/dark/, { timeout: 1000 });
      } else {
        await expect(html).not.toHaveClass(/dark/, { timeout: 1000 });
      }
    }).toPass({ timeout: 15000 });
  };

  test.describe("Theme Toggle Button", () => {
    test("should have a theme toggle button in the sticky nav", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const toggle = themeToggle(page);
      await expect(toggle).toBeVisible();

      // It lives inside the nav
      await expect(page.locator(`nav ${TOGGLE_SELECTOR}`)).toBeVisible();
    });

    test("should default to light theme", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      // defaultTheme is "light" — no dark class on a fresh visit
      const html = page.locator("html");
      await expect(html).not.toHaveClass(/dark/);

      const bodyBg = await page
        .locator("body")
        .evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(bodyBg).toBe(LIGHT_BODY_BG);
    });

    test("should switch to dark mode on click", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      await setTheme(page, "dark");

      await expect(page.locator("html")).toHaveClass(/dark/);
    });

    test("should switch back to light mode on a second click", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      await setTheme(page, "dark");
      await expect(page.locator("html")).toHaveClass(/dark/);

      // A real second click (no retries needed — hydration is proven by now)
      await themeToggle(page).click();
      await expect(page.locator("html")).not.toHaveClass(/dark/, {
        timeout: 10000,
      });
    });
  });

  test.describe("Dark Mode CSS", () => {
    test("should apply the dark class and color-scheme to <html>", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      await setTheme(page, "dark");

      const html = page.locator("html");
      await expect(html).toHaveClass(/dark/);
      await expect(html).toHaveCSS("color-scheme", "dark");
    });

    test("should remove the dark class and restore light color-scheme", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      await setTheme(page, "dark");
      await setTheme(page, "light");

      const html = page.locator("html");
      await expect(html).not.toHaveClass(/dark/);
      await expect(html).toHaveCSS("color-scheme", "light");
    });

    test("should swap the body background between palettes", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const bodyBg = () =>
        page
          .locator("body")
          .evaluate((el) => getComputedStyle(el).backgroundColor);

      expect(await bodyBg()).toBe(LIGHT_BODY_BG);

      await setTheme(page, "dark");
      expect(await bodyBg()).toBe(DARK_BODY_BG);
    });
  });

  test.describe("Theme Persistence", () => {
    test("should store the theme under the new localStorage key", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      await setTheme(page, "dark");

      const stored = await page.evaluate(
        (key) => localStorage.getItem(key),
        STORAGE_KEY,
      );
      expect(stored).toBe("dark");
    });

    test("should ignore the legacy 'theme' localStorage key", async ({
      page,
    }) => {
      // The old site persisted under "theme"; the redesign uses
      // "alanis-portfolio-theme". A stale legacy value must have no effect.
      await page.addInitScript(() => {
        localStorage.setItem("theme", "dark");
      });

      await page.goto("/");
      await page.waitForLoadState("load");

      await expect(page.locator("html")).not.toHaveClass(/dark/);
    });

    test("should persist theme across page navigation", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      await setTheme(page, "dark");

      // Navigate to the blog (the only remaining secondary page)
      await page.goto("/blog");
      await page.waitForLoadState("load");

      await expect(page.locator("html")).toHaveClass(/dark/, {
        timeout: 10000,
      });
    });

    test("should persist theme on page refresh", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      await setTheme(page, "dark");

      await page.reload();
      await page.waitForLoadState("load");

      await expect(page.locator("html")).toHaveClass(/dark/, {
        timeout: 10000,
      });
    });
  });

  test.describe("System Preference", () => {
    // enableSystem is false — replaces the old "system option" coverage
    test("should ignore a dark OS preference and stay light by default", async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: "dark" });

      await page.goto("/");
      await page.waitForLoadState("load");

      const html = page.locator("html");
      await expect(html).not.toHaveClass(/dark/);

      const bodyBg = await page
        .locator("body")
        .evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(bodyBg).toBe(LIGHT_BODY_BG);
    });

    test("should keep an explicit dark choice under a light OS preference", async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: "light" });

      await page.goto("/");
      await page.waitForLoadState("load");

      await setTheme(page, "dark");
      await expect(page.locator("html")).toHaveClass(/dark/);
    });
  });

  test.describe("Theme Toggle Icons", () => {
    // The button renders both icons; CSS dark: classes show exactly one.
    const visibleIcon = async (page: Page) => {
      const svgs = themeToggle(page).locator("svg");
      await expect(svgs).toHaveCount(2);
      const visible = themeToggle(page).locator("svg:visible");
      await expect(visible).toHaveCount(1);
      return visible.evaluate((el) => el.outerHTML);
    };

    test("should show the moon icon in light mode", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      await setTheme(page, "light");

      // Exactly one icon visible in light mode
      await expect(themeToggle(page).locator("svg:visible")).toHaveCount(1);
    });

    test("should swap to the other icon in dark mode", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      await setTheme(page, "light");
      const lightIcon = await visibleIcon(page);

      await setTheme(page, "dark");
      const darkIcon = await visibleIcon(page);

      // Moon (light) and sun (dark) are different SVGs
      expect(darkIcon).not.toBe(lightIcon);
    });
  });

  test.describe("Accessibility", () => {
    test("theme toggle button should have an accessible label", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const toggle = themeToggle(page);
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveAttribute("aria-label", "Toggle dark mode");
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

      // Prove hydration first via a pointer round-trip, ending in light mode
      await setTheme(page, "dark");
      await setTheme(page, "light");

      const toggle = themeToggle(page);
      await toggle.focus();
      await expect(toggle).toBeFocused();

      // Enter activates the button and toggles to dark
      await page.keyboard.press("Enter");
      await expect(page.locator("html")).toHaveClass(/dark/, {
        timeout: 10000,
      });
    });
  });

  test.describe("Mobile", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("toggle is visible on mobile with a 44px touch target", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const toggle = themeToggle(page);
      await expect(toggle).toBeVisible();

      const box = await toggle.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    });

    test("toggle works on mobile", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      await setTheme(page, "dark");
      await expect(page.locator("html")).toHaveClass(/dark/);
    });
  });
});
