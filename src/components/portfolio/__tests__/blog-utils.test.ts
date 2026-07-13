import { describe, expect, it } from "vitest";
import {
  formatDate,
  localizePortfolioPost,
  readMinutes,
  type PortfolioPost,
} from "../blog-utils";

describe("formatDate", () => {
  it("formats English dates as 'Mon D, YYYY'", () => {
    expect(formatDate("2026-06-28T12:00:00Z", "en")).toBe("Jun 28, 2026");
  });

  it("formats Spanish dates in es-MX order", () => {
    // es-MX renders "28 jun 2026" (day month year, lowercase month)
    const result = formatDate("2026-06-28T12:00:00Z", "es");
    expect(result).toMatch(/28/);
    expect(result.toLowerCase()).toMatch(/jun/);
    expect(result).toMatch(/2026/);
  });

  it("returns empty string for undefined input", () => {
    expect(formatDate(undefined, "en")).toBe("");
  });
});

describe("readMinutes", () => {
  it("estimates at ~200 words per minute", () => {
    const words = Array(600).fill("word").join(" ");
    expect(readMinutes(words)).toBe(3);
  });

  it("returns at least 1 minute for short bodies", () => {
    expect(readMinutes("just a few words")).toBe(1);
  });

  it("returns 1 minute for undefined or empty body", () => {
    expect(readMinutes(undefined)).toBe(1);
    expect(readMinutes("")).toBe(1);
  });

  it("rounds to the nearest minute", () => {
    const words = Array(500).fill("word").join(" ");
    expect(readMinutes(words)).toBe(3); // 2.5 rounds up
  });
});

describe("localizePortfolioPost", () => {
  const post: PortfolioPost = {
    _id: "post-1",
    _createdAt: "2026-01-01T12:00:00Z",
    title: [
      { _key: "en", value: "English title" },
      { _key: "es", value: "Título en español" },
    ],
    slug: { current: "my-post" },
    smallDescription: [{ _key: "en", value: "English excerpt" }],
    publishedAt: "2026-06-28T12:00:00Z",
    categories: [[{ _key: "en", value: "DevOps" }]],
    bodyText: Array(400).fill("word").join(" "),
  };

  it("localizes title, excerpt and category for the requested locale", () => {
    const card = localizePortfolioPost(post, "es");
    expect(card.title).toBe("Título en español");
    // es missing → falls back to en
    expect(card.excerpt).toBe("English excerpt");
    expect(card.category).toBe("DevOps");
  });

  it("builds the post href from the slug", () => {
    expect(localizePortfolioPost(post, "en").href).toBe("/blog/my-post");
  });

  it("uses publishedAt for the date and computes read time", () => {
    const card = localizePortfolioPost(post, "en");
    expect(card.date).toBe("Jun 28, 2026");
    expect(card.minutes).toBe(2);
  });

  it("falls back to _createdAt when publishedAt is missing", () => {
    const card = localizePortfolioPost(
      { ...post, publishedAt: undefined },
      "en",
    );
    expect(card.date).toBe("Jan 1, 2026");
  });

  it("handles missing fields without throwing", () => {
    const bare: PortfolioPost = {
      _id: "x",
      _createdAt: "2026-01-01T12:00:00Z",
    };
    const card = localizePortfolioPost(bare, "en");
    expect(card.title).toBe("Untitled");
    expect(card.excerpt).toBe("");
    expect(card.category).toBe("");
    expect(card.href).toBe("/blog/");
    expect(card.minutes).toBe(1);
  });
});
