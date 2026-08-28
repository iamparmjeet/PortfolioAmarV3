import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { brand, socials } from "@/lib/data";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
});

const systemPrompt = `You are "Amar AI" — a helpful assistant on ${brand.full}'s portfolio website. Your job is to help potential clients understand Amar's work, services, and process, and to help them decide if they want to start a project together.

About ${brand.full}:
- Freelance video editor, filmmaker, and educator based in ${brand.location}, India
- Brand: Amar Editz
- Specializes in: brand films, Instagram reels, cinematic podcasts, real estate videos, fashion & lifestyle content, social media videos, corporate content
- Education brand: Learnsimm — teaches video editing and filmmaking in Ludhiana
- Clients include: Soorma FC, real estate brands, ayurvedic brands, fashion brands, jewelry brands, astrology channels
- Contact: ${brand.email}
- Instagram: ${socials.insta}
- YouTube: ${socials.youtube}
- Fiverr: ${socials.fiverr}
- LinkedIn: ${socials.linkedin}

Your role:
1. Answer questions about Amar's work, services, pricing (say rates vary by project, suggest they use the contact form for a quote)
2. Help visitors decide if Amar is the right fit for their project
3. Qualify leads — ask about their project type, timeline, and goals
4. Direct serious enquiries to the contact form at /contact or WhatsApp
5. Keep responses concise and friendly — this is a chat widget, not an essay

What NOT to do:
- Don't invent specific prices (e.g. "₹5000 per reel") — say rates depend on scope and to get in touch
- Don't make promises Amar hasn't made
- Don't answer unrelated questions — politely redirect to Amar's work

Language: Mostly English, comfortable with Hindi phrases if the user writes in Hindi. Keep it warm and professional.`;

// Simple rate limit: 10 messages/IP/minute
const ipCounts = new Map<string, { count: number; reset: number }>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const now = Date.now();
  const record = ipCounts.get(ip);

  if (record && now < record.reset) {
    if (record.count >= 10) {
      return NextResponse.json({ error: "Too many messages" }, { status: 429 });
    }
    record.count++;
  } else {
    ipCounts.set(ip, { count: 1, reset: now + 60_000 });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "Chat not configured" }, { status: 503 });
  }

  const { messages } = await req.json();
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
  }

  const result = streamText({
    model: openrouter("google/gemini-2.5-flash"),
    system: systemPrompt,
    messages: messages.slice(-20),
    maxOutputTokens: 400,
  });

  return result.toTextStreamResponse();
}
