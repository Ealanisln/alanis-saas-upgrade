import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { createClient, type SanityClient, type QueryParams } from "next-sanity";
import {
  apiVersion,
  dataset,
  projectId,
  useCdn,
  isSanityConfigured,
} from "../env";

// Create client only if properly configured
const createSanityClient = (): SanityClient => {
  return createClient({
    apiVersion,
    dataset,
    projectId,
    useCdn,
  });
};

// Export client instance
export const client = createSanityClient();

// Safe fetch wrapper that returns empty array if Sanity is not configured
export async function safeFetch<T>(
  query: string,
  params?: QueryParams,
): Promise<T[]> {
  if (!isSanityConfigured()) {
    console.warn("Sanity is not configured. Returning empty results.");
    return [] as T[];
  }
  try {
    if (params) {
      return await client.fetch<T[]>(query, params);
    }
    return await client.fetch<T[]>(query);
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return [] as T[];
  }
}

// Safe fetch wrapper for single-item queries (returns null if not found or not configured)
export async function safeFetchSingle<T>(
  query: string,
  params?: QueryParams,
): Promise<T | null> {
  if (!isSanityConfigured()) {
    console.warn("Sanity is not configured. Returning null.");
    return null;
  }
  try {
    if (params) {
      return await client.fetch<T | null>(query, params);
    }
    return await client.fetch<T | null>(query);
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return null;
  }
}

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
