import { ImageResponse } from "next/og";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { safeFetchSingle, urlFor } from "@/sanity/lib/client";

// Route segment config
export const runtime = "edge";
export const revalidate = 30;

// Image metadata
export const alt = "Alanis Dev Blog";
export const size = {
  width: 1200,
  height: 630,
};

// Type for blog post OG image data
interface OGPostData {
  title: string;
  mainImage?: SanityImageSource;
  author?: string;
  smallDescription?: string;
}

// Image generation
export default async function Image({ params }: { params: { slug: string } }) {
  try {
    // Fetch post data with proper GROQ query
    const query = `*[_type == "post" && slug.current == $slug][0]{
      title,
      mainImage,
      "author": author->name,
      smallDescription
    }`;

    const post = await safeFetchSingle<OGPostData>(query, {
      slug: params.slug,
    });

    // If no post found, return fallback
    if (!post) {
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
              backgroundColor: "#1E3282",
              color: "white",
              fontSize: "48px",
              fontWeight: "bold",
              textAlign: "center",
              padding: "40px",
            }}
          >
            <h1>Alanis Dev Blog</h1>
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

    // Use post image if available, otherwise use a default background
    const imageUrl = post.mainImage
      ? urlFor(post.mainImage).width(1200).height(630).url()
      : null;

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            background: imageUrl
              ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${imageUrl})`
              : "linear-gradient(135deg, #1E3282 0%, #2D48A8 30%, #3D5FD0 70%, #4F7AFA 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          {/* Background Pattern for non-image backgrounds */}
          {!imageUrl && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: `
                  radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)
                `,
              }}
            />
          )}

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
                fontSize: post.title.length > 50 ? "48px" : "64px",
                fontWeight: "bold",
                color: "white",
                marginBottom: "20px",
                lineHeight: 1.2,
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
                maxHeight: "320px",
                overflow: "hidden",
              }}
            >
              {post.title}
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
                  📝 Blog
                </div>
                <p
                  style={{
                    fontSize: "24px",
                    color: "rgba(255, 255, 255, 0.9)",
                    margin: 0,
                  }}
                >
                  Por: {post.author || "Alanis Dev"}
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
    if (process.env.NODE_ENV === "development") {
      console.error("Error generating OG image:", error);
    }

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
            position: "relative",
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: `
                radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)
              `,
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <h1>Alanis Dev Blog</h1>
            <p style={{ fontSize: "32px", marginTop: "20px" }}>
              Desarrollo web y tecnología
            </p>
            <p style={{ fontSize: "24px", marginTop: "20px", opacity: 0.8 }}>
              alanis.dev
            </p>
          </div>
        </div>
      ),
      {
        ...size,
      },
    );
  }
}
