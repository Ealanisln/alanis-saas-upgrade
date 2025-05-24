import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Blog - Alanis Dev";
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
          background: "linear-gradient(135deg, #1E3282 0%, #2D48A8 30%, #3D5FD0 70%, #4F7AFA 100%)",
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
              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)
            `,
          }}
        />
        
        {/* Decorative Elements */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: "60px",
            width: "70px",
            height: "70px",
            border: "3px solid rgba(255,255,255,0.2)",
            borderRadius: "15px",
            transform: "rotate(20deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "120px",
            right: "80px",
            width: "50px",
            height: "50px",
            border: "2px solid rgba(255,255,255,0.2)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "100px",
            left: "100px",
            width: "40px",
            height: "40px",
            border: "2px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            transform: "rotate(-15deg)",
          }}
        />
        
        {/* Main Content */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            padding: "60px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Left Side - Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "65%",
              paddingRight: "40px",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                color: "rgba(255,255,255,0.8)",
                marginBottom: "20px",
                fontWeight: "500",
              }}
            >
              Blog
            </div>
            
            <h1
              style={{
                fontSize: "72px",
                fontWeight: "bold",
                color: "white",
                margin: "0 0 30px",
                lineHeight: 1.1,
                textShadow: "0 4px 8px rgba(0,0,0,0.3)",
              }}
            >
              Desarrollo Web
            </h1>
            
            <div
              style={{
                fontSize: "32px",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.4,
                marginBottom: "30px",
              }}
            >
              Consejos, tutoriales y mejores prácticas para desarrolladores
            </div>
            
            {/* Topics */}
            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
              }}
            >
              {["Next.js", "React", "TypeScript", "Tutoriales"].map((topic) => (
                <div
                  key={topic}
                  style={{
                    padding: "8px 16px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "20px",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  {topic}
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Side - Visual Element */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "35%",
            }}
          >
            <div
              style={{
                width: "250px",
                height: "250px",
                borderRadius: "30px",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid rgba(255,255,255,0.3)",
                position: "relative",
              }}
            >
              {/* Blog icon */}
              <div
                style={{
                  fontSize: "100px",
                  color: "white",
                  opacity: 0.9,
                }}
              >
                📝
              </div>
              
              {/* Floating elements */}
              <div
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.4)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-15px",
                  left: "-15px",
                  width: "25px",
                  height: "25px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.3)",
                }}
              />
            </div>
          </div>
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
          alanis.dev/blog
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
} 