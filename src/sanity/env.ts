export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-14";

// Use fallback values for CI builds - will fail gracefully at runtime if actually used
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

export const useCdn = false;

// Helper to check if Sanity is properly configured
export function isSanityConfigured(): boolean {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  // Check that values exist and are not CI placeholder values
  return Boolean(
    projectId &&
      dataset &&
      projectId !== "ci-placeholder" &&
      !projectId.includes("placeholder"),
  );
}
