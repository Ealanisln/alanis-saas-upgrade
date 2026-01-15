import { ImageResponse } from "next/og";
import { createClient } from "next-sanity";

// Route segment config
export const runtime = "edge";
export const revalidate = 0; // Disable caching for debugging

// Image metadata
export const alt = "Alanis Dev Blog";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Sanity config
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Create a minimal Sanity client for Edge runtime
const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-14",
  useCdn: false,
});

// Type for internationalized field
interface I18nField {
  _key: string;
  value: string;
}

// Type for Sanity image asset
interface SanityImageAsset {
  _ref: string;
  _type: string;
}

// Type for blog post OG image data
interface OGPostData {
  title: I18nField[] | string;
  author?: string;
  mainImage?: {
    asset: SanityImageAsset;
  };
}

// Helper to build Sanity image URL (Edge-compatible)
function buildImageUrl(asset: SanityImageAsset | undefined): string | null {
  if (!asset?._ref) return null;

  // Parse the asset reference: image-{id}-{width}x{height}-{format}
  const ref = asset._ref;
  const parts = ref.split("-");

  // Handle the format: image-{id}-{width}x{height}-{format}
  // The ID is everything between "image-" and the last two parts (dimensions and format)
  if (parts.length < 4) return null;

  const format = parts[parts.length - 1];
  const dimensions = parts[parts.length - 2];
  const id = parts.slice(1, -2).join("-");

  if (!id || !dimensions || !format) return null;

  // Add auto=format for better performance and w/h for optimal OG image size
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}?w=1200&h=630&fit=crop&auto=format`;
}

// Helper to fetch image and convert to base64 data URL for Edge runtime
async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // Determine content type from response or URL
    const contentType = response.headers.get("content-type") || "image/jpeg";

    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}

// Inline helper to extract localized value (Edge-compatible)
function extractLocalizedValue(
  field: I18nField[] | string | undefined,
  locale: string,
): string {
  if (!field) return "Untitled";
  if (typeof field === "string") return field;
  if (!Array.isArray(field)) return "Untitled";

  // Try to find the value for the requested locale
  const localized = field.find((item) => item._key === locale);
  if (localized?.value) return localized.value;

  // Fallback to English
  const fallback = field.find((item) => item._key === "en");
  if (fallback?.value) return fallback.value;

  // Last resort: first available value
  return field[0]?.value || "Untitled";
}

// Image generation
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  try {
    // Await params (Next.js 15 requirement)
    const { slug, locale } = await params;

    // Fetch post data with proper GROQ query
    const query = `*[_type == "post" && slug.current == $slug][0]{
      title,
      "author": author->name,
      mainImage {
        asset
      }
    }`;

    const post = await client.fetch<OGPostData | null>(query, { slug });

    // Extract localized title (works even if post is null)
    const title = post ? extractLocalizedValue(post.title, locale) : "Blog";
    const author = post?.author || "Alanis Dev";

    // Build the Sanity image URL and fetch it as a data URL for Edge runtime
    const sanityImageUrl = buildImageUrl(post?.mainImage?.asset);
    const imageDataUrl = sanityImageUrl
      ? await fetchImageAsDataUrl(sanityImageUrl)
      : null;

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(135deg, #1E3282 0%, #2D48A8 30%, #3D5FD0 70%, #4F7AFA 100%)",
            position: "relative",
          }}
        >
          {/* Cover Image from Sanity */}
          {imageDataUrl && (
            <img
              src={imageDataUrl}
              alt=""
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.4,
              }}
            />
          )}
          {/* Background Pattern/Overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: imageDataUrl
                ? "linear-gradient(135deg, rgba(30,50,130,0.7) 0%, rgba(45,72,168,0.6) 30%, rgba(61,95,208,0.5) 70%, rgba(79,122,250,0.4) 100%)"
                : `
                radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)
              `,
            }}
          />

          {/* Content Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              width: "100%",
              height: "100%",
              padding: "60px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Logo/Brand */}
            <div
              style={{
                position: "absolute",
                top: "40px",
                right: "60px",
                display: "flex",
                alignItems: "center",
                color: "white",
                fontSize: "24px",
                fontWeight: "600",
              }}
            >
              alanis.dev
            </div>

            {/* Main Title */}
            <h1
              style={{
                fontSize: title.length > 50 ? "48px" : "64px",
                fontWeight: "bold",
                color: "white",
                marginBottom: "20px",
                lineHeight: 1.2,
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
                maxHeight: "320px",
                overflow: "hidden",
              }}
            >
              {title}
            </h1>

            {/* Author and Blog Label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "20px",
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "500",
                  }}
                >
                  Blog
                </div>
                <p
                  style={{
                    fontSize: "24px",
                    color: "rgba(255, 255, 255, 0.9)",
                    margin: 0,
                  }}
                >
                  Por: {author}
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      },
    );
  } catch (error) {
    console.error("Error generating OG image:", error);

    // In case of error, return a simple fallback
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(135deg, #1E3282 0%, #2D48A8 30%, #3D5FD0 70%, #4F7AFA 100%)",
            color: "white",
            fontSize: "48px",
            fontWeight: "bold",
            textAlign: "center",
            padding: "40px",
          }}
        >
          <div>Alanis Dev Blog</div>
          <p style={{ fontSize: "32px", marginTop: "20px" }}>
            Desarrollo web y tecnología
          </p>
        </div>
      ),
      {
        ...size,
      },
    );
  }
}
