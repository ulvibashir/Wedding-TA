import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #eef5f0 0%, #f7f9f8 100%)",
        gap: 0,
      }}
    >
      <div style={{ fontSize: 72, color: "#1a7070", marginBottom: 24, lineHeight: 1 }}>
        ♥
      </div>
      <div
        style={{
          fontSize: 80,
          fontWeight: 300,
          color: "#0f2a20",
          letterSpacing: 6,
          fontFamily: "Georgia, serif",
          lineHeight: 1,
          marginBottom: 20,
        }}
      >
        Taleh &amp; Alaviyya
      </div>
      <div
        style={{
          fontSize: 26,
          color: "#1a7070",
          letterSpacing: 10,
          textTransform: "uppercase",
          fontFamily: "Georgia, serif",
          fontWeight: 300,
        }}
      >
        13 June 2026 · Mala Praga, Baku
      </div>
    </div>,
    { ...size }
  );
}
