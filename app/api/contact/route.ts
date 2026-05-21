import { Resend } from "resend";
import { NextResponse } from "next/server";
import {
  buildAutoReplyContent,
  buildOwnerEmailContent,
  getContactConfig,
  parseContactBody,
} from "@/lib/contact";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = parseContactBody(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { apiKey, to, from, fromName, siteName } = getContactConfig();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Contact form is not configured yet." },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);
  const fromHeader = `${fromName} <${from}>`;
  const owner = buildOwnerEmailContent(parsed.data);
  const autoReply = buildAutoReplyContent(parsed.data, siteName);

  const ownerResult = await resend.emails.send({
    from: fromHeader,
    to: [to],
    replyTo: parsed.data.email,
    subject: owner.subject,
    text: owner.text,
  });

  if (ownerResult.error) {
    console.error("contact owner email failed", ownerResult.error);
    return NextResponse.json(
      { error: "Could not send your message. Try again later." },
      { status: 502 },
    );
  }

  const autoResult = await resend.emails.send({
    from: fromHeader,
    to: [parsed.data.email],
    subject: autoReply.subject,
    text: autoReply.text,
  });

  if (autoResult.error) {
    console.error("contact auto-reply failed", autoResult.error);
  }

  return NextResponse.json({ ok: true });
}
