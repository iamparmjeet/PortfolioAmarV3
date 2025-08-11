import { render } from "@react-email/render";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

import { ConfirmationEmailTemplate, ContactFormEmailTemplate } from "@/components/contact/email-template";
import env from "@/lib/env";
import { formSchema } from "@/lib/types";
import { formatUrlForDisplay } from "@/lib/utils";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    // 1️⃣ Parse request body
    const body = await req.json();

    // 2️⃣ Validate with Zod
    const parsed = formSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    // 3️⃣ Destructure validated data
    const { name, email, mobile, subject, message, clientwebsite } = parsed.data;
    const formattedWebsite = formatUrlForDisplay(clientwebsite);

    const emailId = uuidv4();
    const trackingPixelUrl = `https://amarjeetmishra.com/api/track-open?id=${emailId}`;

    // --- Use react-email's render function ---
    const SubmissionHTMLContent = await render(
      ContactFormEmailTemplate({
        name,
        email,
        mobile,
        subject,
        clientwebsite: formattedWebsite,
        message,
        trackingPixel: trackingPixelUrl,
      }),
    );
    // --- End of rendering ---

    // 4) Send email via Nodemailer

    const confirmationHTMLContent = await render(
      ConfirmationEmailTemplate({
        name,
        email,
        mobile,
        subject,
        clientwebsite,
        message,
      }),
    );

    // Send email to me
    const mailOptions = {
      from: `"amarjeetmishra.com" <${env.MY_EMAIL}>`,
      to: env.GMAIL_USER,
      replyTo: email,
      subject: `New Contact Form Submission: ${subject}`,
      html: SubmissionHTMLContent,
      text: `Name: ${name}\nEmail: ${email}\nMobile: ${mobile}\nWebsite: ${clientwebsite}\nSubject: ${subject}\nMessage: ${message}`,
    };

    // Send confirmation email to user
    const confirmationMailOptions = {
      from: `"amarjeetmishra.com" <${env.MY_EMAIL}>`,
      to: email,
      replyTo: env.MY_EMAIL,
      subject: `Your Form Submission: ${subject}`,
      html: confirmationHTMLContent,
      text: `Name: ${name}\nEmail: ${email}\nMobile: ${mobile}\nWebsite: ${clientwebsite}\nSubject: ${subject}\nMessage: ${message}`,
    };

    const info = await transporter.sendMail(mailOptions);
    await transporter.sendMail(confirmationMailOptions);
    return NextResponse.json({ messageId: info.messageId }, { status: 200 });
  }
  catch (error) {
    console.error("Error sending email:", error);

    if ((error as any).code === "AUTH") {
      return NextResponse.json({ error: "Email authentication failed. Check your Gmail credentials and App Password." }, { status: 500 });
    }
    else if ((error as any).code === "INVALID_LOGIN") {
      return NextResponse.json({ error: "Invalid login. Ensure your Gmail account is correctly configured." }, { status: 500 });
    }
    else if ((error as any).code === "EENVELOPE") {
      return NextResponse.json({ error: "Invalid recipient address." }, { status: 500 });
    }

    return NextResponse.json({ error: "Failed to send email. Please try again later." }, { status: 500 });
  }
}
