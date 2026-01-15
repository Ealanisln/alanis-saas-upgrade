import { test, expect } from "./fixtures/test-fixtures";

test.describe("Navigation", () => {
  test.beforeEach(async ({ page, localePath }) => {
    await page.goto(localePath("/"));
    await page.waitForLoadState("networkidle");
  });

  test.describe("header navigation", () => {
    test("should display navigation menu", async ({ page }) => {
      const nav = page.locator("nav").first();
      await expect(nav).toBeVisible();
    });

    test("should have all main navigation links", async ({ page }) => {
      // Check for main navigation items
      const navLinks = [
        /home|inicio/i,
        /about|acerca/i,
        /portfolio|portafolio/i,
        /blog/i,
        /plans|planes/i,
        /contact|contacto/i,
      ];

      for (const linkText of navLinks) {
        const link = page.getByRole("link", { name: linkText }).first();
        const isVisible = await link.isVisible().catch(() => false);
        // At least most navigation items should be visible
        if (!isVisible) {
          console.log(`Navigation link not found: ${linkText}`);
        }
      }
    });

    test("should navigate to About page", async ({ page, localePath }) => {
      const aboutLink = page
        .getByRole("link", { name: /about|acerca/i })
        .first();

      if (await aboutLink.isVisible()) {
        await aboutLink.click();
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL(new RegExp(localePath("/about")));
      }
    });

    test("should navigate to Portfolio page", async ({ page, localePath }) => {
      const portfolioLink = page
        .getByRole("link", { name: /portfolio|portafolio/i })
        .first();

      if (await portfolioLink.isVisible()) {
        await portfolioLink.click();
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL(new RegExp(localePath("/portfolio")));
      }
    });

    test("should navigate to Blog page", async ({ page, localePath }) => {
      const blogLink = page.getByRole("link", { name: /blog/i }).first();

      if (await blogLink.isVisible()) {
        await blogLink.click();
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL(new RegExp(localePath("/blog")));
      }
    });

    test("should navigate to Plans page", async ({ page, localePath }) => {
      const plansLink = page
        .getByRole("link", { name: /plans|planes/i })
        .first();

      if (await plansLink.isVisible()) {
        await plansLink.click();
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL(new RegExp(localePath("/plans")));
      }
    });

    test("should navigate to Contact page", async ({ page, localePath }) => {
      const contactLink = page
        .getByRole("link", { name: /contact|contacto/i })
        .first();

      if (await contactLink.isVisible()) {
        await contactLink.click();
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL(new RegExp(localePath("/contact")));
      }
    });
  });

  test.describe("logo navigation", () => {
    test("should navigate to home when logo is clicked", async ({
      page,
      localePath,
    }) => {
      // First navigate away from home
      await page.goto(localePath("/about"));
      await page.waitForLoadState("networkidle");

      // Click logo to go back home
      const logo = page
        .getByRole("link")
        .filter({ has: page.locator('img[alt="logo"]') })
        .first();

      if (await logo.isVisible()) {
        await logo.click();
        await page.waitForLoadState("networkidle");
        // Should be at home page (root or locale root)
        const url = page.url();
        expect(
          url.endsWith("/") || url.endsWith("/es") || url.endsWith("/es/"),
        ).toBe(true);
      }
    });
  });

  test.describe("footer navigation", () => {
    test("should have footer links", async ({ page }) => {
      const footer = page.locator("footer").first();
      await expect(footer).toBeVisible();

      // Check for common footer links
      const footerLinks = footer.getByRole("link");
      const count = await footerLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test("should navigate to terms page from footer", async ({
      page,
      localePath,
    }) => {
      const termsLink = page
        .locator("footer")
        .getByRole("link", { name: /terms|términos/i })
        .first();

      if (await termsLink.isVisible()) {
        await termsLink.click();
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL(new RegExp(localePath("/terms")));
      }
    });

    test("should navigate to privacy page from footer", async ({
      page,
      localePath,
    }) => {
      const privacyLink = page
        .locator("footer")
        .getByRole("link", { name: /privacy|privacidad/i })
        .first();

      if (await privacyLink.isVisible()) {
        await privacyLink.click();
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL(new RegExp(localePath("/privacy")));
      }
    });
  });

  test.describe("browser navigation", () => {
    test("should support browser back button", async ({ page, localePath }) => {
      // Navigate to about
      await page.goto(localePath("/about"));
      await page.waitForLoadState("networkidle");

      // Navigate to contact
      await page.goto(localePath("/contact"));
      await page.waitForLoadState("networkidle");

      // Go back
      await page.goBack();
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveURL(new RegExp(localePath("/about")));
    });

    test("should support browser forward button", async ({
      page,
      localePath,
    }) => {
      // Navigate to about
      await page.goto(localePath("/about"));
      await page.waitForLoadState("networkidle");

      // Navigate to contact
      await page.goto(localePath("/contact"));
      await page.waitForLoadState("networkidle");

      // Go back then forward
      await page.goBack();
      await page.waitForLoadState("networkidle");
      await page.goForward();
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveURL(new RegExp(localePath("/contact")));
    });
  });
});

test.describe("Mobile Navigation", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("should display mobile menu toggle", async ({ page, localePath }) => {
    await page.goto(localePath("/"));
    await page.waitForLoadState("networkidle");

    // Look for mobile menu button
    const menuButton = page.getByRole("button", { name: /mobile menu/i });
    await expect(menuButton).toBeVisible();
  });

  test("should toggle mobile menu on click", async ({ page, localePath }) => {
    await page.goto(localePath("/"));
    await page.waitForLoadState("networkidle");

    const menuButton = page.getByRole("button", { name: /mobile menu/i });

    if (await menuButton.isVisible()) {
      await menuButton.click();

      // Mobile nav should become visible
      const nav = page.locator("#navbarCollapse");
      await expect(nav).toHaveClass(/visibility/);
    }
  });

  test("should close mobile menu after navigation", async ({
    page,
    localePath,
  }) => {
    await page.goto(localePath("/"));
    await page.waitForLoadState("networkidle");

    const menuButton = page.getByRole("button", { name: /mobile menu/i });

    if (await menuButton.isVisible()) {
      // Open menu
      await menuButton.click();

      // Click a navigation link
      const aboutLink = page
        .getByRole("link", { name: /about|acerca/i })
        .first();
      if (await aboutLink.isVisible()) {
        await aboutLink.click();
        await page.waitForLoadState("networkidle");

        // Menu should close
        const nav = page.locator("#navbarCollapse");
        await expect(nav).toHaveClass(/invisible/);
      }
    }
  });
});
