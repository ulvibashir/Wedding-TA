import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e5fa8, #1a7070, #1e7a4a)",
        borderRadius: "50%",
        fontSize: 20,
        color: "white",
      }}
    >
      ♥
    </div>,
    { ...size }
  );
}
