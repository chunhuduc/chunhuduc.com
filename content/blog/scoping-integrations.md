---
title: "How I scope third-party integrations"
date: "2026-05-17"
summary: "Start from contracts and failure modes, not framework churn."
---

When a client asks for “API integration”, I treat the first milestone as **discovery plus a written contract sketch**:

1. **Identity and auth**: who calls whom, refresh flows, least-privilege keys, rotation.
2. **Idempotency**: webhooks, retries, duplicate deliveries, replay safety.
3. **Observability**: structured logs, correlation ids, alert thresholds.

Only after that do we pick libraries or polish UX. If you want a code tie-in later, add `repo` or `relatedRepos` to this post frontmatter as `owner/repo` paths.
