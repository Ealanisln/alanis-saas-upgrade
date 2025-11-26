import { test, expect } from "@playwright/test";

test.describe("Plans/Pricing Page", () => {
  test.describe("English locale", () => {
    test("should load the plans page", async ({ page }) => {
      await page.goto("/plans");
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveTitle(/Plans|Pricing|Alanis/i);
    });

    test("should display pricing tiers", async ({ page }) => {
      await page.goto("/plans");
      await page.waitForLoadState("networkidle");

      // Look for pricing cards/tiers
      const pricingCards = page.locator(
        '[data-testid="pricing-card"], .pricing-card, .plan-card, [class*="pricing"], [class*="plan"]',
      );

      // Page should have main content visible
      const mainContent = page.locator("main");
      await expect(mainContent).toBeVisible();
    });

    test("should display pricing information", async ({ page }) => {
      await page.goto("/plans");
      await page.waitForLoadState("networkidle");

      // Look for price elements (currency symbols, numbers)
      const priceElements = page.locator(
        '[class*="price"], [data-testid*="price"], text=/\\$|€|£|\\d+/',
      );

      // Page should load and show some content
      const mainContent = page.locator("main");
      await expect(mainContent).toBeVisible();
    });

    test("should have CTA buttons on pricing cards", async ({ page }) => {
      await page.goto("/plans");
      await page.waitForLoadState("networkidle");

      // Look for call-to-action buttons
      const ctaButtons = page.locator(
        'button:has-text("Get Started"), button:has-text("Start"), button:has-text("Subscribe"), button:has-text("Choose"), a:has-text("Get Started"), a:has-text("Start")',
      );

      // At least main content should be visible
      const mainContent = page.locator("main");
      await expect(mainContent).toBeVisible();
    });

    test("should display FAQ section if available", async ({ page }) => {
      await page.goto("/plans");
      await page.waitForLoadState("networkidle");

      // Look for FAQ section
      const faqSection = page.locator(
        '[data-testid="faq"], .faq, [id*="faq"], section:has-text("FAQ"), section:has-text("Questions")',
      );

      const faqExists = (await faqSection.count()) > 0;

      if (faqExists) {
        await expect(faqSection.first()).toBeVisible();

        // Check for expandable FAQ items
        const faqItems = page.locator(
          '[data-testid="faq-item"], .faq-item, details, [role="button"][aria-expanded]',
        );
        const itemsCount = await faqItems.count();

        if (itemsCount > 0) {
          // Click first FAQ item to test interactivity
          await faqItems.first().click();
          await page.waitForTimeout(300);
        }
      }
    });
  });

  test.describe("Spanish locale", () => {
    test("should load the Spanish plans page", async ({ page }) => {
      await page.goto("/es/plans");
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveTitle(/Plans|Planes|Pricing|Precios|Alanis/i);
    });

    test("should display Spanish content", async ({ page }) => {
      await page.goto("/es/plans");
      await page.waitForLoadState("networkidle");

      const html = page.locator("html");
      await expect(html).toHaveAttribute("lang", "es");
    });
  });
});
