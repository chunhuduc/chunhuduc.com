---
title: "A good software architect still writes code"
date: "2026-05-19"
summary: "On staying close enough to the codebase that architecture stays honest: friction, cost, and what ‘rusty’ really means."
---

There is a particular kind of failure I have seen often enough that it deserves a name: the **rusty architect**. Not rusty because they forgot syntax, but because they stopped negotiating with the machine. They stopped feeling where the stack pushes back.

Once that distance grows, proposals stop being experiments and start being **assertions**. The slide deck looks decisive. The reality is a team carrying a design they cannot afford to maintain.

## How you lose touch without noticing

Architecture roles reward abstraction. You are measured on clarity of direction, stakeholder calm, and roadmap shape. Code is easy to treat as “someone else’s execution detail”. That incentive alone is enough for hands-on muscle to atrophy.

The problem is that **implementation cost is not a detail**. It is the sum of a thousand small things: cold starts, test seams, migration pain, observability holes, the way your ORM lies about batching. None of that survives a pure whiteboard pass. It lives in pull requests and production logs.

So when an architect has not shipped in years, they do not merely fall behind on frameworks. They lose intuition for **where friction clusters** in the systems they champion. They still speak confidently. The team pays the tax.

## What “guessing” looks like in the wild

None of this is about worshipping microservices or hating them. It is about **choosing from reputation instead of from trade-offs in your own context**.

I have seen teams pushed toward decomposition without a modular monolith phase to learn boundaries first. I have seen “clean” layering drawn as boxes when the product actually wanted **vertical slices** and clear ownership per capability. I have seen stacks picked after conference keynotes, or retained because they once looked modern, without anyone measuring what it costs *this year* to operate and hire for.

Each of these can be defended in a meeting. Few of them survive a prototype, a spike, and an honest week of pairing with the people who will own on-call.

That is the heart of it: **architecture without coding hours becomes procurement of patterns**. You borrow shapes from other people’s successes and skip the failure modes that made those shapes expensive.

## What the opposite looks like

The architects I still learn from are not celebrities. They are the ones who can **set the quality bar in code**: sketch the adapter, wire the first test harness, show how boundary seams should feel. They read reviews the way a carpenter checks joinery, not to police style but to sense structural stress.

They prototype before they commit the org. Not because every idea needs a throwaway repo, but because **uncertainty should be paid down in weeks**, not in a year of roadmap optimism.

They stay on speaking terms with the daily toolchain: the build, the deploy path, the observability that either proves the design or embarrasses it. They know what is easy, hard, or currently impossible with the stack on the floor, not the stack in a blog post.

That is how teams stay fast. The architect understands productivity as **shared reality**, not as throughput metrics on a dashboard.

## Architecture as owning outcomes

I use “owning outcomes” deliberately. A diagram that never ships is not architecture. It is a draft. Real architecture includes **deployment, rollback, and the second year of operation**. If you cannot rough out a credible path from idea to running software, you are not mediating risk; you are narrating it.

So yes: if someone cannot produce a working sketch of what they propose, you should treat the proposal as a hypothesis, not a decision. Hypotheses need evidence.

## Needs now, room to evolve

A closing bias I hold tightly: **architect from today’s constraints**, not from a fantasy roadmap. You can still leave seams for change. Extension points matter. What does not matter is gold-plating for futures you have not validated. The best systems I have touched grew because someone understood what to defer and what to nail down now.

That mindset pairs naturally with staying in code. Code is where “current needs” refuse to stay polite.

---

**Do I think an architect should write code?** For product-facing and platform work, yes, enough to stay calibrated, even if the ratio shifts as scope grows. The alternative is not evil; it is often slow, expensive, and lonelier for the team left holding the whiteboard.

If you disagree, I am curious *where* you think calibration should come from instead: which practices replace friction in the editor. I read replies.
