import { test, expect, type Page } from "@playwright/test";

/**
 * E2E tests for the Contact section of the single-page portfolio.
 *
 * The redesign replaced the old /contact page (server-action form) with a
 * #contact section on the home page. There is NO backend: the form builds a
 * mailto: URL on submit and assigns it to window.location.href. Validation is
 * native HTML (all three fields are required, email uses type="email").
 * The old /contact route survives only as a redirect to /#contact.
 */

// Helper to fill the form with valid data
async function fillContactForm(
  page: Page,
  data = {
    name: "Test User",
    email: "test@example.com",
    message: "This is a test message for the contact form.",
  },
) {
  await page.fill("#cf-name", data.name);
  await page.fill("#cf-email", data.email);
  await page.fill("#cf-message", data.message);
  return data;
}

test.describe("Contact Section", () => {
  // The dev server compiles routes on demand and may be shared with parallel
  // suites; allow generous navigation time so cold compiles don't flake.
  test.use({ navigationTimeout: 60_000 });
  test.describe.configure({ timeout: 90_000 });

  test.describe("English locale", () => {
    test("old /contact route redirects to the home contact section", async ({
      page,
    }) => {
      await page.goto("/contact");

      // The route survives only as a redirect to the single-page anchor
      await page.waitForURL(/\/#contact$/);

      await expect(page).toHaveTitle(/Alanis|Emmanuel/i);
      await expect(page.locator("#contact")).toBeVisible();
    });

    test("should display the contact section with heading and form", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const section = page.locator("#contact");
      await expect(section).toBeVisible();
      await expect(
        section.getByRole("heading", { name: "Let's talk." }),
      ).toBeVisible();

      const form = section.locator("form");
      await expect(form).toBeVisible();
    });

    test("should have required form fields and a submit button", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const name = page.locator("#cf-name");
      const email = page.locator("#cf-email");
      const message = page.locator("#cf-message");

      await expect(name).toBeVisible();
      await expect(email).toBeVisible();
      await expect(message).toBeVisible();

      // All three fields use native required validation
      await expect(name).toHaveAttribute("required", "");
      await expect(email).toHaveAttribute("required", "");
      await expect(message).toHaveAttribute("required", "");
      await expect(email).toHaveAttribute("type", "email");

      await expect(
        page.getByRole("button", { name: "Send Message" }),
      ).toBeVisible();
    });

    test("should block empty submit via native validation", async ({
      page,
      browserName,
    }) => {
      // Skip on WebKit - validation timing issues
      test.skip(
        browserName === "webkit",
        "WebKit has validation timing issues",
      );

      await page.goto("/");
      await page.waitForLoadState("load");

      await page.getByRole("button", { name: "Send Message" }).click();

      // Native HTML validation should mark the empty required fields invalid
      const invalid = page.locator(
        "#cf-name:invalid, #cf-email:invalid, #cf-message:invalid",
      );
      await expect(invalid).toHaveCount(3);

      // Submission must not have navigated anywhere (no mailto: attempt)
      expect(page.url()).not.toMatch(/^mailto:/);
    });

    test("should flag a malformed email via native validation", async ({
      page,
      browserName,
    }) => {
      test.skip(
        browserName === "webkit",
        "WebKit has validation timing issues",
      );

      await page.goto("/");
      await page.waitForLoadState("load");

      await fillContactForm(page, {
        name: "Test User",
        email: "not-an-email",
        message: "Hello",
      });
      await page.getByRole("button", { name: "Send Message" }).click();

      // type="email" typeMismatch keeps the field invalid
      await expect(page.locator("#cf-email:invalid")).toHaveCount(1);
      const validity = await page
        .locator("#cf-email")
        .evaluate((el: HTMLInputElement) => el.validity.typeMismatch);
      expect(validity).toBe(true);
    });

    test("should have accessible labels wired to each field", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      // Each input has an explicit <label for="...">
      await expect(page.locator('label[for="cf-name"]')).toHaveText("Name");
      await expect(page.locator('label[for="cf-email"]')).toHaveText("Email");
      await expect(page.locator('label[for="cf-message"]')).toHaveText(
        "Message",
      );

      // Labels resolve as accessible names
      await expect(page.getByLabel("Name", { exact: true })).toBeVisible();
      await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
      await expect(page.getByLabel("Message", { exact: true })).toBeVisible();
    });

    test("should explain that submission opens the email client", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      // Replaces the old char-limit hint: the form now discloses the mailto flow
      await expect(
        page.getByText("Opens your email client with the message pre-filled."),
      ).toBeVisible();
    });

    test("should display direct contact links", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const section = page.locator("#contact");

      const mailLink = section.locator('a[href="mailto:emmanuel@alanis.dev"]');
      await expect(mailLink).toBeVisible();
      await expect(mailLink).toHaveText(/emmanuel@alanis\.dev/);

      const linkedin = section.locator('a[href*="linkedin.com/in/ealanis"]');
      await expect(linkedin).toBeVisible();
      await expect(linkedin).toHaveAttribute("target", "_blank");

      const github = section.locator('a[href="https://github.com/Ealanisln"]');
      await expect(github).toBeVisible();
      await expect(github).toHaveAttribute("target", "_blank");
    });
  });

  test.describe("Spanish locale", () => {
    test("old /es/contact route redirects to the Spanish contact section", async ({
      page,
    }) => {
      await page.goto("/es/contact");

      await page.waitForURL(/\/es\/?#contact$/);

      const html = page.locator("html");
      await expect(html).toHaveAttribute("lang", "es");
      await expect(page.locator("#contact")).toBeVisible();
    });

    test("should display form with Spanish labels", async ({ page }) => {
      await page.goto("/es");
      await page.waitForLoadState("load");

      const section = page.locator("#contact");
      await expect(section.locator("form")).toBeVisible();

      await expect(page.locator('label[for="cf-name"]')).toHaveText("Nombre");
      await expect(page.locator('label[for="cf-message"]')).toHaveText(
        "Mensaje",
      );
      await expect(
        page.getByRole("button", { name: "Enviar mensaje" }),
      ).toBeVisible();

      const html = page.locator("html");
      await expect(html).toHaveAttribute("lang", "es");
    });
  });

  test.describe("Form submission (mailto construction)", () => {
    // The submit handler builds a mailto: URL and assigns window.location.href.
    // The browser cancels external-protocol navigations in headless mode, so we
    // capture the requested navigation via CDP (Chromium-only) and assert the
    // exact subject/body construction.
    test("should build the mailto URL with the specced subject and body", async ({
      page,
      browserName,
    }) => {
      test.skip(
        browserName !== "chromium",
        "CDP navigation capture is Chromium-only",
      );

      await page.goto("/");
      await page.waitForLoadState("load");

      const client = await page.context().newCDPSession(page);
      await client.send("Page.enable");

      const mailtoRequested = new Promise<string>((resolve) => {
        client.on("Page.frameRequestedNavigation", (event) => {
          if (event.url.startsWith("mailto:")) {
            resolve(event.url);
          }
        });
      });

      const data = await fillContactForm(page);
      await page.getByRole("button", { name: "Send Message" }).click();

      const mailtoUrl = await mailtoRequested;

      const url = new URL(mailtoUrl);
      expect(url.protocol).toBe("mailto:");
      expect(url.pathname).toBe("emmanuel@alanis.dev");
      expect(url.searchParams.get("subject")).toBe(
        `Opportunity for Emmanuel — from ${data.name}`,
      );
      expect(url.searchParams.get("body")).toBe(
        `${data.message}\n\n— ${data.name} (${data.email})`,
      );
    });

    test("valid submission passes native validation and stays on the page", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      await fillContactForm(page);
      await page.getByRole("button", { name: "Send Message" }).click();

      // No field is invalid after a valid submission
      await expect(
        page.locator(
          "#cf-name:invalid, #cf-email:invalid, #cf-message:invalid",
        ),
      ).toHaveCount(0);

      // mailto: is handled externally — the page itself must not navigate away,
      // and the form keeps its values (there is no success/reset state anymore)
      await expect(page.locator("#contact")).toBeVisible();
      await expect(page.locator("#cf-name")).toHaveValue("Test User");
      await expect(page.locator("#cf-email")).toHaveValue("test@example.com");
    });
  });
});
