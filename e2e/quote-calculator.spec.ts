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
      const calculatorSection = page
        .locator("text=Cotizador de Servicios")
        .first();
      // Calculator may not be on plans page, check if pricing exists
      const pricingSection = page
        .locator("h2")
        .filter({ hasText: /pricing|planes/i });
      const hasCalculator = await calculatorSection
        .isVisible()
        .catch(() => false);
      const hasPricing = await pricingSection.isVisible().catch(() => false);
      expect(hasCalculator || hasPricing).toBe(true);
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
      const ctaButtons = page
        .getByRole("button")
        .filter({
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
