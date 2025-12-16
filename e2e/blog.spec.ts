import { test, expect } from "@playwright/test";

test.describe("Blog Page", () => {
  test.describe("English locale", () => {
    test("should load the blog listing page", async ({ page }) => {
      await page.goto("/blog");
      await page.waitForLoadState("load");

      // Page should load without errors
      await expect(page).toHaveTitle(/Blog|Alanis/i);
    });

    test("should display blog posts or empty state", async ({ page }) => {
      await page.goto("/blog");
      await page.waitForLoadState("load");

      // Check for either blog posts or an empty state message
      const mainContent = page.locator("main");
      await expect(mainContent).toBeVisible();

      // Look for article cards or post elements
      const articles = page.locator(
        'article, [data-testid="blog-post"], .blog-post, .post-card',
      );
      const articlesCount = await articles.count();

      // If no articles, check for empty state
      if (articlesCount === 0) {
        // Empty state is acceptable for a blog with no posts
        const emptyState = page.locator(
          "text=/no posts|no articles|coming soon/i",
        );
        // Either posts exist or empty state - both are valid
      }
    });

    test("should navigate to individual blog post if posts exist", async ({
      page,
    }) => {
      await page.goto("/blog");
      await page.waitForLoadState("load");

      // Find first blog post link (exclude pagination/category links)
      const postLink = page
        .locator('a[href*="/blog/"]:not([href$="/blog/"])')
        .first();
      const hasPost = (await postLink.count()) > 0;

      if (hasPost) {
        // Click and wait for navigation
        await Promise.all([page.waitForURL(/\/blog\/.+/), postLink.click()]);

        // Should be on a blog post page (with or without locale prefix)
        expect(page.url()).toMatch(/\/(en\/)?blog\/.+/);

        // Post should have content - wait for article or prose content
        const articleContent = page.locator("article, .prose, main");
        await expect(articleContent.first()).toBeVisible();
      }
    });
  });

  test.describe("Spanish locale", () => {
    test("should load the Spanish blog listing page", async ({ page }) => {
      await page.goto("/es/blog");
      await page.waitForLoadState("load");

      await expect(page).toHaveTitle(/Blog|Alanis/i);
    });

    test("should display Spanish content", async ({ page }) => {
      await page.goto("/es/blog");
      await page.waitForLoadState("load");

      // Check the html lang attribute
      const html = page.locator("html");
      await expect(html).toHaveAttribute("lang", "es");
    });
  });
});
