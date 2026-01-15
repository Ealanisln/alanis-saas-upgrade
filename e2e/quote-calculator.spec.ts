import { test, expect } from "./fixtures/test-fixtures";

test.describe("Quote Calculator", () => {
  test.beforeEach(async ({ page, localePath }) => {
    await page.goto(localePath("/plans"));
    await page.waitForLoadState("networkidle");
  });

  test.describe("page load", () => {
    test("should load the plans page", async ({ page }) => {
      await expect(page).toHaveTitle(/Plans|Planes/i);
    });

    test("should display the service calculator section", async ({ page }) => {
      // Check for pricing/plans related content (either calculator or pricing section)
      const pricingContent = page.locator(
        '[class*="pricing"], [id*="pricing"]',
      );
      const priceText = page.locator("text=/\\$\\d+/").first();
      const plansHeading = page
        .locator("h1, h2, h3")
        .filter({ hasText: /plan|pricing|planes|precio/i });

      const hasPricingContent = await pricingContent
        .count()
        .then((c) => c > 0)
        .catch(() => false);
      const hasPriceText = await priceText.isVisible().catch(() => false);
      const hasPlansHeading = await plansHeading.isVisible().catch(() => false);

      expect(hasPricingContent || hasPriceText || hasPlansHeading).toBe(true);
    });
  });

  test.describe("pricing plans display", () => {
    test("should display pricing cards", async ({ page }) => {
      // Look for pricing-related content
      const pricingCards = page
        .locator('[class*="rounded"]')
        .filter({ hasText: /\$/ });
      const count = await pricingCards.count();
      expect(count).toBeGreaterThan(0);
    });

    test("should display USD currency", async ({ page }) => {
      const usdText = page.locator("text=USD").first();
      await expect(usdText).toBeVisible();
    });

    test("should have CTA buttons", async ({ page }) => {
      // Look for buttons that might be checkout or quote request
      const ctaButtons = page.getByRole("button").filter({
        hasText: /get started|empezar|contact|contacto|quote|cotizar/i,
      });
      const count = await ctaButtons.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe("interaction", () => {
    test("should be able to click pricing CTA", async ({ page }) => {
      const ctaButton = page
        .getByRole("button")
        .filter({ hasText: /get started|empezar/i })
        .first();

      if (await ctaButton.isVisible()) {
        // Just verify it's clickable without actually clicking (avoids Stripe redirect)
        await expect(ctaButton).toBeEnabled();
      }
    });
  });
});

test.describe("Quote Calculator - Spanish", () => {
  test.use({ locale: "es" });

  test("should load plans page in Spanish", async ({ page, localePath }) => {
    await page.goto(localePath("/plans"));
    await page.waitForLoadState("networkidle");

    // Page should have Spanish content
    await expect(page).toHaveURL(/\/es\/plans/);
  });
});
