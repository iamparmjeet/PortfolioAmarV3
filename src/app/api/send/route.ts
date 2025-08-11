// app/api/contact/route.ts
import { Resend } from "resend";

import { ContactFormEmailTemplate } from "@/components/contact/email-template";
import env from "@/lib/env";
import { formSchema } from "@/lib/types";

const resend = new Resend(env.RESEND_API_KEY);

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
    const { name, email, mobile, subject, message } = parsed.data;

    // 4️⃣ Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>", // must be verified in Resend
      to: ["delivered@resend.dev"], // your receiving email
      subject: `New Contact Form: ${subject}`,
      react: ContactFormEmailTemplate({
        name,
        email,
        mobile,
        subject,
        message,
      }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  }
  catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
