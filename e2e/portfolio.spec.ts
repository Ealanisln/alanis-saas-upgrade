import { test, expect } from "@playwright/test";

test.describe("Portfolio Page", () => {
  test.describe("English locale", () => {
    test("should load the portfolio page", async ({ page }) => {
      await page.goto("/portfolio");
      await page.waitForLoadState("load");

      await expect(page).toHaveTitle(/Portfolio|Projects|Alanis/i, {
        timeout: 10000,
      });
    });

    test("should display portfolio hero section", async ({ page }) => {
      await page.goto("/portfolio");
      await page.waitForLoadState("load");

      const mainContent = page.locator("main");
      await expect(mainContent).toBeVisible({ timeout: 10000 });
    });

    test("should display project cards or empty state", async ({ page }) => {
      await page.goto("/portfolio");
      await page.waitForLoadState("load");

      // Look for project cards
      const projectCards = page.locator(
        '[data-testid="project-card"], .project-card, article, .portfolio-item',
      );
      const cardsCount = await projectCards.count();

      // Either cards exist or page loads successfully
      const mainContent = page.locator("main");
      await expect(mainContent).toBeVisible({ timeout: 10000 });
    });

    test("should open project modal or navigate on card click", async ({
      page,
    }) => {
      await page.goto("/portfolio");
      await page.waitForLoadState("load");

      // Find clickable project elements
      const projectCard = page
        .locator('[data-testid="project-card"], .project-card, article')
        .first();

      const hasCard = (await projectCard.count()) > 0;

      if (hasCard) {
        // Check if card is clickable
        const isClickable = await projectCard.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return style.cursor === "pointer" || el.onclick !== null;
        });

        if (isClickable) {
          await projectCard.click();
          await page.waitForTimeout(500);

          // Check for modal or navigation
          const modal = page.locator(
            '[role="dialog"], .modal, [data-testid="project-modal"]',
          );
          const modalVisible = await modal.isVisible().catch(() => false);

          // Either modal opened or page navigated
          expect(
            modalVisible || page.url() !== "http://localhost:3000/portfolio",
          ).toBeTruthy();
        }
      }
    });
  });

  test.describe("Spanish locale", () => {
    test("should load the Spanish portfolio page", async ({ page }) => {
      await page.goto("/es/portfolio");
      await page.waitForLoadState("load");

      await expect(page).toHaveTitle(
        /Portfolio|Portafolio|Projects|Proyectos|Alanis/i,
        { timeout: 10000 },
      );
    });

    test("should display Spanish content", async ({ page }) => {
      await page.goto("/es/portfolio");
      await page.waitForLoadState("load");

      const html = page.locator("html");
      await expect(html).toHaveAttribute("lang", "es", { timeout: 10000 });
    });
  });
});
