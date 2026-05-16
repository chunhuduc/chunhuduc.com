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
| `data/profile.ts` | Name, headline, contact, social URLs |
| `data/experience.ts` | Employment entries |
| `data/projects.ts` | Initiative cards (NDA-safe blurbs) |
| `data/repos.ts` | GitHub showcase rows |

## Deploy (Vercel)

1. Push this repository to GitHub (public is typical for portfolio source).
2. **New Project** in Vercel, import the repo, **Root Directory** `.`, Framework Preset Next.js.
3. **Domains**: add **chunhuduc.com**, then apply the DNS records your registrar shows from Vercel.
4. Pick one canonical URL (**apex** or **www**) and set the opposite redirect in Vercel.

Optional later: set **`GITHUB_TOKEN`** in Vercel if you add build-time GitHub metadata fetching.

## Fonts

**Manrope** is loaded with `latin` and `vietnamese` subsets via `next/font/google` in `app/layout.tsx`.
