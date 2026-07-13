import { test, expect } from "@playwright/test";

// The redesign removed the footer language switcher. Locale switching now
// lives in the nav: a globe button showing the current locale code (EN/ES)
// whose aria-label names the OTHER locale ("Cambiar a español" on English
// pages, "Switch to English" on Spanish pages). Clicking it switches locale
// via next-intl router.replace, preserving the current path.

const navToggle = (page: import("@playwright/test").Page) =>
  page
    .locator("nav")
    .getByRole("button", { name: /cambiar a español|switch to english/i });

test.describe("Locale Switching", () => {
  test.describe("Nav Language Toggle", () => {
    test("should display the language toggle in the nav", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const toggle = navToggle(page);
      await expect(toggle).toBeVisible({ timeout: 10000 });
      // On English pages the button offers the switch to Spanish
      await expect(toggle).toHaveAttribute("aria-label", "Cambiar a español");
    });

    test("should show the current language on the toggle", async ({ page }) => {
      // English pages show EN
      await page.goto("/");
      await page.waitForLoadState("load");
      await expect(navToggle(page)).toHaveText(/EN/, { timeout: 10000 });

      // Spanish pages show ES
      await page.goto("/es");
      await page.waitForLoadState("load");
      await expect(navToggle(page)).toHaveText(/ES/, { timeout: 10000 });
    });

    test("should switch to Spanish when clicking the toggle", async ({
      page,
      browserName,
    }) => {
      // Skip on WebKit - click interception issues prevent navigation
      test.skip(
        browserName === "webkit",
        "WebKit has click interception issues",
      );

      await page.goto("/");
      await page.waitForLoadState("load");

      await navToggle(page).click();

      // Should navigate to the Spanish version
      await expect(page).toHaveURL(/\/es$/, { timeout: 15000 });
      // Note: <html lang> is set from the x-locale cookie in the root layout
      // and is NOT reliably updated by a client-side locale switch (soft
      // navigation does not re-render the root layout), so assert the
      // localized UI instead. Direct-URL loads below still assert lang.
      await expect(
        page.locator("nav").getByRole("button", { name: "Switch to English" }),
      ).toBeVisible({ timeout: 10000 });
      await expect(
        page
          .locator("nav")
          .getByRole("link", { name: "Sobre mí", exact: true })
          .first(),
      ).toBeVisible();
    });

    test("should switch to English when clicking the toggle on a Spanish page", async ({
      page,
      browserName,
    }) => {
      // Skip on WebKit - click interception issues prevent navigation
      test.skip(
        browserName === "webkit",
        "WebKit has click interception issues",
      );

      await page.goto("/es");
      await page.waitForLoadState("load");

      const toggle = page
        .locator("nav")
        .getByRole("button", { name: /Switch to English/i });
      await toggle.click();

      // Should navigate to the English version (unprefixed)
      await expect(page).not.toHaveURL(/\/es/, { timeout: 15000 });
      // See note above: assert localized UI rather than <html lang>, which
      // is not reliably patched during client-side locale switches.
      await expect(
        page.locator("nav").getByRole("button", { name: "Cambiar a español" }),
      ).toBeVisible({ timeout: 10000 });
      await expect(
        page
          .locator("nav")
          .getByRole("link", { name: "About", exact: true })
          .first(),
      ).toBeVisible();
    });

    test("should preserve current path when switching language", async ({
      page,
      browserName,
    }) => {
      // Skip on WebKit - click interception issues prevent navigation
      test.skip(
        browserName === "webkit",
        "WebKit has click interception issues",
      );

      // Start on the English blog page
      await page.goto("/blog");
      await page.waitForLoadState("load");

      await navToggle(page).click();

      // Should be on the Spanish blog page
      await expect(page).toHaveURL(/\/es\/blog/, { timeout: 15000 });

      // And back again: /es/blog → /blog
      await page
        .locator("nav")
        .getByRole("button", { name: /Switch to English/i })
        .click();
      await expect(page).toHaveURL(/\/blog$/, { timeout: 15000 });
      await expect(page).not.toHaveURL(/\/es\//);
    });

    test("toggle should update after switching locale", async ({
      page,
      browserName,
    }) => {
      // Skip on WebKit - click interception issues prevent navigation
      test.skip(
        browserName === "webkit",
        "WebKit has click interception issues",
      );

      await page.goto("/");
      await page.waitForLoadState("load");

      const toggle = navToggle(page);
      await expect(toggle).toHaveText(/EN/, { timeout: 10000 });

      await toggle.click();
      await expect(page).toHaveURL(/\/es$/, { timeout: 15000 });

      // The same button now shows ES and offers the switch back to English
      const esToggle = page
        .locator("nav")
        .getByRole("button", { name: /Switch to English/i });
      await expect(esToggle).toBeVisible({ timeout: 10000 });
      await expect(esToggle).toHaveText(/ES/);
    });

    test("should have an accessible language toggle", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      // On English pages the accessible name is the Spanish switch label
      await expect(
        page.locator("nav").getByRole("button", { name: "Cambiar a español" }),
      ).toBeVisible({ timeout: 10000 });

      await page.goto("/es");
      await page.waitForLoadState("load");

      await expect(
        page.locator("nav").getByRole("button", { name: "Switch to English" }),
      ).toBeVisible({ timeout: 10000 });
    });

    test("language toggle should be visible on mobile", async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto("/");
      await page.waitForLoadState("load");

      const toggle = navToggle(page);
      await expect(toggle).toBeVisible({ timeout: 10000 });
      await expect(toggle).toHaveText(/EN/);
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
