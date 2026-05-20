import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  message: z.string().min(1).max(5000),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const to = process.env.CONTACT_EMAIL;
    const key = process.env.RESEND_API_KEY;
    if (!to || !key)
      return NextResponse.json({ error: "Email not configured" }, { status: 500 });

    const resend = new Resend(key);
    await resend.emails.send({
      from: "Restaurant Menu <onboarding@resend.dev>",
      to,
      subject: `Contact: ${body.name}`,
      text: `Name: ${body.name}\nEmail: ${body.email}\nPhone: ${body.phone ?? "-"}\n\n${body.message}`,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
