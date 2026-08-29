import { ImageResponse } from "next/og";
import { brand } from "@/lib/data";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function RootOgImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#0B0908",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        fontFamily: "Georgia, serif",
        position: "relative",
      }}
    >
      {/* Gold top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "#C9943A",
        }}
      />

      {/* Header / Eyebrow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#C9943A",
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "14px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#C9943A",
            }}
          >
            PORTFOLIO &amp; CINEMATIC DIRECTORY
          </span>
        </div>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "13px",
            letterSpacing: "0.14em",
            color: "#7A7060",
          }}
        >
          {brand.location.toUpperCase()}
        </span>
      </div>

      {/* Main title block */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          maxWidth: "1000px",
        }}
      >
        <div
          style={{
            fontSize: "84px",
            fontWeight: 300,
            color: "#EDE8DF",
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
          }}
        >
          Amarjeet Mishra
          <span style={{ color: "#C9943A", fontStyle: "italic" }}>.</span>
        </div>
        <div
          style={{
            fontSize: "30px",
            fontWeight: 300,
            color: "#B8B0A0",
            lineHeight: 1.3,
            maxWidth: "850px",
          }}
        >
          Filmmaker, video editor &amp; educator. Brand films, high-impact reels &amp; visual
          stories.
        </div>
      </div>

      {/* Footer / Meta bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(237, 232, 223, 0.12)",
          paddingTop: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "28px",
            fontFamily: "monospace",
            fontSize: "13px",
            letterSpacing: "0.14em",
            color: "#7A7060",
            textTransform: "uppercase",
          }}
        >
          <span>Commercial</span>
          <span>·</span>
          <span>Reels</span>
          <span>·</span>
          <span>Podcasts</span>
          <span>·</span>
          <span>Education</span>
        </div>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "14px",
            letterSpacing: "0.14em",
            color: "#C9943A",
          }}
        >
          amarjeetmishra.com
        </span>
      </div>
    </div>,
    { ...size },
  );
}
