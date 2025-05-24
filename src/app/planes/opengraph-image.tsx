import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Planes y Precios - Alanis Dev";
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
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)
            `,
          }}
        />
        
        {/* Decorative Price Tags */}
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "80px",
            width: "60px",
            height: "40px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "8px",
            transform: "rotate(15deg)",
            border: "2px solid rgba(255,255,255,0.3)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "150px",
            right: "120px",
            width: "50px",
            height: "35px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "6px",
            transform: "rotate(-20deg)",
            border: "2px solid rgba(255,255,255,0.3)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "120px",
            left: "120px",
            width: "45px",
            height: "30px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "6px",
            transform: "rotate(10deg)",
            border: "2px solid rgba(255,255,255,0.3)",
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
                fontSize: "28px",
                color: "rgba(255,255,255,0.8)",
                marginBottom: "20px",
                fontWeight: "500",
              }}
            >
              Planes y Precios
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
              Encuentra el plan perfecto
            </h1>
            
            <div
              style={{
                fontSize: "28px",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.4,
                marginBottom: "30px",
              }}
            >
              Soluciones web diseñadas para satisfacer todas tus necesidades de desarrollo
            </div>
            
            {/* Plan Features */}
            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
              }}
            >
              {["Básico", "Profesional", "Premium", "Personalizado"].map((plan) => (
                <div
                  key={plan}
                  style={{
                    padding: "8px 16px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "20px",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  {plan}
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
                width: "280px",
                height: "280px",
                borderRadius: "25px",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid rgba(255,255,255,0.3)",
                position: "relative",
              }}
            >
              {/* Price symbol */}
              <div
                style={{
                  fontSize: "80px",
                  color: "white",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                $
              </div>
              
              {/* Pricing cards stack */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "50px",
                    background: "rgba(255,255,255,0.3)",
                    borderRadius: "8px",
                  }}
                />
                <div
                  style={{
                    width: "40px",
                    height: "50px",
                    background: "rgba(255,255,255,0.4)",
                    borderRadius: "8px",
                  }}
                />
                <div
                  style={{
                    width: "40px",
                    height: "50px",
                    background: "rgba(255,255,255,0.3)",
                    borderRadius: "8px",
                  }}
                />
              </div>
              
              {/* Floating elements */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  width: "25px",
                  height: "25px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.4)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "25px",
                  left: "25px",
                  width: "20px",
                  height: "20px",
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
          alanis.dev/planes
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
} 