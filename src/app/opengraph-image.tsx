import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Alanis - Web Developer";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #60A5FA 100%)",
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
              radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(255,255,255,0.05) 0%, transparent 50%)
            `,
          }}
        />
        
        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding: "60px",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Logo/Icon */}
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "30px",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "40px",
              border: "2px solid rgba(255,255,255,0.2)",
            }}
          >
            <div
              style={{
                fontSize: "60px",
                color: "white",
                fontWeight: "bold",
              }}
            >
              A
            </div>
          </div>
          
          {/* Main Title */}
          <h1
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "white",
              margin: "0 0 20px",
              textShadow: "0 4px 8px rgba(0,0,0,0.3)",
            }}
          >
            Alanis Dev
          </h1>
          
          {/* Subtitle */}
          <div
            style={{
              fontSize: "32px",
              color: "rgba(255,255,255,0.9)",
              margin: "0 0 30px",
              maxWidth: "800px",
              lineHeight: 1.3,
            }}
          >
            Desarrollador Full-Stack especializado en aplicaciones web modernas
          </div>
          
          {/* Tech Stack */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            {["Next.js", "React", "TypeScript", "Node.js"].map((tech) => (
              <div
                key={tech}
                style={{
                  padding: "8px 16px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "20px",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "500",
                }}
              >
                {tech}
              </div>
            ))}
          </div>
          
          {/* Website URL */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              right: "60px",
              fontSize: "24px",
              color: "rgba(255,255,255,0.8)",
              fontWeight: "500",
            }}
          >
            alanis.dev
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
} 