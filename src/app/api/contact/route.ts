import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Naive in-memory rate limit: 3 submissions per IP per 10 minutes.
// Resets on cold start (fine on serverless — it only needs to slow bots
// within a warm instance; the honeypot catches the rest).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const submissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  submissions.set(ip, recent);
  if (recent.length >= MAX_PER_WINDOW) return true;
  recent.push(now);
  return false;
}

export async function POST(req: NextRequest) {
  const { name, email, message, website, projectType, budget, timeline } = (await req.json()) as {
    name?: string;
    email?: string;
    message?: string;
    website?: string;
    projectType?: string;
    budget?: string;
    timeline?: string;
  };

  // Honeypot: the "website" field is invisible to humans. Bots fill it.
  // Return a fake success so they don't adapt.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    // TODO: replace with a verified sending domain before launch
    from: "Portfolio Contact <onboarding@resend.dev>",
    to: process.env.CONTACT_EMAIL,
    subject: `New enquiry from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      projectType ? `Project Type: ${projectType}` : null,
      budget ? `Budget: ${budget}` : null,
      timeline ? `Timeline: ${timeline}` : null,
      `\nMessage:\n${message}`,
    ]
      .filter(Boolean)
      .join("\n"),
    replyTo: email,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
