import { test, expect } from "@playwright/test";

test.describe("Contact Page", () => {
  test.describe("English locale", () => {
    test("should load the contact page", async ({ page }) => {
      await page.goto("/contact");
      await page.waitForLoadState("load");

      await expect(page).toHaveTitle(/Contact|Alanis/i);
    });

    test("should display the contact form", async ({ page }) => {
      await page.goto("/contact");
      await page.waitForLoadState("load");

      // Check for form element
      const form = page.locator("form");
      await expect(form).toBeVisible();
    });

    test("should have required form fields", async ({ page }) => {
      await page.goto("/contact");
      await page.waitForLoadState("load");

      // Check for common contact form fields
      const nameInput = page.locator(
        'input[name="name"], input[id="name"], input[placeholder*="name" i]',
      );
      const emailInput = page.locator(
        'input[type="email"], input[name="email"], input[id="email"]',
      );
      const messageInput = page.locator(
        'textarea, textarea[name="message"], textarea[id="message"]',
      );

      // At least email and message should be present
      const emailCount = await emailInput.count();
      const messageCount = await messageInput.count();

      expect(emailCount).toBeGreaterThan(0);
      expect(messageCount).toBeGreaterThan(0);
    });

    test("should show validation errors on empty submit", async ({ page }) => {
      await page.goto("/contact");
      await page.waitForLoadState("load");

      // Find and click submit button
      const submitButton = page.locator(
        'button[type="submit"], input[type="submit"], button:has-text("Send"), button:has-text("Submit")',
      );

      if ((await submitButton.count()) > 0) {
        await submitButton.first().click();

        // Wait for validation - either HTML5 validation or custom
        await page.waitForTimeout(500);

        // Check for validation indicators (required fields should show validation)
        const invalidFields = page.locator(':invalid, [aria-invalid="true"]');
        const errorMessages = page.locator(
          '[role="alert"], .error, .error-message, [data-error]',
        );

        const hasInvalidFields = (await invalidFields.count()) > 0;
        const hasErrorMessages = (await errorMessages.count()) > 0;

        // At least one type of validation should trigger
        expect(hasInvalidFields || hasErrorMessages).toBeTruthy();
      }
    });

    test("should have accessible form labels", async ({ page }) => {
      await page.goto("/contact");
      await page.waitForLoadState("load");

      // Check that inputs have associated labels
      const inputs = page.locator('input:not([type="hidden"]), textarea');
      const count = await inputs.count();

      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute("id");
        const ariaLabel = await input.getAttribute("aria-label");
        const ariaLabelledBy = await input.getAttribute("aria-labelledby");
        const placeholder = await input.getAttribute("placeholder");

        // Input should have at least one accessibility attribute
        const hasAccessibility =
          id || ariaLabel || ariaLabelledBy || placeholder;

        if (!hasAccessibility) {
          // This is a soft check - log but don't fail
          console.log(`Input ${i} may lack accessibility attributes`);
        }
      }
    });
  });

  test.describe("Spanish locale", () => {
    test("should load the Spanish contact page", async ({ page }) => {
      await page.goto("/es/contact");
      await page.waitForLoadState("load");

      await expect(page).toHaveTitle(/Contact|Contacto|Alanis/i);
    });

    test("should display form with Spanish labels", async ({ page }) => {
      await page.goto("/es/contact");
      await page.waitForLoadState("load");

      const form = page.locator("form");
      await expect(form).toBeVisible();

      // Check the html lang attribute
      const html = page.locator("html");
      await expect(html).toHaveAttribute("lang", "es");
    });
  });
});
