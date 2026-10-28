import { ImageResponse } from "next/og";


export const alt = "Alberta Studio — Form Follows Performance";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          color: "#f4f4f5",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(52, 211, 153, 0.15) 0%, rgba(9, 9, 11, 0) 70%)",
          }}
        />

        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 22,
                fontFamily: "monospace",
              }}
            >
              AS
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px" }}>ALBERTA STUDIO</span>
              <span style={{ fontSize: 14, color: "#a1a1aa", fontFamily: "monospace", letterSpacing: "2px" }}>
                CALGARY, AB × MT
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 9999,
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              fontFamily: "monospace",
              fontSize: 14,
              color: "#34d399",
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#34d399" }} />
            Q4 2026 / Q1 2027
          </div>
        </div>

        {/* Center Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <h1
            style={{
              fontSize: 64,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-2px",
              margin: 0,
              maxWidth: 960,
            }}
          >
            Form follows performance. Motion without frame drops.
          </h1>
          <p style={{ fontSize: 24, color: "#a1a1aa", margin: 0, maxWidth: 800, lineHeight: 1.4 }}>
            Creative engineering boutique. Next.js App Router, GSAP SplitText, Lenis physics, and sub-second LCP.
          </p>
        </div>

        {/* Footer Meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #27272a",
            paddingTop: 30,
            fontFamily: "monospace",
            fontSize: 16,
            color: "#71717a",
          }}
        >
          <span>albertastudio.dev</span>
          <span>Next.js × GSAP × Lenis × Web Vitals</span>
          <span style={{ color: "#34d399" }}>Lighthouse 100 Standards</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
