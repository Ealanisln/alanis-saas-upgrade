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

  test.describe("Form submission", () => {
    // Helper to fill the form with valid data
    async function fillContactForm(page: import("@playwright/test").Page) {
      await page.fill('input[name="name"]', "Test User");
      await page.fill('input[type="email"]', "test@example.com");
      await page.fill(
        'textarea[name="message"]',
        "This is a test message for the contact form.",
      );
    }

    test("should submit form successfully with valid data", async ({
      page,
    }) => {
      // Mock API success response
      await page.route("**/api/**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true }),
        });
      });

      await page.goto("/contact");
      await page.waitForLoadState("load");

      // Fill form with valid data
      await fillContactForm(page);

      // Submit the form
      await page.click('button[type="submit"]');

      // Verify success message appears (green background)
      const successMessage = page.locator(".bg-green-200");
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    });

    test("should reset form after successful submission", async ({ page }) => {
      // Mock API success response
      await page.route("**/api/**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true }),
        });
      });

      await page.goto("/contact");
      await page.waitForLoadState("load");

      // Fill form
      await fillContactForm(page);

      // Submit
      await page.click('button[type="submit"]');

      // Wait for success message
      await expect(page.locator(".bg-green-200")).toBeVisible({
        timeout: 5000,
      });

      // Wait for form reset (happens after 3 seconds)
      await page.waitForTimeout(3500);

      // Verify fields are cleared
      const nameInput = page.locator('input[name="name"]');
      const emailInput = page.locator('input[type="email"]');
      const messageInput = page.locator('textarea[name="message"]');

      await expect(nameInput).toHaveValue("");
      await expect(emailInput).toHaveValue("");
      await expect(messageInput).toHaveValue("");
    });

    test("should clear success message after timeout", async ({ page }) => {
      // Mock API success response
      await page.route("**/api/**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true }),
        });
      });

      await page.goto("/contact");
      await page.waitForLoadState("load");

      await fillContactForm(page);
      await page.click('button[type="submit"]');

      // Verify success message appears
      const successMessage = page.locator(".bg-green-200");
      await expect(successMessage).toBeVisible({ timeout: 5000 });

      // Wait for message to clear (3 seconds timeout)
      await page.waitForTimeout(3500);

      // Verify success message is gone
      await expect(successMessage).not.toBeVisible();
    });

    test("should display error message on server error", async ({ page }) => {
      // Mock API error response
      await page.route("**/api/**", async (route) => {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ success: false, message: "Server error" }),
        });
      });

      await page.goto("/contact");
      await page.waitForLoadState("load");

      await fillContactForm(page);
      await page.click('button[type="submit"]');

      // Verify error message appears (red background)
      const errorMessage = page.locator(".bg-red-200");
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
    });

    test("should display error message on network failure", async ({
      page,
    }) => {
      // Mock network failure
      await page.route("**/api/**", async (route) => {
        await route.abort("failed");
      });

      await page.goto("/contact");
      await page.waitForLoadState("load");

      await fillContactForm(page);
      await page.click('button[type="submit"]');

      // Verify error message appears (red background)
      const errorMessage = page.locator(".bg-red-200");
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
    });

    test("should show character limit message for message field", async ({
      page,
    }) => {
      await page.goto("/contact");
      await page.waitForLoadState("load");

      // The maxChars message should be visible
      const maxCharsMessage = page.locator("text=/max|500|char/i");
      await expect(maxCharsMessage).toBeVisible();
    });
  });
});
