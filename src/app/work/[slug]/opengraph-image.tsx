import { ImageResponse } from "next/og";
import { allPortfolioItems } from "@/lib/portfolio-data";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OgImage({ params }: Props) {
  const { slug } = await params;
  const item = allPortfolioItems.find((p) => p.slug === slug);

  const title = item?.title ?? "Case Study";
  const client = item?.client ?? "";
  const category = item?.category ?? "";

  return new ImageResponse(
    <div
      style={{
        background: "#0B0908",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "80px",
        fontFamily: "Georgia, serif",
        position: "relative",
      }}
    >
      {/* Gold accent line */}
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

      {/* Screenplay slug */}
      <div
        style={{
          fontFamily: "monospace",
          fontSize: "13px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#C9943A",
          marginBottom: "24px",
        }}
      >
        INT. CASE STUDY — {category.toUpperCase()}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "72px",
          fontWeight: 300,
          color: "#EDE8DF",
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          marginBottom: "32px",
          maxWidth: "900px",
        }}
      >
        {title}
        <span style={{ color: "#C9943A", fontStyle: "italic" }}>.</span>
      </div>

      {/* Client + byline */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "13px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#7A7060",
          }}
        >
          {client ? `Client: ${client} · ` : ""}Amarjeet Mishra
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "13px",
            letterSpacing: "0.12em",
            color: "#7A7060",
          }}
        >
          amarjeetmishra.com/work
        </span>
      </div>
    </div>,
    { ...size },
  );
}
