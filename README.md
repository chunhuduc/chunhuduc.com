# chunhuduc.com

Personal site for **CHU NHƯ ĐỨC**: Next.js (App Router), Tailwind CSS v4, Markdown blog, typed data for experience and projects.

Canonical résumé facts live in a separate private workspace; sync `data/*.ts` manually when your public story changes.

**Improvement backlog (private SA repo):** [`docs/career/chunhuduc-site-backlog.md`](../SA/docs/career/chunhuduc-site-backlog.md) (sibling folder `SA` on disk).

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

| Path | Purpose |
|------|---------|
| `content/blog/*.md` | Blog posts (YAML frontmatter: `title`, `date`, `summary`, optional `repo`, `relatedRepos`) |
| `data/profile.ts` | Name, headline, contact, social URLs, optional `heroPortrait` (`public/` path) |
| `data/experience.ts` | Employment entries |
| `data/projects.ts` | **Generated** project cards — run `npm run projects:sync` to regenerate, do not hand-edit |
| `data/projects-nda.ts` | Hand-authored project cards for NDA-protected work with no public repo |

Public-repo project cards are sourced from each repo's own README (a
`chunhuduc.com:showcase` block — format documented in
`docs/projects/SHOWCASE-FORMAT.md` in the sibling `SA` workspace, written
via that workspace's `/inspect-project` skill). Run `npm run
projects:sync` (or the `/sync-projects` skill) to pull the latest and
regenerate `data/projects.ts`.

## Deploy (Vercel)

1. Push this repository to GitHub (public is typical for portfolio source).
2. **New Project** in Vercel, import the repo, **Root Directory** `.`, Framework Preset Next.js.
3. **Domains**: add **chunhuduc.com**, then apply the DNS records your registrar shows from Vercel.
4. Pick one canonical URL (**apex** or **www**) and set the opposite redirect in Vercel.

Optional later: set **`GITHUB_TOKEN`** in Vercel if you add build-time GitHub metadata fetching.

## Contact email (`contact@chunhuduc.com`)

Public address in [`data/profile.ts`](data/profile.ts). Inbound uses **Cloudflare Email Routing**; the site form sends via **Resend** and is protected by **ALTCHA** (privacy-friendly proof-of-work captcha).

### ALTCHA (contact form)

1. Generate a secret: `openssl rand -hex 32`
2. Set `ALTCHA_HMAC_SECRET` in `.env.local` and on Vercel (same value in every environment).
3. The widget loads challenges from `GET /api/altcha/challenge`; `POST /api/contact` verifies the `altcha` payload before sending email.

If `ALTCHA_HMAC_SECRET` is unset, the challenge endpoint returns 503 and the contact API skips verification (local dev only; set the secret before production).

### 1. Cloudflare Email Routing (receive)

Domain DNS must use **Cloudflare** nameservers.

1. Cloudflare dashboard → **Email** → **Email Routing** → Enable.
2. Add and verify destination **`chunhuduc@gmail.com`**.
3. Routing rule: **`contact@chunhuduc.com`** → that Gmail address.
4. Apply MX/TXT records from the wizard; remove old **Mailcheap** MX if present.
5. Send a test message to `contact@` and confirm it appears in Gmail.

Docs: [Cloudflare Email Routing](https://developers.cloudflare.com/email-routing/).

### 2. Resend (contact form send)

1. Create a [Resend](https://resend.com) account and add domain **`chunhuduc.com`**.
2. Add the DNS records Resend shows (SPF/DKIM); they can coexist with Email Routing MX.
3. Create an API key.
4. Copy [`.env.example`](.env.example) to `.env.local` for local dev, and set the same variables on **Vercel** → Project → Settings → Environment Variables:

| Variable | Example |
|----------|---------|
| `RESEND_API_KEY` | `re_...` |
| `CONTACT_FROM_EMAIL` | `contact@chunhuduc.com` (replyable; or `onboarding@resend.dev` before domain verify) |
| `CONTACT_TO_EMAIL` | `contact@chunhuduc.com` |

The homepage form posts to **`POST /api/contact`** (owner notification + visitor auto-reply).

### 3. Optional: Gmail “Send mail as” `contact@`

Forwarding only receives mail. To **reply from** `contact@chunhuduc.com` in Gmail: Settings → Accounts → **Send mail as** → add `contact@` using Resend SMTP (see Resend docs for SMTP credentials).

### 4. End-to-end checks

- [ ] External email to `contact@chunhuduc.com` lands in Gmail.
- [ ] Submit the site contact form locally (with `.env.local`) or on production.
- [ ] Gmail receives the inquiry; visitor receives auto-reply.
- [ ] Reply from Gmail reaches the visitor (Reply-To is their address).

## Ask Đức AI (RAG chat)

Portfolio assistant at **`/ask`**, grounded on public site data + optional private SA markdown (ingest only).

### Setup

1. **Postgres + pgvector (recommended: [Neon](https://neon.tech) free tier):**
   - Why not Supabase free? Projects **pause after ~7 days idle** and need manual **Resume** (data safe, but `/ask` breaks until you unpause).
   - Neon free: compute **scale-to-zero after ~5 min idle**, wakes on the next query (~1s cold start). No dashboard "project paused" for a portfolio chat.
   - Create a Neon project → SQL Editor → run [`supabase/migrations/001_rag.sql`](supabase/migrations/001_rag.sql) then [`002_openai_embeddings.sql`](supabase/migrations/002_openai_embeddings.sql) if using OpenAI (`CREATE EXTENSION vector` included).
   - Copy the **pooled** connection string → `DATABASE_URL` (Vercel: use the pooler URL).
2. **Env:** copy [`.env.example`](.env.example) → `.env.local`. Set `DATABASE_URL`, `OPENAI_API_KEY`, `ALTCHA_HMAC_SECRET`, `ADMIN_SECRET`.
3. **Ingest** (local):

```bash
npm run knowledge:ingest
# Optional SA workspace (NDA-safe allowlist in knowledge/ingest.manifest.json):
SA_KNOWLEDGE_ROOT=C:/BRAINSTORM/SA npm run knowledge:ingest
```

4. **Vercel:** add the same env vars (except `SA_KNOWLEDGE_ROOT`; run ingest locally after content changes).

### Operations

| Task | Command / URL |
|------|----------------|
| Re-ingest after CV/blog changes | `npm run knowledge:ingest` |
| Review knowledge gaps | `/admin/knowledge` (requires `ADMIN_SECRET`) |
| Chat API | `POST /api/chat` (SSE: `sources`, `text`, `done`) |

**LLM:** default `LLM_PROVIDER=openai` (`gpt-4o-mini` + `text-embedding-3-small`). Run migration `002` when switching from Gemini, then re-ingest. Set `LLM_PROVIDER=gemini` + `GEMINI_API_KEY` to use Gemini instead (768-dim vectors; use `001` only).

## Live chat (human overlay)

Widget on every page: visitor chats with you directly (not AI). Realtime via [Ably](https://ably.com); email alerts via Resend.

### Setup

1. Run [`supabase/migrations/003_live_chat.sql`](supabase/migrations/003_live_chat.sql) in Neon SQL Editor (after `001`).
2. Create an Ably app (Free tier) → copy **API key** → `ABLY_API_KEY` (server only, never `NEXT_PUBLIC_`).
3. Env: `LIVE_CHAT_ENABLED=true`, `DATABASE_URL`, `ABLY_API_KEY`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL` (or `LIVE_CHAT_NOTIFY_EMAIL`), `ALTCHA_HMAC_SECRET`, `ADMIN_SECRET`. Set `LIVE_CHAT_EMAIL_NOTIFY=false` to disable owner email.

### Operations

| Task | URL / command |
|------|----------------|
| Visitor widget | Floating button on all pages when configured |
| Admin inbox | `/admin/chat` (same `ADMIN_SECRET` as knowledge gaps) |
| Email on new visitor message | Resend to `CONTACT_TO_EMAIL` / `LIVE_CHAT_NOTIFY_EMAIL`; debounced ~3 min per conversation |
| Visitor new-reply UX | Red badge on bubble + short sound when panel closed or tab in background |

Ask AI at `/ask` is unchanged and runs in parallel with live chat.

## Newsletter (`/blog`)

Subscribe form on the blog index; subscribers and per-post delivery tracking live in **Neon** (`DATABASE_URL`). **Resend transactional** (`emails.send`, Phase 2 publish) + **Contacts/Topics** sync on subscribe.

### Setup

1. Run [`supabase/migrations/004_newsletter.sql`](supabase/migrations/004_newsletter.sql) in Neon SQL Editor (after `003`).
2. Resend → **Contacts** → create **Topic** `Blog updates` (Opt-in) → copy ID → `RESEND_NEWSLETTER_TOPIC_ID`.
3. Resend → **Webhooks** → `POST https://chunhuduc.com/api/newsletter/webhooks/resend` — events: `email.sent`, `email.delivered`, `email.failed`, `email.bounced`, `email.complained` → `RESEND_WEBHOOK_SECRET`.
4. Generate `NEWSLETTER_UNSUBSCRIBE_SECRET`: `openssl rand -hex 32`.
5. Env: `DATABASE_URL`, `RESEND_API_KEY`, `RESEND_NEWSLETTER_TOPIC_ID`, `RESEND_WEBHOOK_SECRET`, `NEWSLETTER_UNSUBSCRIBE_SECRET`, `ALTCHA_HMAC_SECRET`.

### Operations (Phase 1–2)

| Task | URL / command |
|------|----------------|
| Subscribe | Form on `/blog` → `POST /api/newsletter/subscribe` |
| Unsubscribe | Signed link → `GET /api/newsletter/unsubscribe?token=…` |
| Delivery webhooks | Resend → `/api/newsletter/webhooks/resend` |
| Publish + delivery stats | `/admin/newsletter` (requires `ADMIN_SECRET` login) |

## Fonts

**Manrope** is loaded with `latin` and `vietnamese` subsets via `next/font/google` in `app/layout.tsx`.
