import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Pratik Nagrale - AI and full-stack engineer. Front-end AI engineering intern at FlyRank AI.";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#08090d",
          color: "#eceef5",
          position: "relative",
        }}
      >
        {/* Controlled glow, top-right. Satori only accepts single-value gradients. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 760,
            height: 440,
            backgroundImage:
              "linear-gradient(225deg, rgba(124,140,255,0.22), rgba(124,140,255,0))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 10,
            backgroundImage: "linear-gradient(180deg, #7c8cff, rgba(124,140,255,0.06))",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
          <div
            style={{
              display: "flex",
              width: 34,
              height: 34,
              borderRadius: 8,
              border: "2px solid rgba(124,140,255,0.7)",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              color: "#7c8cff",
            }}
          >
            PN
          </div>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 3, color: "#8b93a8" }}>
            MUMBAI - GITHUB: PRATIKCODER01
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, position: "relative" }}>
          <div style={{ display: "flex", fontSize: 92, letterSpacing: -3, color: "#eceef5" }}>
            Pratik Nagrale
          </div>
          <div style={{ display: "flex", fontSize: 38, color: "#a9b4ff", letterSpacing: -1 }}>
            AI &amp; Full-Stack Engineer
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#a4abbf", maxWidth: 880 }}>
            Front-end AI engineering intern at FlyRank AI. Robotics, computer vision and production
            TypeScript.
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", position: "relative" }}>
          {["Athlix", "PlateCam", "DojoNation", "C++ / CodeAlpha"].map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                padding: "10px 18px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.16)",
                fontSize: 20,
                color: "#a4abbf",
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
