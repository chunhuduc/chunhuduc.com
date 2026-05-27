const VISITOR_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type VisitorProfilePatch = {
  visitorName?: string | null;
  visitorEmail?: string | null;
};

export function parseVisitorProfilePatch(body: {
  visitorName?: unknown;
  visitorEmail?: unknown;
}): { patch: VisitorProfilePatch; error?: string } {
  const patch: VisitorProfilePatch = {};

  if (body.visitorName !== undefined) {
    if (typeof body.visitorName !== "string") {
      return { patch: {}, error: "visitorName must be a string." };
    }
    const name = body.visitorName.trim().slice(0, 120);
    patch.visitorName = name || null;
  }

  if (body.visitorEmail !== undefined) {
    if (typeof body.visitorEmail !== "string") {
      return { patch: {}, error: "visitorEmail must be a string." };
    }
    const email = body.visitorEmail.trim().slice(0, 254);
    if (email && !VISITOR_EMAIL_RE.test(email)) {
      return { patch: {}, error: "Invalid email address." };
    }
    patch.visitorEmail = email || null;
  }

  return { patch };
}

export function formatVisitorNotifyLines(profile: {
  visitorName: string | null;
  visitorEmail: string | null;
}): { who: string; lines: string } {
  const name = profile.visitorName?.trim() || null;
  const email = profile.visitorEmail?.trim() || null;
  const who = name || email || "A visitor";

  const lines: string[] = [];
  if (name) lines.push(`Name: ${name}`);
  if (email) lines.push(`Email: ${email}`);
  if (!name && !email) lines.push("From: A visitor");

  return { who, lines: lines.join("\n") };
}

export function formatVisitorDisplay(profile: {
  visitorName: string | null;
  visitorEmail: string | null;
}): { title: string; subtitle: string | null } {
  const name = profile.visitorName?.trim() || null;
  const email = profile.visitorEmail?.trim() || null;

  if (name && email) {
    return { title: name, subtitle: email };
  }
  if (name) return { title: name, subtitle: null };
  if (email) return { title: email, subtitle: null };
  return { title: "Visitor", subtitle: null };
}
