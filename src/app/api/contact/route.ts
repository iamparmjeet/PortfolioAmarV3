import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

// ── In-memory rate limit: 3 / IP / 10 min + global safeguards ──
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const MAX_TRACKED_IPS = 500;
const submissions = new Map<string, number[]>();

function isRateLimited(ip: string): { limited: boolean; retryAfterMs: number } {
  const now = Date.now();

  // Periodic cleanup: once every ~50 requests, prune stale IPs and cap size
  if (submissions.size > MAX_TRACKED_IPS || Math.random() < 0.02) {
    for (const [key, stamps] of submissions) {
      const fresh = stamps.filter((t) => now - t < WINDOW_MS);
      if (fresh.length === 0) submissions.delete(key);
      else submissions.set(key, fresh);
    }
    // Hard cap — drop oldest entries if still over limit
    if (submissions.size > MAX_TRACKED_IPS) {
      const keys = Array.from(submissions.keys());
      for (let i = 0; i < keys.length - MAX_TRACKED_IPS; i++) {
        submissions.delete(keys[i]);
      }
    }
  }

  const recent = (submissions.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  submissions.set(ip, recent);

  if (recent.length >= MAX_PER_WINDOW) {
    const oldest = recent[0];
    const retryAfterMs = WINDOW_MS - (now - oldest);
    return { limited: true, retryAfterMs };
  }

  recent.push(now);
  return { limited: false, retryAfterMs: 0 };
}

// ── Timing gate: reject instant submits (bots) ──
const MIN_SUBMIT_MS = 2500;

// ── Content heuristics ──
const MAX_LINKS = 3;

function countLinks(text: string): number {
  const matches = text.match(/https?:\/\/|www\./gi);
  return matches ? matches.length : 0;
}

// ── Zod schema — strict server-side validation ──
const contactSchema = z.object({
  name: z.string().trim().min(2, "Name too short").max(100, "Name too long"),
  email: z.string().trim().toLowerCase().email("Invalid email").max(254),
  message: z.string().trim().min(10, "Message too short").max(5000, "Message too long"),
  website: z.string().optional(), // honeypot
  projectType: z.string().trim().max(50).optional(),
  budget: z.string().trim().max(50).optional(),
  timeline: z.string().trim().max(50).optional(),
  // Canonical Spin field + legacy: backend accepts both
  turnstileToken: z.string().optional(),
  "cf-turnstile-response": z.string().optional(),
  cf_turnstile_response: z.string().optional(),
  startedAt: z.number().optional(), // client timestamp for timing check
});

// ── Turnstile server verification — canonical Spin siteverify ──
// Secret lives in TURNSTILE_SECRET (Spin) with fallback to TURNSTILE_SECRET_KEY (legacy)
// Hostnames allowlist lives in TURNSTILE_HOSTNAMES (comma-separated). When absent,
// we skip hostname check in dev but require success + action.
type SiteVerifyResult = {
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
};

async function verifyTurnstile(
  token: string,
  ip: string,
): Promise<{ ok: boolean; result?: SiteVerifyResult; error?: string }> {
  const secret = process.env.TURNSTILE_SECRET ?? process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true }; // not configured -> skip (dev mode)

  const expectedAction = "contact";
  const expectedHostnames = new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean),
  );

  // Spin token hygiene — reject obviously invalid tokens before hitting Cloudflare
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return { ok: false, error: "missing-token" };
  }
  if (expectedHostnames.size === 0) {
    console.warn(
      "[contact] TURNSTILE_HOSTNAMES is empty — skipping hostname check. Set it to e.g. amarjeetmishra.com,www.amarjeetmishra.com in production.",
    );
  }

  let result: SiteVerifyResult;
  try {
    const body = new URLSearchParams({
      secret,
      response: token,
      ...(ip && ip !== "unknown" ? { remoteip: ip } : {}),
    });
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(10_000),
      body,
    });
    if (!res.ok) throw new Error(`siteverify ${res.status}`);
    result = (await res.json()) as SiteVerifyResult;
  } catch (err) {
    console.error("[contact] Turnstile verify error", err);
    return { ok: false, error: "verify-failed" };
  }

  if (!result.success) {
    console.warn("[contact] Turnstile verify failed", result["error-codes"]);
    return { ok: false, result, error: result["error-codes"]?.join(",") ?? "invalid-token" };
  }
  // Canonical Spin: require action + hostname match
  if (result.action !== expectedAction) {
    console.warn("[contact] Turnstile action mismatch", {
      expected: expectedAction,
      got: result.action,
    });
    return { ok: false, result, error: "action-mismatch" };
  }
  if (expectedHostnames.size > 0 && result.hostname && !expectedHostnames.has(result.hostname)) {
    console.warn("[contact] Turnstile hostname not allowlisted", {
      hostname: result.hostname,
      allowlist: [...expectedHostnames],
    });
    return { ok: false, result, error: "hostname-mismatch" };
  }

  return { ok: true, result };
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first.message, field: first.path[0] }, { status: 400 });
  }

  const { name, email, message, website, projectType, budget, timeline, startedAt } = parsed.data;
  // Canonical Spin token field + legacy fallbacks
  const turnstileToken =
    (parsed.data["cf-turnstile-response"] as string | undefined) ??
    (parsed.data.cf_turnstile_response as string | undefined) ??
    parsed.data.turnstileToken ??
    "";

  // 1. Honeypot — invisible "website" field. Return fake success so bots don't adapt.
  if (website && website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // 2. Timing gate — reject submissions faster than a human could type
  if (typeof startedAt === "number" && Number.isFinite(startedAt)) {
    const elapsed = Date.now() - startedAt;
    // Allow slightly negative drift (clock skew) but catch instant bots
    if (elapsed >= 0 && elapsed < MIN_SUBMIT_MS) {
      return NextResponse.json(
        { error: "Please take a moment to review your message before sending." },
        { status: 400 },
      );
    }
    // Reject absurdly old timestamps (tampering) — 1 hour
    if (elapsed > 60 * 60 * 1000) {
      return NextResponse.json(
        { error: "Session expired, please refresh and try again." },
        { status: 400 },
      );
    }
  }

  // 3. Content heuristics — link spam
  if (countLinks(message) > MAX_LINKS) {
    return NextResponse.json(
      { error: "Too many links in message — please remove some URLs." },
      { status: 400 },
    );
  }

  // 4. Turnstile verification — canonical Spin siteverify
  // Gate: browser → your backend → siteverify. Require success + action + hostname.
  // Secret lives in TURNSTILE_SECRET (Spin) with fallback to TURNSTILE_SECRET_KEY (legacy).
  const turnstileSecret = process.env.TURNSTILE_SECRET ?? process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const { ok, error } = await verifyTurnstile(turnstileToken, ip);
    if (!ok) {
      const msg =
        error === "action-mismatch" || error === "hostname-mismatch"
          ? "Spam check failed — please refresh and try again."
          : error === "missing-token"
            ? "Spam check missing — please complete the challenge."
            : "Spam check failed — please refresh and try again.";
      return NextResponse.json({ error: msg }, { status: 403 });
    }
  }

  // 5. Hardened in-memory rate limit (per-IP, with cleanup + Retry-After)
  const { limited, retryAfterMs } = isRateLimited(ip);
  if (limited) {
    const retryAfterSec = Math.ceil(retryAfterMs / 1000);
    return NextResponse.json(
      { error: "Too many requests — please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSec) } },
    );
  }

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const plainText = [
    `Name: ${name}`,
    `Email: ${email}`,
    projectType ? `Project Type: ${projectType}` : null,
    budget ? `Budget: ${budget}` : null,
    timeline ? `Timeline: ${timeline}` : null,
    `\nMessage:\n${message}`,
  ]
    .filter(Boolean)
    .join("\n");

  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);
  const safeProjectType = projectType ? escapeHtml(projectType) : null;
  const safeBudget = budget ? escapeHtml(budget) : null;
  const safeTimeline = timeline ? escapeHtml(timeline) : null;

  const notifyHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Project Enquiry</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1C1917;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF8F5; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #FFFFFF; border: 1px solid rgba(201, 148, 58, 0.3); border-radius: 8px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.06);">
          <!-- Header Bar -->
          <tr>
            <td style="padding: 24px 32px; background-color: #F5F1EB; border-bottom: 1px solid rgba(0,0,0,0.06);">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-family: Georgia, serif; font-size: 22px; font-weight: bold; color: #1C1917; letter-spacing: -0.02em;">
                      Amar<span style="color: #C9943A;">.</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: #8A611B; background-color: rgba(201, 148, 58, 0.12); border: 1px solid rgba(201, 148, 58, 0.35); padding: 4px 8px; border-radius: 3px;">
                      Take 001 · New Lead
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 8px 0; font-family: Georgia, serif; font-size: 24px; font-weight: 400; color: #1C1917;">
                New Enquiry from <strong style="color: #8A611B;">${safeName}</strong>
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 12px; color: #78716C; font-family: ui-monospace, SFMono-Regular, monospace; letter-spacing: 0.05em;">
                Received via portfolio contact form
              </p>

              <!-- Meta Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; background-color: #FAF8F5; border-radius: 6px; border: 1px solid rgba(0,0,0,0.06);">
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,0.06); font-size: 11px; color: #78716C; font-family: ui-monospace, monospace; width: 110px;">CLIENT</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,0.06); font-size: 13px; color: #1C1917; font-weight: 500;">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,0.06); font-size: 11px; color: #78716C; font-family: ui-monospace, monospace;">EMAIL</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,0.06); font-size: 13px; color: #8A611B;">
                    <a href="mailto:${safeEmail}" style="color: #8A611B; text-decoration: none;">${safeEmail}</a>
                  </td>
                </tr>
                ${
                  safeProjectType
                    ? `<tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,0.06); font-size: 11px; color: #78716C; font-family: ui-monospace, monospace;">PROJECT</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,0.06); font-size: 13px; color: #1C1917;">${safeProjectType}</td>
                </tr>`
                    : ""
                }
                ${
                  safeBudget
                    ? `<tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,0.06); font-size: 11px; color: #78716C; font-family: ui-monospace, monospace;">BUDGET</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,0.06); font-size: 13px; color: #1C1917;">${safeBudget}</td>
                </tr>`
                    : ""
                }
                ${
                  safeTimeline
                    ? `<tr>
                  <td style="padding: 12px 16px; font-size: 11px; color: #78716C; font-family: ui-monospace, monospace;">TIMELINE</td>
                  <td style="padding: 12px 16px; font-size: 13px; color: #1C1917;">${safeTimeline}</td>
                </tr>`
                    : ""
                }
              </table>

              <!-- Message Block -->
              <div style="margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 10px; font-family: ui-monospace, monospace; text-transform: uppercase; letter-spacing: 0.14em; color: #78716C;">Project Brief / Message</p>
                <div style="background-color: #FAF8F5; border-left: 3px solid #C9943A; padding: 16px; border-radius: 0 6px 6px 0; font-size: 14px; line-height: 1.6; color: #292524; white-space: pre-wrap;">${safeMessage}</div>
              </div>

              <!-- Quick Action -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-top: 8px;">
                    <a href="mailto:${safeEmail}?subject=Re:%20Project%20Enquiry%20-%20Amar%20Editz" style="display: inline-block; background-color: #C9943A; color: #FFFFFF; font-size: 13px; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 4px; letter-spacing: 0.04em;">
                      Reply directly to ${safeName} →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 18px 32px; background-color: #F5F1EB; border-top: 1px solid rgba(0,0,0,0.06); text-align: center;">
              <p style="margin: 0; font-family: ui-monospace, monospace; font-size: 10px; color: #78716C; letter-spacing: 0.08em;">
                Amar Editz · Video Editor & Filmmaker · Ludhiana, Punjab
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const confirmationHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We Received Your Message</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1C1917;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF8F5; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #FFFFFF; border: 1px solid rgba(201, 148, 58, 0.35); border-radius: 8px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.06);">
          <!-- Header Bar -->
          <tr>
            <td style="padding: 24px 32px; background-color: #F5F1EB; border-bottom: 1px solid rgba(0,0,0,0.06);">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-family: Georgia, serif; font-size: 22px; font-weight: bold; color: #1C1917; letter-spacing: -0.02em;">
                      Amar<span style="color: #C9943A;">.</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: #8A611B; background-color: rgba(201, 148, 58, 0.12); border: 1px solid rgba(201, 148, 58, 0.35); padding: 4px 8px; border-radius: 3px;">
                      Take 001 · Received
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 12px 0; font-family: Georgia, serif; font-size: 24px; font-weight: 400; color: #1C1917;">
                Thank you for reaching out, ${safeName}.
              </h1>
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #44403C;">
                I've received your project details and brief. I personally review every enquiry and will get back to you within <strong>24 hours</strong> with initial thoughts or next steps.
              </p>

              <!-- In the meantime box -->
              <div style="background-color: #FAF8F5; border-left: 3px solid #C9943A; padding: 16px 20px; border-radius: 0 6px 6px 0; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 11px; font-family: ui-monospace, monospace; text-transform: uppercase; letter-spacing: 0.12em; color: #8A611B; font-weight: 600;">
                  In the meantime
                </p>
                <p style="margin: 0; font-size: 13.5px; line-height: 1.5; color: #57534E;">
                  Feel free to explore my latest showreels, commercial edits, and case studies at <a href="https://amarjeetmishra.com/work" style="color: #8A611B; text-decoration: underline;">amarjeetmishra.com/work</a>.
                </p>
              </div>

              <!-- Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left">
                    <a href="https://amarjeetmishra.com/work" style="display: inline-block; background-color: #C9943A; color: #FFFFFF; font-size: 13px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 4px; letter-spacing: 0.04em;">
                      Explore Portfolio & Work →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #F5F1EB; border-top: 1px solid rgba(0,0,0,0.06); text-align: center;">
              <p style="margin: 0 0 4px 0; font-family: ui-monospace, monospace; font-size: 11px; color: #78716C; letter-spacing: 0.04em;">
                Amarjeet Mishra · Video Editor, Filmmaker & Teacher
              </p>
              <p style="margin: 0; font-family: ui-monospace, monospace; font-size: 10px; color: #A8A29E; letter-spacing: 0.04em;">
                Ludhiana, Punjab · <a href="https://amarjeetmishra.com" style="color: #8A611B; text-decoration: none;">amarjeetmishra.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // 1. Send notification to site owner
  const { error: ownerError } = await resend.emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>",
    to: process.env.CONTACT_EMAIL,
    subject: `New enquiry from ${name}${projectType ? ` [${projectType}]` : ""}`,
    text: plainText,
    html: notifyHtml,
    replyTo: email,
  });

  if (ownerError) {
    return NextResponse.json({ error: ownerError.message }, { status: 500 });
  }

  // 2. Send confirmation auto-reply to the user (non-blocking for sandbox compatibility)
  try {
    await resend.emails.send({
      from: "Amarjeet Mishra <onboarding@resend.dev>",
      to: email,
      subject: "Thank you for reaching out — Amar Editz",
      text: `Hi ${name},\n\nThank you for reaching out. I have received your enquiry and will get back to you within 24 hours.\n\nBest,\nAmarjeet Mishra\namarjeetmishra.com`,
      html: confirmationHtml,
    });
  } catch {
    // Sandbox or unverified domain may reject sending to non-owner email,
    // but the main enquiry submission has succeeded.
  }

  return NextResponse.json({ ok: true });
}
