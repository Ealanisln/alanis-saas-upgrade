import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Portfolio - Proyectos de Alanis Dev";
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
              radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)
            `,
          }}
        />
        
        {/* Decorative Code Elements */}
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "50px",
            width: "60px",
            height: "60px",
            border: "3px solid rgba(255,255,255,0.2)",
            borderRadius: "12px",
            transform: "rotate(15deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "150px",
            right: "80px",
            width: "40px",
            height: "40px",
            border: "2px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            transform: "rotate(-20deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "100px",
            left: "100px",
            width: "50px",
            height: "50px",
            border: "2px solid rgba(255,255,255,0.2)",
            borderRadius: "50%",
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
          {/* Portfolio Icon */}
          <div
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "25px",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "40px",
              border: "2px solid rgba(255,255,255,0.2)",
              position: "relative",
            }}
          >
            {/* Portfolio grid icon */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", gap: "8px" }}>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    background: "white",
                    borderRadius: "4px",
                  }}
                />
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: "4px",
                  }}
                />
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    background: "white",
                    borderRadius: "4px",
                  }}
                />
              </div>
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
            Portfolio
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
            Proyectos destacados con tecnologías modernas
          </div>
          
          {/* Project Types */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            {["Web Apps", "E-commerce", "SaaS", "APIs"].map((type) => (
              <div
                key={type}
                style={{
                  padding: "10px 20px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "25px",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "500",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                {type}
              </div>
            ))}
          </div>
          
          {/* Call to Action */}
          <div
            style={{
              marginTop: "40px",
              fontSize: "24px",
              color: "rgba(255,255,255,0.8)",
              fontWeight: "500",
            }}
          >
            Explora mis proyectos más recientes
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
          alanis.dev/portfolio
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
} 