# chunhuduc.com

Personal site for **CHU NHƯ ĐỨC**: Next.js (App Router), Tailwind CSS v4, Markdown blog, typed data for experience and projects.

Canonical résumé facts live in a separate private workspace; sync `data/*.ts` manually when your public story changes.

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
| `data/projects.ts` | Initiative cards (NDA-safe blurbs) |
| `data/repos.ts` | GitHub showcase rows |

## Deploy (Vercel)

1. Push this repository to GitHub (public is typical for portfolio source).
2. **New Project** in Vercel, import the repo, **Root Directory** `.`, Framework Preset Next.js.
3. **Domains**: add **chunhuduc.com**, then apply the DNS records your registrar shows from Vercel.
4. Pick one canonical URL (**apex** or **www**) and set the opposite redirect in Vercel.

Optional later: set **`GITHUB_TOKEN`** in Vercel if you add build-time GitHub metadata fetching.

## Contact email (`contact@chunhuduc.com`)

Public address in [`data/profile.ts`](data/profile.ts). Inbound uses **Cloudflare Email Routing**; the site form sends via **Resend**.

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

## Fonts

**Manrope** is loaded with `latin` and `vietnamese` subsets via `next/font/google` in `app/layout.tsx`.
