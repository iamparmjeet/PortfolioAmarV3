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
