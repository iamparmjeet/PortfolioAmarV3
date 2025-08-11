import { v4 as uuidv4 } from "uuid";

import env from "@/lib/env";
import { transporter } from "../send/route";

// --- Notification Email Details ---
const NOTIFICATION_RECIPIENT = env.GMAIL_USER; // Or a specific notification email

// --- Transparent Pixel Base64 ---
const transparentPixelBase64 = "R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const emailId = searchParams.get("id");

  if (!emailId) {
    // Respond with a transparent pixel if no ID is provided
    // eslint-disable-next-line node/prefer-global/buffer
    return new Response(Buffer.from(transparentPixelBase64, "base64"), {
      status: 200,
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }

  console.log(`Email opened! Tracking ID: ${emailId}`);

  // --- Optional: Database Logging ---
  // If you have a DB setup, uncomment and implement this:
  /*
  try {
    // Example: Assuming you have a db object available (e.g., imported from '@/lib/db')
    // await db.collection('emailOpens').insertOne({ emailId, openedAt: new Date() });
    // console.log(`Logged open event for ${emailId} to database.`);
  } catch (dbError) {
    console.error(`Database error logging open event for ${emailId}:`, dbError);
  }
  */

  // --- Send immediate notification email ---
  try {
    const notificationSubject = `Email Opened: ${emailId.substring(0, 8)}...`; // Shorten ID for subject
    const notificationText = `An email with tracking ID "${emailId}" was opened.`;
    const notificationHtml = `<p>An email with tracking ID "${emailId}" was opened at ${new Date().toLocaleString()}.</p><p>You might want to check your system for activity related to this ID.</p>`;

    await transporter.sendMail({
      from: `"Your Website Notifications" <${env.GMAIL_USER}>`,
      to: NOTIFICATION_RECIPIENT,
      subject: notificationSubject,
      text: notificationText,
      html: notificationHtml,
    });
    console.log(`Sent open notification email for ${emailId} to ${NOTIFICATION_RECIPIENT}`);
  }
  catch (emailError: any) {
    console.error(`Failed to send open notification email for ${emailId}:`, emailError);
    // Continue execution to return the pixel, even if notification failed.
  }

  // Respond with the transparent pixel
  // eslint-disable-next-line node/prefer-global/buffer
  return new Response(Buffer.from(transparentPixelBase64, "base64"), {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
