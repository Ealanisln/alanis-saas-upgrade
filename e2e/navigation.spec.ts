import { test, expect } from "./fixtures/test-fixtures";
import type { Page } from "@playwright/test";

// The redesign turned the site into a single-page portfolio: the nav links
// are anchors into home sections (#about, #experience, ...), the Blog nav
// link anchors to the #blog SECTION (the /blog index is reached via the
// "View all posts" link), and the old /about and /contact pages redirect
// to /#about and /#contact.

const SECTION_LINK_IDS = ["about", "experience", "projects", "skills"] as const;

const isMobileViewport = (page: Page) => {
  const viewport = page.viewportSize();
  return viewport ? viewport.width < 768 : false;
};

// The hamburger only exists below 768px; its aria-label is locale-dependent.
const openMobileMenuIfNeeded = async (page: Page) => {
  if (isMobileViewport(page)) {
    const menuButton = page.getByRole("button", {
      name: /open menu|abrir menú/i,
    });
    if (
      (await menuButton.isVisible()) &&
      (await menuButton.getAttribute("aria-expanded")) !== "true"
    ) {
      await menuButton.click();
      await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    }
  }
};

// Desktop links are hidden (not removed) on mobile and the open mobile menu
// duplicates them, so .last() always resolves to the interactable copy.
const sectionLink = (page: Page, id: string) =>
  page.locator(`nav a[href="#${id}"]`).last();

// Click a nav anchor and verify the target section scrolled into view.
// Retried as a whole: late-loading content above the target can shift the
// hash-scroll position (smooth scrolling + lazy layout), leaving the section
// out of the viewport on the first attempt.
const clickSectionLink = async (page: Page, id: string) => {
  await expect(async () => {
    await openMobileMenuIfNeeded(page);
    await sectionLink(page, id).click();
    await expect(page.locator(`#${id}`)).toBeInViewport({ timeout: 3000 });
  }).toPass({ timeout: 20000 });
};

test.describe("Navigation", () => {
  test.beforeEach(async ({ page, localePath }) => {
    await page.goto(localePath("/"));
    await page.waitForLoadState("load");
  });

  test.describe("header navigation", () => {
    test("should display navigation menu", async ({ page }) => {
      await openMobileMenuIfNeeded(page);

      const nav = page.locator("nav").first();
      await expect(nav).toBeVisible({ timeout: 10000 });
    });

    test("should have all main section links", async ({ page }) => {
      await openMobileMenuIfNeeded(page);

      for (const id of ["about", "experience", "projects", "skills", "blog"]) {
        await expect(sectionLink(page, id)).toBeVisible({ timeout: 10000 });
      }
    });

    test("should scroll to each section via nav anchor links", async ({
      page,
    }) => {
      for (const id of SECTION_LINK_IDS) {
        await clickSectionLink(page, id);
        await expect(page).toHaveURL(new RegExp(`#${id}$`), {
          timeout: 10000,
        });
      }
    });

    test("Blog nav link anchors to the blog section, not the /blog page", async ({
      page,
      localePath,
    }) => {
      await clickSectionLink(page, "blog");

      await expect(page).toHaveURL(/#blog$/, { timeout: 10000 });
      // Must NOT have navigated to the blog index page
      expect(new URL(page.url()).pathname).toBe(localePath("/"));
    });

    test("CTA link scrolls to the contact section", async ({ page }) => {
      await clickSectionLink(page, "contact");

      await expect(page).toHaveURL(/#contact$/, { timeout: 10000 });
    });

    test("blog index is reached via the 'View all posts' link", async ({
      page,
      localePath,
    }) => {
      const viewAll = page
        .getByRole("link", { name: /view all posts|ver todas las entradas/i })
        .first();
      await viewAll.scrollIntoViewIfNeeded();
      await viewAll.click();

      await expect(page).toHaveURL(new RegExp(`${localePath("/blog")}/?$`), {
        timeout: 10000,
      });
    });
  });

  test.describe("logo navigation", () => {
    test("should have a logo link anchored to the top of the page", async ({
      page,
    }) => {
      // On the home page the logo is a pure #top anchor
      const logoLink = page.locator("nav a").first();
      await expect(logoLink).toBeVisible();
      await expect(logoLink).toHaveAttribute("href", /#top$/);
    });
  });

  test.describe("footer", () => {
    test("should have footer links", async ({ page }) => {
      const footer = page.locator("footer").first();
      await expect(footer).toBeVisible();

      const footerLinks = footer.getByRole("link");
      const count = await footerLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test("should have social and contact links in footer", async ({ page }) => {
      const footer = page.locator("footer").first();

      await expect(footer.locator('a[href*="github"]')).toBeVisible();
      await expect(footer.locator('a[href*="linkedin"]')).toBeVisible();
      await expect(footer.locator('a[href^="mailto:"]')).toBeVisible();
    });

    test("should display the copyright line", async ({ page }) => {
      const footer = page.locator("footer").first();
      await expect(footer).toContainText(/© 2026 Emmanuel Alanis/);
    });

    test("locale switching lives in the nav, not the footer", async ({
      page,
    }) => {
      // The old footer language switcher was removed in the redesign;
      // the nav globe button is its replacement.
      const footer = page.locator("footer").first();
      await expect(footer.getByText("English")).toHaveCount(0);
      await expect(footer.getByText("Español")).toHaveCount(0);

      const globeButton = page
        .locator("nav")
        .getByRole("button", { name: /cambiar a español|switch to english/i });
      await expect(globeButton).toBeVisible();
    });
  });

  test.describe("legacy page redirects", () => {
    // /about and /contact survive only as redirects into the single page.
    // Next streams the shell first, so wait for the client-side redirect.
    test("/about redirects to the #about section", async ({
      page,
      localePath,
    }) => {
      await page.goto(localePath("/about"));
      await page.waitForURL(/#about$/, { timeout: 15000 });
      await expect(page.locator("#about")).toBeVisible();
    });

    test("/contact redirects to the #contact section", async ({
      page,
      localePath,
    }) => {
      await page.goto(localePath("/contact"));
      await page.waitForURL(/#contact$/, { timeout: 15000 });
      await expect(page.locator("#contact")).toBeVisible();
    });
  });

  test.describe("browser navigation", () => {
    // Note: no waitForLoadState("load") here — Next 16's link
    // prefetching keeps the network busy, so it never settles.
    // toHaveURL auto-waits, which is all these tests need.
    test("should support browser back button", async ({ page, localePath }) => {
      await page.goto(localePath("/blog"));

      await page.goBack();

      await expect(page).toHaveURL(new RegExp(`${localePath("/")}$`));
    });

    test("should support browser forward button", async ({
      page,
      localePath,
    }) => {
      await page.goto(localePath("/blog"));

      await page.goBack();
      await expect(page).toHaveURL(new RegExp(`${localePath("/")}$`));
      await page.goForward();

      await expect(page).toHaveURL(new RegExp(`${localePath("/blog")}/?$`));
    });
  });
});

test.describe("Mobile Navigation", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("should display mobile menu toggle", async ({ page, localePath }) => {
    await page.goto(localePath("/"));
    await page.waitForLoadState("load");

    const menuButton = page.getByRole("button", {
      name: /open menu|abrir menú/i,
    });
    await expect(menuButton).toBeVisible({ timeout: 10000 });
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  test("should toggle mobile menu on click", async ({ page, localePath }) => {
    await page.goto(localePath("/"));
    await page.waitForLoadState("load");

    const menuButton = page.getByRole("button", {
      name: /open menu|abrir menú/i,
    });
    await expect(menuButton).toBeVisible({ timeout: 10000 });

    // Open
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(sectionLink(page, "about")).toBeVisible({ timeout: 10000 });

    // Close
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  test("should navigate via mobile menu and close it", async ({
    page,
    localePath,
  }) => {
    await page.goto(localePath("/"));
    await page.waitForLoadState("load");

    const menuButton = page.getByRole("button", {
      name: /open menu|abrir menú/i,
    });

    // Opens the menu (and re-opens it on retry) before clicking the link
    await clickSectionLink(page, "about");

    // Tapping a link scrolls to the section and closes the menu
    await expect(page).toHaveURL(/#about$/, { timeout: 10000 });
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  test("mobile menu includes the contact CTA", async ({ page, localePath }) => {
    await page.goto(localePath("/"));
    await page.waitForLoadState("load");

    const menuButton = page.getByRole("button", {
      name: /open menu|abrir menú/i,
    });
    await menuButton.click();

    const cta = sectionLink(page, "contact");
    await expect(cta).toBeVisible({ timeout: 10000 });
    await expect(cta).toHaveText(/get in touch|contáctame/i);
  });
});
