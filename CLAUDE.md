# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev               # Dev server on http://localhost:3000
npm run build             # Production build
npm run lint              # ESLint (flat config, eslint-config-next)
npm run knowledge:ingest  # Re-embed RAG knowledge base into Neon
```

There is no test runner. There are no test files.

To re-ingest with the optional private SA workspace:

```bash
SA_KNOWLEDGE_ROOT=/path/to/SA npm run knowledge:ingest
```

## Architecture

This is a **Next.js 16.2.6 App Router** portfolio + consulting platform. Several backend systems share the same codebase via serverless API routes.

### Systems

| System | Entry point | Infrastructure |
|--------|-------------|----------------|
| Portfolio pages | `app/page.tsx`, `app/experience/`, `app/projects/`, `app/blog/` | SSR/static |
| Ask Đức AI (RAG chatbot) | `app/ask/`, `app/api/chat/` | Neon pgvector + OpenAI |
| Live chat (human) | `components/live-chat/`, `app/api/live-chat/` | Neon + Ably |
| Contact form | `app/api/contact/`, `app/api/altcha/` | Resend + ALTCHA |
| Newsletter | `app/api/newsletter/`, `app/api/admin/newsletter/` | Neon + Resend |
| Admin panel | `app/admin/` | `ADMIN_SECRET` cookie |

### Content and data

All site content is typed TypeScript — there is no CMS:

- `data/profile.ts` — name, contact details, social URLs (single source of truth)
- `data/experience.ts`, `data/projects.ts`, `data/repos.ts`, `data/homeSkills.ts` — structured content
- `content/blog/*.md` — blog posts with YAML frontmatter (`title`, `date`, `summary`, optional `repo`, `relatedRepos`)

### Database

Neon Postgres with pgvector. Drizzle ORM (schema in `lib/db/schema.ts`, client in `lib/db/client.ts`). Eight tables across four migration files in `supabase/migrations/` (numbered `001`–`004`). Migrations run manually in the Neon SQL Editor — no migration CLI is configured.

```
001_rag.sql           documents, chat_logs, knowledge_gaps + HNSW index
002_openai_embeddings.sql   switches embedding dimension to 1536 (OpenAI)
003_live_chat.sql     live_conversations, live_messages
004_newsletter.sql    newsletter_subscribers, newsletter_posts, newsletter_deliveries
```

`DATABASE_URL` must be the Neon **pooler** URL (not the direct connection string).

### RAG pipeline

```
content/ + data/ + knowledge/ (optional SA_KNOWLEDGE_ROOT)
  └─ scripts/knowledge-ingest.ts
       └─ lib/rag/ingest.ts   (chunk → embed → enrich → upsert)
            └─ documents table
                 └─ lib/rag/retrieve.ts  (pgvector cosine similarity)
                      └─ app/api/chat/route.ts  (SSE: sources | text | done)
```

Default provider: OpenAI `text-embedding-3-small` (1536-dim) + `gpt-4o-mini`. Switching to Gemini (768-dim) requires using only `001_rag.sql` (skip `002`) and re-ingesting. Provider implementations are in `lib/rag/providers/`. The `/admin/knowledge` page surfaces unanswerable questions detected by `lib/rag/gap-detect.ts`.

### Live chat

Visitors receive a `visitorToken` (random UUID in `localStorage`). Realtime transport is Ably; Neon stores history. Admin inbox at `/admin/chat`. Owner email notifications are debounced ~3 min per conversation via `lib/live-chat/notify.ts`. The Ably API key is server-only — never `NEXT_PUBLIC_`.

### Admin auth

`/admin/*` pages and `/api/admin/*` routes check `ADMIN_SECRET` via `lib/admin-auth.ts` or `lib/newsletter/admin-guard.ts`. Login POSTs to `/api/admin/login`, which sets a short-lived cookie.

## Styling

Tailwind CSS v4 via `@tailwindcss/postcss`. **There is no `tailwind.config.js`** — v4 reads config from CSS (`app/globals.css`). Design tokens are in `lib/designTokens.ts` and `lib/themeColors.ts`. Prose styles for Markdown rendering are in `lib/markdownProse.ts`.

## Key conventions

- **No `mailto:` links** — always use `lib/contactHref.ts`, which returns the `/#contact` anchor
- **Server components by default** — only add `"use client"` when state or browser APIs are required
- **Path alias**: `@/*` maps to the project root
- **Next.js docs**: v16.2.6 has breaking changes vs training data — read `node_modules/next/dist/docs/` before adding new route, layout, or data-fetching patterns

## Environment variables

Copy `.env.example` → `.env.local`. ALTCHA is auto-bypassed on localhost when `ALTCHA_HMAC_SECRET` is unset. Set `ALTCHA_ENFORCE_LOCALHOST=true` to test the full flow locally.

| Group | Variables |
|-------|-----------|
| Contact form | `ALTCHA_HMAC_SECRET`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` |
| RAG | `DATABASE_URL`, `OPENAI_API_KEY`, `LLM_PROVIDER`, `RAG_MIN_SIMILARITY`, `RAG_TOP_K` |
| Live chat | `ABLY_API_KEY`, `LIVE_CHAT_ENABLED`, `LIVE_CHAT_EMAIL_NOTIFY` |
| Newsletter | `RESEND_NEWSLETTER_TOPIC_ID`, `RESEND_WEBHOOK_SECRET`, `NEWSLETTER_UNSUBSCRIBE_SECRET` |
| Admin | `ADMIN_SECRET` |
