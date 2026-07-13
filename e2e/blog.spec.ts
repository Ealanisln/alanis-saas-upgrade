import { test, expect } from "@playwright/test";

test.describe("Blog Page", () => {
  test.describe("English locale", () => {
    test("should load the blog listing page", async ({ page }) => {
      await page.goto("/blog");
      await page.waitForLoadState("load");

      // Page should load without errors
      await expect(page).toHaveTitle(/Blog|Alanis/i, { timeout: 10000 });
    });

    test("should render with the portfolio nav and footer", async ({
      page,
    }) => {
      await page.goto("/blog");
      await page.waitForLoadState("load");

      // The redesigned sticky nav and always-dark footer wrap every page
      const nav = page.locator("nav").first();
      await expect(nav).toBeVisible({ timeout: 10000 });
      await expect(
        nav.getByRole("button", { name: "Cambiar a español" }),
      ).toBeVisible();

      // Scope past the Next dev-error overlay, which injects its own <footer>
      const footer = page.locator("footer", { hasText: "Emmanuel Alanis" });
      await expect(footer).toBeVisible();
      await expect(footer.getByRole("link", { name: "GitHub" })).toBeVisible();
    });

    test("should display blog posts or empty state", async ({ page }) => {
      await page.goto("/blog");
      await page.waitForLoadState("load");

      // Check for either blog posts or an empty state message
      const mainContent = page.locator("main");
      await expect(mainContent).toBeVisible({ timeout: 10000 });

      // Look for article cards or post elements
      const articles = page.locator(
        'article, [data-testid="blog-post"], .blog-post, .post-card',
      );
      const articlesCount = await articles.count();

      // With no posts (e.g. CI's placeholder Sanity project) the page renders
      // an empty grid — there is no empty-state message. Assert the page
      // still renders instead of crashing.
      if (articlesCount === 0) {
        await expect(page.locator("main, h1, h2").first()).toBeVisible();
      }
    });

    test("should navigate to individual blog post if posts exist", async ({
      page,
      browserName,
    }) => {
      // Skip on WebKit - click interception issues prevent navigation
      test.skip(
        browserName === "webkit",
        "WebKit has click interception issues",
      );

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

  test.describe("Home page #blog section", () => {
    // The single-page portfolio surfaces the blog on the home page:
    // a featured post card plus recent-post rows, all linking into /blog.
    test("should render the blog section with post links", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const blogSection = page.locator("section#blog");
      await expect(blogSection).toBeVisible({ timeout: 10000 });

      // Section heading
      await expect(blogSection.locator("h2")).toBeVisible();

      // Data-shape-agnostic: 2 "view all" links + at least the featured card.
      // (7 links with fallback copy or >=3 posts, but a live dataset with 1-2
      // posts legitimately renders fewer rows.)
      const postLinks = blogSection.locator('a[href*="/blog"]');
      expect(await postLinks.count()).toBeGreaterThanOrEqual(3);
    });

    test("view-all link should navigate to the blog listing", async ({
      page,
      browserName,
    }) => {
      test.skip(
        browserName === "webkit",
        "WebKit has click interception issues",
      );

      await page.goto("/");
      await page.waitForLoadState("load");

      // Desktop "View all posts" link points at the blog index
      const viewAll = page.locator('section#blog a[href$="/blog"]').first();
      await expect(viewAll).toBeVisible();

      await Promise.all([page.waitForURL(/\/blog$/), viewAll.click()]);
      await expect(page.locator("main")).toBeVisible();
    });
  });

  test.describe("Spanish locale", () => {
    test("should load the Spanish blog listing page", async ({ page }) => {
      await page.goto("/es/blog");
      await page.waitForLoadState("load");

      await expect(page).toHaveTitle(/Blog|Alanis/i, { timeout: 10000 });
    });

    test("should display Spanish content", async ({ page }) => {
      await page.goto("/es/blog");
      await page.waitForLoadState("load");

      // Check the html lang attribute
      const html = page.locator("html");
      await expect(html).toHaveAttribute("lang", "es", { timeout: 10000 });
    });
  });
});
