---
name: sync-projects
description: Regenerate data/projects.ts from each public repo's README showcase block. Use after running /inspect-project (SA workspace) on a repo, when project cards on the homepage or /projects look stale, or when a repo's README showcase block was edited directly.
---

# Sync project cards from repo READMEs

`data/projects.ts` is a generated file. Its content comes from the
`<!-- chunhuduc.com:showcase:start -->` block in each public repo's own
`README.md` (format documented in
`docs/projects/SHOWCASE-FORMAT.md` in the SA workspace, written by that
workspace's `/inspect-project` skill), merged with the hand-authored
NDA-only entries in `data/projects-nda.ts`.

## Step 1 — run the sync

```
npm run projects:sync
```

This fetches each target repo's README via the GitHub API, extracts and
validates the showcase block, and overwrites `data/projects.ts`. Target
repos are the `REPO_TARGETS` list in `scripts/sync-projects.ts` — if a new
public repo's project card should appear on the site, add it there first.

If a repo has no showcase block yet, the script logs a warning and skips
it (existing entries for other repos still update normally). Tell the user
which repos were skipped and that `/inspect-project` needs to run for
those first.

## Step 2 — review before committing

The script overwrites `data/projects.ts` directly. Run `git diff
data/projects.ts` and read it — this is generated but human-reviewed, not
blindly auto-committed. Check for:

- Summaries/tags that read oddly or aren't NDA-safe (shouldn't happen for
  public repos, but verify).
- `complexityScore` values that seem off, since that drives card order and
  which card becomes the homepage hero (highest score = index 0).

## Step 3 — verify visually

`npm run dev`, check `/` (Selected work section) and `/projects`. Confirm
the new/updated card renders correctly — diagram if `architecture` was
present in the block, motif icon otherwise.

## Notes

- Never hand-edit `data/projects.ts` — changes get clobbered on the next
  sync. Edit the source repo's README instead (via `/inspect-project` in
  the SA workspace), or edit `data/projects-nda.ts` directly for
  NDA-protected projects with no public repo.
- `GITHUB_TOKEN` in `.env.local` is optional but raises GitHub API rate
  limits if syncing many repos at once.
