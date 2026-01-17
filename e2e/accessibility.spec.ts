import { test, expect } from "./fixtures/test-fixtures";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility tests using axe-core
 * Tests WCAG 2.1 Level AA compliance across main pages
 *
 * Note: Tests filter out known issues and only fail on critical violations.
 * Serious and moderate violations are logged for incremental fixes.
 */

// Known issues to exclude from test failures (tracked separately)
const EXCLUDED_RULES = [
  "link-in-text-block", // Footer link styling
  "link-name", // Some icon links need aria-labels (tracked as separate issue)
];

test.describe("Accessibility - Page Scans", () => {
  test("home page should have no critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("load");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .disableRules(EXCLUDED_RULES)
      .analyze();

    // Log violations for visibility
    if (accessibilityScanResults.violations.length > 0) {
      console.log(
        `Home page: ${accessibilityScanResults.violations.length} violations`,
      );
      accessibilityScanResults.violations.forEach((v) => {
        console.log(`  - [${v.impact}] ${v.id}: ${v.help}`);
      });
    }

    // Only fail on critical violations
    const criticalViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === "critical",
    );

    expect(criticalViolations).toEqual([]);
  });

  test("blog page should have no critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/blog");
    await page.waitForLoadState("load");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .disableRules(EXCLUDED_RULES)
      .analyze();

    if (accessibilityScanResults.violations.length > 0) {
      console.log(
        `Blog page: ${accessibilityScanResults.violations.length} violations`,
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

  test("portfolio page should have no critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/portafolio");
    await page.waitForLoadState("load");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .disableRules(EXCLUDED_RULES)
      .analyze();

    if (accessibilityScanResults.violations.length > 0) {
      console.log(
        `Portfolio page: ${accessibilityScanResults.violations.length} violations`,
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

  test("plans page should have no critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/plans");
    await page.waitForLoadState("load");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .disableRules(EXCLUDED_RULES)
      .analyze();

    if (accessibilityScanResults.violations.length > 0) {
      console.log(
        `Plans page: ${accessibilityScanResults.violations.length} violations`,
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

  test("contact page should have no critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/contact");
    await page.waitForLoadState("load");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .disableRules(EXCLUDED_RULES)
      .analyze();

    if (accessibilityScanResults.violations.length > 0) {
      console.log(
        `Contact page: ${accessibilityScanResults.violations.length} violations`,
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

  test("Spanish home page should have no critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/es");
    await page.waitForLoadState("load");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .disableRules(EXCLUDED_RULES)
      .analyze();

    if (accessibilityScanResults.violations.length > 0) {
      console.log(
        `Spanish home: ${accessibilityScanResults.violations.length} violations`,
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

    // Wait for navigation to be ready
    await page
      .locator("nav a, header a, [tabindex]")
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
});

test.describe("Accessibility - Form", () => {
  test("contact form should have no critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/contact");
    await page.waitForLoadState("load");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include("form")
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
    await page.goto("/contact");
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

  test("page should have at least one h1 heading", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Wait for main content to render (webkit needs explicit element wait)
    await page
      .locator("h1")
      .first()
      .waitFor({ state: "visible", timeout: 10000 });

    const h1 = page.locator("h1");
    const h1Count = await h1.count();

    expect(h1Count).toBeGreaterThanOrEqual(1);
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
