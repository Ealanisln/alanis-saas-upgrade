import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Alanis Dev Blog";
export const size = {
  width: 1200,
  height: 630,
};

// Image generation
export default function Image() {
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
          backgroundImage: "linear-gradient(to bottom right, #1E40AF, #111827)",
          color: "white",
          textAlign: "center",
          padding: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            margin: "0 0 20px",
          }}
        >
          Alanis Dev Blog
        </h1>
        <div
          style={{
            fontSize: "36px",
            margin: "20px 0 40px",
            maxWidth: "80%",
            lineHeight: 1.4,
          }}
        >
          Desarrollo web, programación y tecnología
        </div>
        <div
          style={{
            fontSize: "24px",
            opacity: 0.8,
            marginTop: "40px",
            padding: "10px 20px",
            border: "2px solid rgba(255,255,255,0.3)",
            borderRadius: "10px",
          }}
        >
          alanis.dev/blog
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
} 