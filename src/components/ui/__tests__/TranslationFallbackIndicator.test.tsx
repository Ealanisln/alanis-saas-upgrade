import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  TranslationFallbackIndicator,
  useTranslationFallback,
} from "../TranslationFallbackIndicator";
import type { LocalizationMetadata } from "@/sanity/lib/i18n";
import { renderHook } from "@testing-library/react";

describe("TranslationFallbackIndicator", () => {
  const mockMetadata: LocalizationMetadata = {
    usedFallback: true,
    fallbackFields: ["title", "description"],
    requestedLocale: "es",
  };

  it("should not render when metadata is undefined", () => {
    const { container } = render(<TranslationFallbackIndicator />);
    expect(container.firstChild).toBeNull();
  });

  it("should not render when usedFallback is false", () => {
    const metadata: LocalizationMetadata = {
      usedFallback: false,
      fallbackFields: [],
      requestedLocale: "es",
    };
    const { container } = render(
      <TranslationFallbackIndicator metadata={metadata} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render when usedFallback is true", () => {
    render(<TranslationFallbackIndicator metadata={mockMetadata} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Shown in English")).toBeInTheDocument();
  });

  it("should render when show prop is true even without metadata", () => {
    render(<TranslationFallbackIndicator show={true} fallbackLocale="en" />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should display custom label when provided", () => {
    render(
      <TranslationFallbackIndicator
        metadata={mockMetadata}
        label="Content not translated"
      />,
    );

    expect(screen.getByText("Content not translated")).toBeInTheDocument();
  });

  it("should use correct fallback locale name", () => {
    render(
      <TranslationFallbackIndicator
        metadata={mockMetadata}
        fallbackLocale="es"
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Shown in Español");
  });

  it("should apply sm size classes by default", () => {
    render(<TranslationFallbackIndicator metadata={mockMetadata} />);

    const indicator = screen.getByRole("status");
    expect(indicator).toHaveClass("text-xs");
    expect(indicator).toHaveClass("px-1.5");
    expect(indicator).toHaveClass("py-0.5");
  });

  it("should apply md size classes when size is md", () => {
    render(<TranslationFallbackIndicator metadata={mockMetadata} size="md" />);

    const indicator = screen.getByRole("status");
    expect(indicator).toHaveClass("text-sm");
    expect(indicator).toHaveClass("px-2");
    expect(indicator).toHaveClass("py-1");
  });

  it("should apply custom className", () => {
    render(
      <TranslationFallbackIndicator
        metadata={mockMetadata}
        className="custom-class"
      />,
    );

    expect(screen.getByRole("status")).toHaveClass("custom-class");
  });

  it("should have accessible aria-label", () => {
    render(<TranslationFallbackIndicator metadata={mockMetadata} />);

    const indicator = screen.getByRole("status");
    expect(indicator).toHaveAttribute(
      "aria-label",
      "Content displayed in English as translation is not available",
    );
  });

  it("should render translation icon", () => {
    render(<TranslationFallbackIndicator metadata={mockMetadata} />);

    const svg = screen.getByRole("status").querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});

describe("useTranslationFallback", () => {
  it("should return default values when metadata is undefined", () => {
    const { result } = renderHook(() => useTranslationFallback(undefined));

    expect(result.current.usedFallback).toBe(false);
    expect(result.current.fallbackFields).toEqual([]);
    expect(result.current.requestedLocale).toBeUndefined();
    expect(result.current.hasMissingTranslation).toBe(false);
  });

  it("should return metadata values when provided", () => {
    const metadata: LocalizationMetadata = {
      usedFallback: true,
      fallbackFields: ["title", "body"],
      requestedLocale: "es",
    };

    const { result } = renderHook(() => useTranslationFallback(metadata));

    expect(result.current.usedFallback).toBe(true);
    expect(result.current.fallbackFields).toEqual(["title", "body"]);
    expect(result.current.requestedLocale).toBe("es");
    expect(result.current.hasMissingTranslation).toBe(true);
  });

  it("should report no missing translation when fallbackFields is empty", () => {
    const metadata: LocalizationMetadata = {
      usedFallback: false,
      fallbackFields: [],
      requestedLocale: "es",
    };

    const { result } = renderHook(() => useTranslationFallback(metadata));

    expect(result.current.hasMissingTranslation).toBe(false);
  });
});
