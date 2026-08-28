import { ImageResponse } from "next/og";
import { journalPosts } from "@/lib/data";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OgImage({ params }: Props) {
  const { slug } = await params;
  const post = journalPosts.find((p) => p.slug === slug);

  const title = post?.title ?? "Journal";
  const category = post?.category ?? "Writing";
  const date = post?.date ?? "";

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

      {/* Eyebrow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#C9943A",
          }}
        />
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "14px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#C9943A",
          }}
        >
          {category} · {date}
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "clamp(40px, 5vw, 72px)",
          fontWeight: 300,
          color: "#EDE8DF",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          marginBottom: "40px",
          maxWidth: "900px",
        }}
      >
        {title}
        <span style={{ color: "#C9943A", fontStyle: "italic" }}>.</span>
      </div>

      {/* Byline */}
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
          Amarjeet Mishra · amarjeetmishra.com
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "13px",
            letterSpacing: "0.12em",
            color: "#7A7060",
          }}
        >
          JOURNAL
        </span>
      </div>
    </div>,
    { ...size },
  );
}
