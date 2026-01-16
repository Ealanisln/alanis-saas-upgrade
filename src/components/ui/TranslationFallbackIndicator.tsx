"use client";

import * as React from "react";
import { cn } from "@/lib/utils/utils";
import { localeConfig } from "@/config/i18n";
import type { LocalizationMetadata } from "@/sanity/lib/i18n";

export interface TranslationFallbackIndicatorProps {
  /** Metadata about the fallback translation */
  metadata?: LocalizationMetadata;
  /** The default/fallback locale that content is displayed in */
  fallbackLocale?: string;
  /** Whether to show the indicator (useful for conditional rendering) */
  show?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Size variant */
  size?: "sm" | "md";
  /** Custom label override */
  label?: string;
}

/**
 * An indicator component that shows when content is displayed in a fallback language.
 * Used to inform users that the content they're viewing hasn't been translated
 * into their preferred language yet.
 *
 * @example
 * ```tsx
 * <TranslationFallbackIndicator
 *   metadata={post._localizationMetadata}
 *   fallbackLocale="en"
 * />
 * ```
 */
export function TranslationFallbackIndicator({
  metadata,
  fallbackLocale = "en",
  show,
  className,
  size = "sm",
  label,
}: TranslationFallbackIndicatorProps) {
  // Don't render if no metadata or no fallback was used
  if (!show && (!metadata || !metadata.usedFallback)) {
    return null;
  }

  const localeInfo = localeConfig[fallbackLocale as keyof typeof localeConfig];
  const localeName = localeInfo?.name || fallbackLocale.toUpperCase();

  const displayLabel = label || `Shown in ${localeName}`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 text-amber-700",
        "dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
        size === "sm" && "px-1.5 py-0.5 text-xs",
        size === "md" && "px-2 py-1 text-sm",
        className,
      )}
      role="status"
      aria-label={`Content displayed in ${localeName} as translation is not available`}
    >
      <svg
        className={cn(
          "flex-shrink-0",
          size === "sm" && "h-3 w-3",
          size === "md" && "h-4 w-4",
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
      <span className="font-medium">{displayLabel}</span>
    </span>
  );
}

/**
 * Hook to check if content is using a fallback translation
 * @param metadata - The localization metadata from a localized document
 * @returns Object with helper properties for rendering fallback state
 */
export function useTranslationFallback(metadata?: LocalizationMetadata) {
  return {
    usedFallback: metadata?.usedFallback ?? false,
    fallbackFields: metadata?.fallbackFields ?? [],
    requestedLocale: metadata?.requestedLocale,
    hasMissingTranslation: (metadata?.fallbackFields?.length ?? 0) > 0,
  };
}

export default TranslationFallbackIndicator;
