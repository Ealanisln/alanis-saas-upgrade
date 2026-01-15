import { describe, it, expect } from "vitest";
import { postsQuery, postQuery, postPathsQuery } from "../queries";

describe("Sanity GROQ Queries", () => {
  describe("postsQuery", () => {
    it("queries post type documents", () => {
      expect(postsQuery).toContain('_type == "post"');
    });

    it("filters for posts with defined slug", () => {
      expect(postsQuery).toContain("defined(slug.current)");
    });

    it("selects required fields", () => {
      expect(postsQuery).toContain("_id");
      expect(postsQuery).toContain("title");
      expect(postsQuery).toContain("slug");
      expect(postsQuery).toContain("mainImage");
    });
  });

  describe("postQuery", () => {
    it("queries post type documents", () => {
      expect(postQuery).toContain('_type == "post"');
    });

    it("filters by slug parameter", () => {
      expect(postQuery).toContain("slug.current == $slug");
    });

    it("returns first matching document", () => {
      expect(postQuery).toContain("[0]");
    });

    it("selects required fields for single post", () => {
      expect(postQuery).toContain("title");
      expect(postQuery).toContain("mainImage");
      expect(postQuery).toContain("body");
    });
  });

  describe("postPathsQuery", () => {
    it("queries post type documents", () => {
      expect(postPathsQuery).toContain('_type == "post"');
    });

    it("filters for posts with defined slug", () => {
      expect(postPathsQuery).toContain("defined(slug.current)");
    });

    it("returns params object with slug for static paths", () => {
      expect(postPathsQuery).toContain('"params"');
      expect(postPathsQuery).toContain('"slug"');
      expect(postPathsQuery).toContain("slug.current");
    });
  });

  describe("Query syntax validation", () => {
    it("all queries start with GROQ selector", () => {
      expect(postsQuery).toMatch(/^\*\[/);
      expect(postQuery).toMatch(/^\*\[/);
      expect(postPathsQuery).toMatch(/^\*\[/);
    });

    it("queries have balanced brackets", () => {
      const countBrackets = (str: string, open: string, close: string) => {
        const openCount = (str.match(new RegExp(`\\${open}`, "g")) || [])
          .length;
        const closeCount = (str.match(new RegExp(`\\${close}`, "g")) || [])
          .length;
        return openCount === closeCount;
      };

      expect(countBrackets(postsQuery, "[", "]")).toBe(true);
      expect(countBrackets(postsQuery, "{", "}")).toBe(true);
      expect(countBrackets(postQuery, "[", "]")).toBe(true);
      expect(countBrackets(postQuery, "{", "}")).toBe(true);
      expect(countBrackets(postPathsQuery, "[", "]")).toBe(true);
      expect(countBrackets(postPathsQuery, "{", "}")).toBe(true);
    });
  });
});
