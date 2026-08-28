import { type NextRequest, NextResponse } from "next/server";

// Proxy for Pipe public API reads — injects Pipe key server-side so client never sees it.
// Supports GET only (public reads). Example: /api/pipe/videos?status=ready
export async function GET(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path } = await params;
  const pipeUrl = process.env.PIPE_API_URL?.replace(/\/$/, "");
  const pipeKey = process.env.PIPE_PUBLIC_API_KEY;
  if (!pipeUrl || !pipeKey) {
    return NextResponse.json({ error: "Pipe not configured" }, { status: 503 });
  }
  const targetPath = path?.join("/") ?? "";
  const search = req.nextUrl.search;
  const target = `${pipeUrl}/api/v1/${targetPath}${search}`;

  try {
    const res = await fetch(target, {
      headers: { Authorization: `Bearer ${pipeKey}` },
      next: { revalidate: 3600 },
    });
    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") ?? "application/json",
        "cache-control": res.headers.get("cache-control") ?? "public, s-maxage=3600",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }
}
