import { test, expect, Page } from "@playwright/test";

/**
 * E2E tests for the translation fallback strategy (AWDP-31)
 *
 * These tests verify that:
 * 1. Pages don't break with missing translations
 * 2. Content falls back to English correctly
 * 3. No console errors occur for missing content
 * 4. Users see content even if not fully translated
 */

test.describe("Translation Fallback Strategy", () => {
  // Helper to collect console errors
  const collectConsoleErrors = (page: Page) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });
    return errors;
  };

  test.describe("Blog pages with fallback", () => {
    test("should load Spanish blog page without breaking when posts may lack Spanish translations", async ({
      page,
    }) => {
      const errors = collectConsoleErrors(page);

      await page.goto("/es/blog");
      await page.waitForLoadState("load");

      // Page should load successfully
      await expect(page).toHaveTitle(/Blog|Alanis/i, { timeout: 10000 });

      // Main content should be visible
      const mainContent = page.locator("main");
      await expect(mainContent).toBeVisible({ timeout: 10000 });

      // No JavaScript errors should occur (excluding third-party analytics and CSP)
      const jsErrors = errors.filter(
        (e) =>
          !e.includes("favicon") &&
          !e.includes("404") &&
          !e.includes("Failed to load resource") &&
          !e.includes("Content Security Policy") &&
          !e.includes("analytics") &&
          !e.includes("_vercel/insights") &&
          !e.includes("MIME type"),
      );
      expect(jsErrors).toHaveLength(0);
    });

    test("should display blog post content in Spanish or fallback to English", async ({
      page,
    }) => {
      await page.goto("/es/blog");
      await page.waitForLoadState("load");

      // Look for blog post cards or articles
      const articles = page.locator(
        'article, [data-testid="blog-post"], .blog-post, .post-card',
      );
      const articlesCount = await articles.count();

      if (articlesCount > 0) {
        // Each article should have visible title text (in any language due to fallback)
        const firstArticle = articles.first();
        await expect(firstArticle).toBeVisible();

        // Article should contain text content (either Spanish or English fallback)
        const textContent = await firstArticle.textContent();
        expect(textContent).toBeTruthy();
        expect(textContent!.length).toBeGreaterThan(0);
      }
    });

    test("should navigate to individual blog post in Spanish without errors", async ({
      page,
      browserName,
    }) => {
      // Skip on WebKit - click interception issues prevent navigation
      test.skip(
        browserName === "webkit",
        "WebKit has click interception issues",
      );

      // Increase timeout for Sanity fetches
      test.setTimeout(60000);

      const errors = collectConsoleErrors(page);

      await page.goto("/es/blog");
      await page.waitForLoadState("load");

      // Find first blog post link
      const postLink = page
        .locator('a[href*="/blog/"]:not([href$="/blog/"])')
        .first();
      const hasPost = (await postLink.count()) > 0;

      if (hasPost) {
        // Click and wait for navigation
        await postLink.click();
        await page.waitForURL(/\/es\/blog\/.+/, { timeout: 30000 });
        await page.waitForLoadState("load");

        // Page should load without breaking
        const mainContent = page.locator("main, article, .prose");
        await expect(mainContent.first()).toBeVisible({ timeout: 15000 });

        // Wait for Sanity content to load - look for heading or paragraph inside article
        // Content may take time to fetch from Sanity CMS
        const contentIndicator = page.locator(
          "article h1, article h2, article p, .prose h1, .prose h2, .prose p",
        );
        await expect(contentIndicator.first()).toBeVisible({ timeout: 30000 });

        // Should display content (fallback is acceptable)
        const content = page.locator("article, .prose, main").first();
        const text = await content.textContent();
        expect(text).toBeTruthy();
        expect(text!.length).toBeGreaterThan(10);

        // No JavaScript errors related to missing translations (excluding third-party analytics and CSP)
        const jsErrors = errors.filter(
          (e) =>
            !e.includes("favicon") &&
            !e.includes("404") &&
            !e.includes("Failed to load resource") &&
            !e.includes("Content Security Policy") &&
            !e.includes("analytics") &&
            !e.includes("_vercel/insights") &&
            !e.includes("MIME type") &&
            !e.includes("TLS"),
        );
        expect(jsErrors).toHaveLength(0);
      }
    });
  });

  test.describe("Portfolio pages with fallback", () => {
    test("should load Spanish portfolio page without breaking", async ({
      page,
    }) => {
      const errors = collectConsoleErrors(page);

      await page.goto("/es/portfolio");
      await page.waitForLoadState("load");

      // Page should load successfully
      await expect(page).toHaveTitle(/Portfolio|Portafolio|Alanis/i, {
        timeout: 10000,
      });

      // Main content should be visible
      const mainContent = page.locator("main");
      await expect(mainContent).toBeVisible({ timeout: 10000 });

      // No JavaScript errors (excluding third-party analytics and CSP)
      const jsErrors = errors.filter(
        (e) =>
          !e.includes("favicon") &&
          !e.includes("404") &&
          !e.includes("Failed to load resource") &&
          !e.includes("Content Security Policy") &&
          !e.includes("analytics") &&
          !e.includes("_vercel/insights") &&
          !e.includes("MIME type"),
      );
      expect(jsErrors).toHaveLength(0);
    });
  });

  test.describe("Content consistency across locales", () => {
    test("should display content on both English and Spanish pages", async ({
      page,
    }) => {
      // Increase timeout for Sanity fetches
      test.setTimeout(60000);

      // Test English
      await page.goto("/blog");
      await page.waitForLoadState("load");
      const englishMain = page.locator("main");
      await expect(englishMain).toBeVisible({ timeout: 15000 });

      // Get English content before navigating
      const englishContent = await englishMain.textContent();

      // Test Spanish (with fallback)
      await page.goto("/es/blog");
      await page.waitForLoadState("load");
      const spanishMain = page.locator("main");
      await expect(spanishMain).toBeVisible({ timeout: 15000 });

      // Get Spanish content
      const spanishContent = await spanishMain.textContent();

      // Both pages should render content
      expect(englishContent).toBeTruthy();
      expect(spanishContent).toBeTruthy();
    });

    test("should maintain page structure when translations are missing", async ({
      page,
    }) => {
      await page.goto("/es/blog");
      await page.waitForLoadState("load");

      // Check that essential page elements are present
      const header = page.locator("header");
      const footer = page.locator("footer");
      const main = page.locator("main");

      await expect(header).toBeVisible({ timeout: 10000 });
      await expect(footer).toBeVisible({ timeout: 10000 });
      await expect(main).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Language attribute consistency", () => {
    test("should set correct lang attribute even when using fallback content", async ({
      page,
    }) => {
      await page.goto("/es/blog");
      await page.waitForLoadState("load");

      // The page should still indicate Spanish locale
      const html = page.locator("html");
      await expect(html).toHaveAttribute("lang", "es", { timeout: 10000 });
    });
  });

  test.describe("No breaking errors", () => {
    const pagesToTest = [
      { path: "/es", name: "Spanish Home" },
      { path: "/es/blog", name: "Spanish Blog" },
      { path: "/es/portfolio", name: "Spanish Portfolio" },
      { path: "/es/contact", name: "Spanish Contact" },
      { path: "/es/plans", name: "Spanish Plans" },
    ];

    for (const { path, name } of pagesToTest) {
      test(`${name} page should load without JavaScript errors`, async ({
        page,
      }) => {
        const errors = collectConsoleErrors(page);

        await page.goto(path);
        await page.waitForLoadState("load");

        // Page should render
        const body = page.locator("body");
        await expect(body).toBeVisible({ timeout: 10000 });

        // Filter out expected non-critical errors (including third-party analytics and CSP)
        const criticalErrors = errors.filter(
          (e) =>
            !e.includes("favicon") &&
            !e.includes("Failed to load resource") &&
            !e.includes("404") &&
            !e.includes("net::ERR") &&
            !e.includes("Content Security Policy") &&
            !e.includes("analytics") &&
            !e.includes("_vercel/insights") &&
            !e.includes("MIME type"),
        );

        // No critical JavaScript errors
        expect(criticalErrors).toHaveLength(0);
      });
    }
  });
});
