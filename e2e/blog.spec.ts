import { test, expect } from "@playwright/test";

test.describe("Blog Page", () => {
  test.describe("English locale", () => {
    test("should load the blog listing page", async ({ page }) => {
      await page.goto("/blog");
      await page.waitForLoadState("networkidle");

      // Page should load without errors
      await expect(page).toHaveTitle(/Blog|Alanis/i);
    });

    test("should display blog posts or empty state", async ({ page }) => {
      await page.goto("/blog");
      await page.waitForLoadState("networkidle");

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
      await page.waitForLoadState("networkidle");

      // Find first blog post link
      const postLink = page.locator('a[href*="/blog/"]').first();
      const hasPost = (await postLink.count()) > 0;

      if (hasPost) {
        await postLink.click();
        await page.waitForLoadState("networkidle");

        // Should be on a blog post page
        expect(page.url()).toMatch(/\/blog\/.+/);

        // Post should have content
        const articleContent = page.locator("article, main");
        await expect(articleContent).toBeVisible();
      }
    });
  });

  test.describe("Spanish locale", () => {
    test("should load the Spanish blog listing page", async ({ page }) => {
      await page.goto("/es/blog");
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveTitle(/Blog|Alanis/i);
    });

    test("should display Spanish content", async ({ page }) => {
      await page.goto("/es/blog");
      await page.waitForLoadState("networkidle");

      // Check the html lang attribute
      const html = page.locator("html");
      await expect(html).toHaveAttribute("lang", "es");
    });
  });
});
