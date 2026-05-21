<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Site content

- **Contact row (hero “Contact me”) and other CTAs:** Edit phone, email, and `social` in [`data/profile.ts`](data/profile.ts). Form: ALTCHA ([`lib/altcha.ts`](lib/altcha.ts), [`components/AltchaWidget.tsx`](components/AltchaWidget.tsx)) + Resend ([`app/api/contact/route.ts`](app/api/contact/route.ts)); inbound `contact@` via Cloudflare Email Routing (see [`README.md`](README.md)).
