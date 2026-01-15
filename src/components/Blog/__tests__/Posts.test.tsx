import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Posts from "../Posts";
import { SimpleBlogCard } from "@/types/simple-blog-card";

// Mock next/font/google
vi.mock("next/font/google", () => ({
  Inter: () => ({
    className: "mock-inter",
    style: { fontFamily: "Inter" },
  }),
}));

// Mock the fonts config
vi.mock("@/config/fonts", () => ({
  inter: { className: "mock-inter" },
  titleFont: { className: "mock-title-font" },
}));

// Mock next-intl/navigation (before it's imported by other modules)
vi.mock("next-intl/navigation", () => ({
  createNavigation: () => ({
    Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
      <a href={href}>{children}</a>
    ),
    redirect: vi.fn(),
    usePathname: () => "/",
    useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  }),
}));

// Mock @/lib/navigation
vi.mock("@/lib/navigation", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  redirect: vi.fn(),
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

// Mock the Sanity client urlFor function
vi.mock("@/sanity/lib/client", () => ({
  urlFor: () => ({
    url: () => "/mock-image.jpg",
  }),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

// Factory function to create mock post data
function createMockPost(
  overrides: Partial<SimpleBlogCard> = {},
): SimpleBlogCard {
  return {
    _id: `post-${Math.random().toString(36).substring(7)}`,
    _updatedAt: new Date().toISOString(),
    title: "Test Post Title",
    slug: { current: "test-post-slug" },
    mainImage: null,
    smallDescription: "Test description",
    publishedAt: new Date().toISOString(),
    author: { _id: "author-1", name: "Test Author" },
    ...overrides,
  };
}

describe("Posts", () => {
  describe("rendering", () => {
    it("renders posts with valid slugs", () => {
      const posts = [
        createMockPost({ title: "Post 1", slug: { current: "post-1" } }),
        createMockPost({ title: "Post 2", slug: { current: "post-2" } }),
      ];

      render(<Posts data={posts} locale="en" />);

      expect(screen.getByText("Post 1")).toBeInTheDocument();
      expect(screen.getByText("Post 2")).toBeInTheDocument();
    });

    it("filters out posts without valid slugs", () => {
      const posts = [
        createMockPost({
          title: "Post With Slug",
          slug: { current: "valid-slug" },
        }),
        createMockPost({ title: "Post Without Slug", slug: undefined }),
        createMockPost({
          title: "Post With Empty Slug",
          slug: { current: "" },
        }),
      ];

      render(<Posts data={posts} locale="en" />);

      expect(screen.getByText("Post With Slug")).toBeInTheDocument();
      expect(screen.queryByText("Post Without Slug")).not.toBeInTheDocument();
      expect(
        screen.queryByText("Post With Empty Slug"),
      ).not.toBeInTheDocument();
    });

    it("renders empty state when no posts have valid slugs", () => {
      const posts = [
        createMockPost({ title: "Post Without Slug", slug: undefined }),
      ];

      const { container } = render(<Posts data={posts} locale="en" />);

      // Grid should be empty
      const grid = container.querySelector(".grid");
      expect(grid?.children.length).toBe(0);
    });
  });

  describe("author handling", () => {
    it("displays author name when author exists", () => {
      const posts = [
        createMockPost({
          title: "Post With Author",
          slug: { current: "post-with-author" },
          author: { _id: "author-1", name: "John Doe" },
        }),
      ];

      render(<Posts data={posts} locale="en" />);

      expect(screen.getByText("Por John Doe")).toBeInTheDocument();
    });

    it("does not display author section when author is null", () => {
      const posts = [
        createMockPost({
          title: "Post Without Author",
          slug: { current: "post-without-author" },
          author: null as unknown as { _id: string; name: string },
        }),
      ];

      render(<Posts data={posts} locale="en" />);

      expect(screen.getByText("Post Without Author")).toBeInTheDocument();
      expect(screen.queryByText(/^Por /)).not.toBeInTheDocument();
    });

    it("does not display author section when author name is empty", () => {
      const posts = [
        createMockPost({
          title: "Post With Empty Author",
          slug: { current: "post-empty-author" },
          author: { _id: "author-1", name: "" },
        }),
      ];

      render(<Posts data={posts} locale="en" />);

      expect(screen.getByText("Post With Empty Author")).toBeInTheDocument();
      expect(screen.queryByText(/^Por /)).not.toBeInTheDocument();
    });

    it("does not display bullet separator when author is missing", () => {
      const posts = [
        createMockPost({
          title: "Post Without Author",
          slug: { current: "post-no-author" },
          author: null as unknown as { _id: string; name: string },
        }),
      ];

      render(<Posts data={posts} locale="en" />);

      // The bullet separator should not appear without an author
      const postCard = screen.getByText("Post Without Author").closest("a");
      expect(postCard?.textContent).not.toContain("•");
    });

    it("displays bullet separator when author exists", () => {
      const posts = [
        createMockPost({
          title: "Post With Author",
          slug: { current: "post-author" },
          author: { _id: "author-1", name: "Jane Doe" },
        }),
      ];

      render(<Posts data={posts} locale="en" />);

      const postCard = screen.getByText("Post With Author").closest("a");
      expect(postCard?.textContent).toContain("•");
      expect(postCard?.textContent).toContain("Por Jane Doe");
    });
  });

  describe("sorting", () => {
    it("sorts posts by _updatedAt in descending order", () => {
      const oldDate = "2024-01-01T00:00:00.000Z";
      const newDate = "2024-06-01T00:00:00.000Z";

      const posts = [
        createMockPost({
          title: "Old Post",
          slug: { current: "old-post" },
          _updatedAt: oldDate,
        }),
        createMockPost({
          title: "New Post",
          slug: { current: "new-post" },
          _updatedAt: newDate,
        }),
      ];

      render(<Posts data={posts} locale="en" />);

      const postTitles = screen.getAllByRole("heading", { level: 3 });
      expect(postTitles[0]).toHaveTextContent("New Post");
      expect(postTitles[1]).toHaveTextContent("Old Post");
    });
  });

  describe("links", () => {
    it("generates correct locale-prefixed links", () => {
      const posts = [
        createMockPost({
          title: "Test Post",
          slug: { current: "test-slug" },
        }),
      ];

      render(<Posts data={posts} locale="en" />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/en/blog/test-slug");
    });

    it("generates correct Spanish locale links", () => {
      const posts = [
        createMockPost({
          title: "Test Post",
          slug: { current: "test-slug" },
        }),
      ];

      render(<Posts data={posts} locale="es" />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/es/blog/test-slug");
    });
  });

  describe("post content", () => {
    it("displays post title", () => {
      const posts = [
        createMockPost({
          title: "My Amazing Blog Post",
          slug: { current: "amazing-post" },
        }),
      ];

      render(<Posts data={posts} locale="en" />);

      expect(screen.getByText("My Amazing Blog Post")).toBeInTheDocument();
    });

    it("displays post description", () => {
      const posts = [
        createMockPost({
          title: "Test Post",
          slug: { current: "test-post" },
          smallDescription: "This is a great article about testing.",
        }),
      ];

      render(<Posts data={posts} locale="en" />);

      expect(
        screen.getByText("This is a great article about testing."),
      ).toBeInTheDocument();
    });

    it("displays formatted date", () => {
      const posts = [
        createMockPost({
          title: "Test Post",
          slug: { current: "test-post" },
          _updatedAt: "2024-06-15T12:00:00.000Z",
        }),
      ];

      render(<Posts data={posts} locale="en" />);

      // The date is formatted in es-ES locale in the component
      expect(screen.getByText(/15.*jun.*2024/i)).toBeInTheDocument();
    });
  });

  describe("images", () => {
    it("renders post image when mainImage exists", () => {
      const posts = [
        createMockPost({
          title: "Post With Image",
          slug: { current: "post-with-image" },
          mainImage: { asset: { _ref: "image-123" } },
        }),
      ];

      render(<Posts data={posts} locale="en" />);

      const image = screen.getByAltText("Post With Image");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "/mock-image.jpg");
    });

    it("renders placeholder when mainImage is null", () => {
      const posts = [
        createMockPost({
          title: "Post Without Image",
          slug: { current: "post-no-image" },
          mainImage: null,
        }),
      ];

      render(<Posts data={posts} locale="en" />);

      const image = screen.getByAltText("Post Without Image");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "/images/blog/placeholder.jpg");
    });
  });
});
