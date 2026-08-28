import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { SITE_URL } from "@/constants/site";
import { ASK_AMAR_SYSTEM } from "@/lib/ask-amar-context";
import { resolveChatProvider } from "@/lib/chat-provider";
import { askAmarDailyRatelimit, askAmarRatelimit, checkMemoryRatelimit } from "@/lib/ratelimit";
import { clientIp } from "@/lib/request-ip";

const MAX_OUTPUT_TOKENS = 600;

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(1500),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
});

function textResponse(body: string, status = 200) {
  return new NextResponse(body, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export async function POST(request: NextRequest) {
  // 1. Validate the conversation.
  let parsed: z.infer<typeof bodySchema>;
  try {
    parsed = bodySchema.parse(await request.json());
  } catch {
    return textResponse("That request didn't look right.", 400);
  }

  // The first turn must be the visitor's — prevents assistant-history injection.
  if (parsed.messages[0]?.role !== "user") {
    return textResponse("That request didn't look right.", 400);
  }

  // 2. Rate-limit per IP. Dual window (8/min + 60/day). Fail CLOSED — if
  //    Upstash is configured but unreachable, refuse rather than leave the
  //    paid endpoint uncapped. When Upstash isn't configured, fall back to
  //    an in-memory limiter (noisy, but prevents local abuse).
  const ip = clientIp(request) ?? "anonymous";
  if (askAmarRatelimit && askAmarDailyRatelimit) {
    try {
      const [perMinute, perDay] = await Promise.all([
        askAmarRatelimit.limit(ip),
        askAmarDailyRatelimit.limit(ip),
      ]);
      if (!perMinute.success || !perDay.success) {
        return textResponse(
          "You're sending messages a little fast — give it a minute and try again.",
          429,
        );
      }
    } catch (err) {
      console.error("Ask Amar rate-limit check failed:", err);
      return textResponse("The chat is briefly unavailable — please try again in a moment.", 503);
    }
  } else {
    console.warn("Upstash not configured — Ask Amar using in-memory rate limiting.");
    const { success } = checkMemoryRatelimit(ip);
    if (!success) {
      return textResponse(
        "You're sending messages a little fast — give it a minute and try again.",
        429,
      );
    }
  }

  // 3. Resolve the provider (OpenRouter / Fireworks); degrade gracefully when
  //    none is configured in this environment.
  const chat = resolveChatProvider();
  if (!chat) {
    console.warn("No chat provider configured — set OPENROUTER_API_KEY or FIREWORKS_API_KEY.");
    return textResponse(
      "The chatbot isn't connected in this environment yet. Reach Amar through the contact page instead.",
    );
  }

  // 4. Forward the client's abort signal so a closed tab stops generation
  //    (and the bill) instead of running to completion server-side.
  const ac = new AbortController();
  request.signal.addEventListener("abort", () => ac.abort());

  const client = new OpenAI({
    apiKey: chat.apiKey,
    baseURL: chat.baseURL,
    // HTTP-Referer / X-Title are OpenRouter ranking headers; harmless to others.
    defaultHeaders: { "HTTP-Referer": SITE_URL, "X-Title": "Amar AI" },
  });

  let completion: Awaited<ReturnType<typeof client.chat.completions.create>> &
    AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;
  try {
    completion = (await client.chat.completions.create(
      {
        model: chat.model,
        max_tokens: MAX_OUTPUT_TOKENS,
        temperature: 0.4,
        stream: true,
        messages: [{ role: "system", content: ASK_AMAR_SYSTEM }, ...parsed.messages],
      },
      { signal: ac.signal },
    )) as typeof completion;
  } catch (err) {
    console.error("Ask Amar completion failed to start:", err);
    return textResponse("The chatbot hit a snag. Please try again in a moment.", 502);
  }

  // 5. Stream the answer back to the client as plain text.
  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      let emitted = false;
      try {
        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            emitted = true;
            controller.enqueue(encoder.encode(delta));
          }
        }
        if (!emitted) {
          controller.enqueue(
            encoder.encode(
              "I can't help with that one — try asking about Amar's work, services, or how to start a project.",
            ),
          );
        }
        controller.close();
      } catch (err) {
        // Client disconnected mid-stream — not an error worth surfacing.
        if (ac.signal.aborted) {
          controller.close();
          return;
        }
        console.error("Ask Amar stream error:", err);
        controller.error(err);
      }
    },
    cancel() {
      ac.abort();
    },
  });

  return new NextResponse(readable, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
