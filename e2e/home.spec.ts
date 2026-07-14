import { test, expect } from "./fixtures/test-fixtures";

// The redesigned home page is a single-page portfolio with anchored sections.
const SECTION_IDS = [
  "about",
  "experience",
  "projects",
  "skills",
  "blog",
  "contact",
] as const;

const NAV_LINKS_EN = ["About", "Experience", "Projects", "Skills", "Blog"];
const NAV_LINKS_ES = [
  "Sobre mí",
  "Experiencia",
  "Proyectos",
  "Habilidades",
  "Blog",
];

test.describe("Home Page", () => {
  test.describe("English (default locale)", () => {
    test("should load the home page", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await expect(page).toHaveTitle(/Alanis/i, { timeout: 10000 });
    });

    test("should display navigation", async ({ page, isMobile }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      const nav = page.locator("nav").first();
      await expect(nav).toBeVisible({ timeout: 10000 });

      if (isMobile) {
        // Mobile shows a hamburger button instead of the text links
        const menuButton = nav.getByRole("button", { name: /open menu/i });
        await expect(menuButton).toBeVisible({ timeout: 10000 });
      } else {
        for (const name of NAV_LINKS_EN) {
          await expect(
            nav.getByRole("link", { name, exact: true }).first(),
          ).toBeVisible({ timeout: 10000 });
        }
      }
    });

    test("should display hero with name and role", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      await expect(
        page.getByRole("heading", { level: 1, name: "Emmanuel Alanis" }),
      ).toBeVisible({ timeout: 10000 });
      // Role line also appears in the Experience section, so take the first
      await expect(
        page.getByText("Senior Full Stack Developer").first(),
      ).toBeVisible();
    });

    test("hero has a working résumé download link", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const resume = page.locator(
        'a[href="/assets/Emmanuel-Alanis-Resume.pdf"]',
      );
      await expect(resume).toBeVisible({ timeout: 10000 });
      await expect(resume).toHaveAttribute(
        "download",
        "Emmanuel-Alanis-Resume.pdf",
      );

      // The PDF asset must actually exist
      const response = await page.request.get(
        "/assets/Emmanuel-Alanis-Resume.pdf",
      );
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("pdf");
    });

    test("stats strip shows the four headline numbers", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      for (const value of [
        "2,200+",
        "8,000+",
        "Zero downtime",
        "14 releases",
      ]) {
        await expect(page.getByText(value, { exact: true })).toBeVisible({
          timeout: 10000,
        });
      }
    });

    test("should render all portfolio sections", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      for (const id of SECTION_IDS) {
        await expect(page.locator(`#${id}`)).toHaveCount(1);
      }
    });

    test("nav links are anchors to home sections", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");

      const nav = page.locator("nav").first();
      // Section links plus the CTA all anchor into the single page
      for (const id of [
        "about",
        "experience",
        "projects",
        "skills",
        "blog",
        "contact",
      ]) {
        expect(await nav.locator(`a[href="#${id}"]`).count()).toBeGreaterThan(
          0,
        );
      }
    });

    test("container uses custom breakpoint steps, not Tailwind defaults", async ({
      page,
    }) => {
      // Guards the @utility container cascade-order override in index.css:
      // at a 1000px viewport the custom 992px step must win (v4's built-in
      // .container would give 768px here).
      // The portfolio home no longer uses .container, so run this on /blog,
      // which still does.
      await page.goto("/blog");
      const container = page.locator(".container").first();

      // 1000px viewport → custom 992px step (v4 default would be 768px)
      await page.setViewportSize({ width: 1000, height: 800 });
      expect(
        await container.evaluate((el) => getComputedStyle(el).maxWidth),
      ).toBe("992px");

      // 1250px viewport → custom 1200px step (v4 default would be 1024px)
      await page.setViewportSize({ width: 1250, height: 800 });
      expect(
        await container.evaluate((el) => getComputedStyle(el).maxWidth),
      ).toBe("1200px");
    });
  });

  test.describe("Spanish locale", () => {
    test("should load the Spanish home page", async ({ page }) => {
      await page.goto("/es");
      await page.waitForLoadState("load");
      await expect(page).toHaveTitle(/Alanis/i, { timeout: 10000 });
    });

    test("should display navigation in Spanish", async ({ page, isMobile }) => {
      await page.goto("/es");
      await page.waitForLoadState("load");
      const nav = page.locator("nav").first();
      await expect(nav).toBeVisible({ timeout: 10000 });

      if (isMobile) {
        const menuButton = nav.getByRole("button", { name: /abrir menú/i });
        await expect(menuButton).toBeVisible({ timeout: 10000 });
      } else {
        for (const name of NAV_LINKS_ES) {
          await expect(
            nav.getByRole("link", { name, exact: true }).first(),
          ).toBeVisible({ timeout: 10000 });
        }
      }
    });

    test("should display Spanish hero role line", async ({ page }) => {
      await page.goto("/es");
      await page.waitForLoadState("load");

      await expect(
        page.getByRole("heading", { level: 1, name: "Emmanuel Alanis" }),
      ).toBeVisible({ timeout: 10000 });
      await expect(
        page.getByText("Desarrollador Full Stack Senior").first(),
      ).toBeVisible();
    });
  });
});
