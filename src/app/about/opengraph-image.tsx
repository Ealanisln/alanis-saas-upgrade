import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Acerca de Alanis - Web Developer";
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
          background: "linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)",
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
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)
            `,
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
              width: "60%",
              paddingRight: "40px",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                color: "rgba(255,255,255,0.8)",
                marginBottom: "20px",
                fontWeight: "500",
              }}
            >
              Acerca de mí
            </div>
            
            <h1
              style={{
                fontSize: "64px",
                fontWeight: "bold",
                color: "white",
                margin: "0 0 30px",
                lineHeight: 1.1,
                textShadow: "0 4px 8px rgba(0,0,0,0.3)",
              }}
            >
              Emmanuel Alanis
            </h1>
            
            <div
              style={{
                fontSize: "28px",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.4,
                marginBottom: "30px",
              }}
            >
              Desarrollador web mexicano 🇲🇽 apasionado por crear aplicaciones modernas y ayudar a otros a crecer
            </div>
            
            {/* Skills */}
            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
              }}
            >
              {["Full-Stack", "React", "Next.js", "TypeScript"].map((skill) => (
                <div
                  key={skill}
                  style={{
                    padding: "8px 16px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "20px",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  {skill}
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
              width: "40%",
            }}
          >
            <div
              style={{
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid rgba(255,255,255,0.3)",
                position: "relative",
              }}
            >
              {/* Code brackets decoration */}
              <div
                style={{
                  fontSize: "120px",
                  color: "white",
                  fontWeight: "bold",
                  opacity: 0.8,
                }}
              >
                {"{ }"}
              </div>
              
              {/* Small decorative elements */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.4)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "30px",
                  left: "30px",
                  width: "15px",
                  height: "15px",
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
          alanis.dev/about
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
} 