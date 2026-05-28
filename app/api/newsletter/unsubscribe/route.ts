import { NextResponse } from "next/server";
import { isNewsletterUnsubscribeConfigured } from "@/lib/newsletter/config";
import { verifyUnsubscribeToken } from "@/lib/newsletter/unsubscribe-token";
import { unsubscribeNewsletterSubscriber } from "@/lib/newsletter/unsubscribe";

export const runtime = "nodejs";

function unsubscribeHtml(title: string, message: string, ok: boolean) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #1a2028; color: #e8eaed; margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 2rem; }
    main { max-width: 28rem; text-align: center; }
    h1 { font-size: 1.5rem; margin: 0 0 1rem; }
    p { color: #9aa3af; line-height: 1.6; margin: 0; }
    a { color: #7dd3fc; }
  </style>
</head>
<body>
  <main>
    <h1>${title}</h1>
    <p>${message}</p>
    <p style="margin-top:1.5rem"><a href="/blog">Back to blog</a></p>
  </main>
</body>
</html>`;
}

export async function GET(request: Request) {
  if (!isNewsletterUnsubscribeConfigured()) {
    return new NextResponse(
      unsubscribeHtml(
        "Unavailable",
        "Unsubscribe is not configured on this site.",
        false,
      ),
      { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const token = new URL(request.url).searchParams.get("token")?.trim() ?? "";
  if (!token) {
    return new NextResponse(
      unsubscribeHtml("Invalid link", "This unsubscribe link is missing or invalid.", false),
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const verified = verifyUnsubscribeToken(token);
  if (!verified.ok) {
    return new NextResponse(unsubscribeHtml("Invalid link", verified.error, false), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  try {
    const result = await unsubscribeNewsletterSubscriber(verified.subscriberId);
    if (!result.ok) {
      return new NextResponse(unsubscribeHtml("Not found", result.error, false), {
        status: result.status,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    const message = result.already
      ? "You were already unsubscribed from this newsletter."
      : "You have been unsubscribed. You will not receive further newsletter emails.";

    return new NextResponse(unsubscribeHtml("Unsubscribed", message, true), {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (e) {
    console.error("newsletter unsubscribe failed", e);
    return new NextResponse(
      unsubscribeHtml(
        "Something went wrong",
        "Could not process your unsubscribe request. Try again later.",
        false,
      ),
      { status: 502, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }
}
