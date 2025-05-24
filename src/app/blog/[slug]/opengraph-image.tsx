import { client, urlFor } from "@/sanity/lib/client";
import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";
export const revalidate = 30;

// Image metadata
export const alt = "Alanis Dev Blog";
export const size = {
  width: 1200,
  height: 630,
};

// Image generation
export default async function Image({ params }: { params: { slug: string } }) {
  try {
    // Fetch post data
    const post = await client.fetch(
      `*[_type == "post" && slug.current == '${params.slug}'][0]{
        title,
        mainImage,
        "author": author->name
      }`
    );

    // Use post image if available, otherwise use a default background
    const imageUrl = post.mainImage 
      ? urlFor(post.mainImage).width(1200).height(630).url() 
      : "https://alanis.dev/images/blog-og-image.jpg";

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          {/* Overlay to ensure text readability */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "50px",
            }}
          >
            <h1
              style={{
                fontSize: "64px",
                fontWeight: "bold",
                color: "white",
                marginBottom: "20px",
                lineHeight: 1.2,
              }}
            >
              {post.title}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  fontSize: "32px",
                  color: "white",
                  opacity: 0.9,
                }}
              >
                Por: {post.author || "Alanis Dev"}
              </p>
              <p
                style={{
                  fontSize: "32px",
                  color: "white",
                  opacity: 0.8,
                }}
              >
                alanis.dev
              </p>
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
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
            backgroundColor: "#111827",
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
      }
    );
  }
} 