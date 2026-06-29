import { ImageResponse } from "next/og";

export const alt = "Chu Nhu Duc — Solution Architect & hands-on engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded Open Graph image for link previews (Upwork chat, LinkedIn, messaging). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #12141a 0%, #1b1f24 60%, #232b35 100%)",
          padding: "80px",
          color: "#f4f4f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div style={{ width: "64px", height: "8px", borderRadius: "8px", background: "#6ea8ff" }} />
          <div style={{ fontSize: "28px", color: "#9ca3af" }}>chunhuduc.com</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <div style={{ fontSize: "76px", fontWeight: 800, lineHeight: 1.05 }}>
            Solution Architect
          </div>
          <div style={{ fontSize: "34px", color: "#9ca3af", lineHeight: 1.3 }}>
            TypeScript · Node · Enterprise web & distributed systems
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "30px", fontWeight: 700 }}>Chu Nhu Duc</div>
          <div style={{ fontSize: "26px", fontWeight: 700, color: "#6ea8ff" }}>
            Available for freelance
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
