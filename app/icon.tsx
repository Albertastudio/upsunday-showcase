import { ImageResponse } from "next/og";


export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 16,
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f4f4f5",
          fontWeight: 800,
          fontFamily: "monospace",
          borderRadius: 8,
          border: "1px solid #27272a",
          position: "relative",
        }}
      >
        <span style={{ letterSpacing: "-1px" }}>AS</span>
        <div
          style={{
            position: "absolute",
            top: 3,
            right: 3,
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#34d399",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
