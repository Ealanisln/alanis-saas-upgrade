import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "./fixtures/test-fixtures";

/**
 * Accessibility tests using axe-core
 * Tests WCAG 2.1 Level AA compliance across the single-page portfolio
 * (/ and /es) and the blog (the only remaining standalone pages).
 *
 * Note: Tests filter out known issues and only fail on critical violations.
 * Serious and moderate violations are logged for incremental fixes.
 */

// Known issues to exclude from test failures (tracked separately)
const EXCLUDED_RULES: string[] = [];

const scanPage = async (
  page: import("@playwright/test").Page,
  path: string,
  label: string,
) => {
  await page.goto(path);
  await page.waitForLoadState("load");

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .disableRules(EXCLUDED_RULES)
    .analyze();

  // Log violations for visibility
  if (accessibilityScanResults.violations.length > 0) {
    console.log(
      `${label}: ${accessibilityScanResults.violations.length} violations`,
    );
    accessibilityScanResults.violations.forEach((v) => {
      console.log(`  - [${v.impact}] ${v.id}: ${v.help}`);
    });
  }

  return accessibilityScanResults;
};

test.describe("Accessibility - Page Scans", () => {
  test("home page (portfolio) should have no critical accessibility violations", async ({
    page,
  }) => {
    const results = await scanPage(page, "/", "Home page");

    // Only fail on critical violations
    const criticalViolations = results.violations.filter(
      (v) => v.impact === "critical",
    );

    expect(criticalViolations).toEqual([]);
  });

  test("blog page should have no critical accessibility violations", async ({
    page,
  }) => {
    const results = await scanPage(page, "/blog", "Blog page");

    const criticalViolations = results.violations.filter(
      (v) => v.impact === "critical",
    );

    expect(criticalViolations).toEqual([]);
  });

  test("Spanish home page should have no critical accessibility violations", async ({
    page,
  }) => {
    const results = await scanPage(page, "/es", "Spanish home");

    const criticalViolations = results.violations.filter(
      (v) => v.impact === "critical",
    );

    expect(criticalViolations).toEqual([]);
  });

  test("Spanish blog page should have no critical accessibility violations", async ({
    page,
  }) => {
    const results = await scanPage(page, "/es/blog", "Spanish blog");

    const criticalViolations = results.violations.filter(
      (v) => v.impact === "critical",
    );

    expect(criticalViolations).toEqual([]);
  });
});

test.describe("Accessibility - Portfolio Sections", () => {
  // The old standalone /about, /portfolio, /plans, /contact pages are now
  // sections of the single-page portfolio. Scan each section individually
  // so a violation report points at the responsible section.
  const sections = ["#about", "#experience", "#projects", "#skills", "#blog"];

  for (const section of sections) {
    test(`${section} section should have no critical accessibility violations`, async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .include(section)
        .withTags(["wcag2a", "wcag2aa"])
        .disableRules(EXCLUDED_RULES)
        .analyze();

      if (accessibilityScanResults.violations.length > 0) {
        console.log(
          `${section} section: ${accessibilityScanResults.violations.length} violations`,
        );
        accessibilityScanResults.violations.forEach((v) => {
          console.log(`  - [${v.impact}] ${v.id}: ${v.help}`);
        });
      }

      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === "critical",
      );

      expect(criticalViolations).toEqual([]);
    });
  }
});

test.describe("Accessibility - Navigation", () => {
  test("navigation should be keyboard accessible", async ({
    page,
    browserName,
  }) => {
    // Skip on WebKit - keyboard focus handling differs in WebKit/Playwright
    test.skip(
      browserName === "webkit",
      "WebKit keyboard focus handling differs in Playwright",
    );

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Wait for the sticky nav to be ready
    await page
      .locator("nav a, nav button, [tabindex]")
      .first()
      .waitFor({ state: "visible" });

    // Tab to first focusable element
    await page.keyboard.press("Tab");

    // Check that an element is focused
    const focusedElement = await page.evaluate(
      () => document.activeElement?.tagName,
    );
    expect(focusedElement).toBeTruthy();
    expect(focusedElement).not.toBe("BODY");
  });

  test("nav toggle buttons should have accessible names", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");

    // Language toggle (English UI announces the switch target in Spanish)
    await expect(
      page.getByRole("button", { name: "Cambiar a español" }),
    ).toBeVisible();

    // Theme toggle
    await expect(
      page.getByRole("button", { name: "Toggle dark mode" }),
    ).toBeVisible();
  });

  test("mobile menu button should expose aria-expanded state", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("load");

    const menuButton = page.getByRole("button", { name: "Open menu" });
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  });
});

test.describe("Accessibility - Contact Form", () => {
  // The contact form now lives in the #contact section of the home page.
  test("contact form should have no critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("load");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include("#contact form")
      .withTags(["wcag2a", "wcag2aa"])
      .disableRules(EXCLUDED_RULES)
      .analyze();

    if (accessibilityScanResults.violations.length > 0) {
      console.log(
        `Contact form: ${accessibilityScanResults.violations.length} violations`,
      );
      accessibilityScanResults.violations.forEach((v) => {
        console.log(`  - [${v.impact}] ${v.id}: ${v.help}`);
      });
    }

    const criticalViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === "critical",
    );

    expect(criticalViolations).toEqual([]);
  });

  test("form inputs should be focusable", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");

    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[type="email"]');
    const messageInput = page.locator('textarea[name="message"]');

    // Verify inputs exist and are focusable
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageInput).toBeVisible();

    // Focus each input directly
    await nameInput.focus();
    await expect(nameInput).toBeFocused();

    await emailInput.focus();
    await expect(emailInput).toBeFocused();

    await messageInput.focus();
    await expect(messageInput).toBeFocused();
  });
});

test.describe("Accessibility - Document Structure", () => {
  test("page should have valid lang attribute", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");

    const html = page.locator("html");
    const lang = await html.getAttribute("lang");

    expect(lang).toBeTruthy();
    expect(lang).toMatch(/^(en|es)/);
  });

  test("page should have exactly one h1 (hero name)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Wait for the hero heading to render
    await page
      .locator("h1")
      .first()
      .waitFor({ state: "visible", timeout: 10000 });

    const h1 = page.locator("h1");
    const h1Count = await h1.count();

    expect(h1Count).toBe(1);
    await expect(h1.first()).toContainText("Emmanuel Alanis");
  });

  test("page should have a title", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");

    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });
});

test.describe("Accessibility - Images", () => {
  test("images should have alt text", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a"])
      .disableRules(EXCLUDED_RULES)
      .analyze();

    const imageViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === "image-alt",
    );

    if (imageViolations.length > 0) {
      console.log(`Image alt text violations: ${imageViolations.length}`);
      imageViolations.forEach((v) => {
        v.nodes.forEach((node) => {
          console.log(`  - ${node.html.substring(0, 80)}...`);
        });
      });
    }

    expect(imageViolations).toEqual([]);
  });
});

test.describe("Accessibility - ARIA", () => {
  test("ARIA attributes should be valid", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a"])
      .disableRules(EXCLUDED_RULES)
      .analyze();

    // Filter for critical ARIA violations only
    const ariaViolations = accessibilityScanResults.violations.filter(
      (v) => v.id.includes("aria") && v.impact === "critical",
    );

    if (ariaViolations.length > 0) {
      console.log(`Critical ARIA violations: ${ariaViolations.length}`);
      ariaViolations.forEach((v) => {
        console.log(`  - [${v.impact}] ${v.id}: ${v.help}`);
      });
    }

    expect(ariaViolations).toEqual([]);
  });
});

test.describe("Accessibility - Color Contrast", () => {
  test("page should have no critical color contrast issues", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("load");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2aa"])
      .disableRules(EXCLUDED_RULES)
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === "color-contrast" && v.impact === "critical",
    );

    if (contrastViolations.length > 0) {
      console.log(`Critical contrast violations: ${contrastViolations.length}`);
      contrastViolations.forEach((v) => {
        v.nodes.forEach((node) => {
          console.log(`  - ${node.html.substring(0, 80)}...`);
        });
      });
    }

    expect(contrastViolations).toEqual([]);
  });
});
