---
title: "A good software architect writes code"
date: "2026-05-19"
summary: "If your architect can't write a working prototype of what they're proposing, that's not architecture. That's guessing."
---

There is a certain type of architect almost every engineering team eventually encounters. They create polished diagrams. They speak confidently about scalability. They introduce trendy patterns and modern stacks. They run architecture meetings filled with abstractions and terminology. But ask them to build a working prototype of their own proposal, and suddenly things get vague.

That is usually the warning sign.

Because if an architect cannot implement the system they are designing, they are no longer operating from engineering reality. They are operating from assumptions.

## The problem with architects who stop coding

One of the most dangerous things that can happen to an engineer is becoming disconnected from implementation. Not because coding itself is the goal. But because software architecture is fundamentally about trade-offs, and trade-offs only become visible when you are close to real systems.

Once someone stops building software for long enough, their decision-making slowly changes. Complexity starts looking cheaper than it actually is. Operational burden becomes invisible. Developer friction disappears from consideration. Architecture starts becoming theoretical instead of practical. And that is when teams begin accumulating expensive problems disguised as “good engineering.”

I have seen this happen repeatedly.

Microservices introduced into products that barely had enough complexity to justify separate deployments. Kafka added into systems where a simple queue would have solved the problem. Kubernetes adopted by teams still struggling to maintain stable CI/CD pipelines. Overengineered abstraction layers built “for flexibility” even though no real flexibility was needed. Entire systems redesigned around patterns copied from large tech companies without understanding why those companies adopted them in the first place.

All of these decisions sounded smart. Most of them looked impressive in architecture reviews. Many of them became long-term maintenance burdens.

## The whiteboard illusion

The further someone gets from writing production code, the easier it becomes to design systems that only work well on whiteboards. Because diagrams hide pain.

Diagrams do not show:

- deployment failures,
- debugging complexity,
- onboarding difficulty,
- operational overhead,
- slow development velocity,
- or the cognitive load imposed on engineers every single day.

A distributed system can look elegant in a presentation while quietly multiplying engineering cost behind the scenes. An abstraction can appear “clean” architecturally while making the actual codebase harder to understand.

This is why hands-on experience matters so much.

When you still build software yourself, you develop an instinct for unnecessary complexity.

You stop asking: “Is this architecture impressive?” And start asking: “Can this team realistically operate this system for the next five years?” That is a much more valuable question.

## Great architects stay close to implementation

The best architects I have worked with were never disconnected from engineering work. They still wrote code. Not because they needed to micromanage developers. Not because they were trying to prove technical superiority. But because staying hands-on kept their judgment accurate.

They understood:

- how long implementation actually takes,
- where engineers lose time,
- which abstractions help,
- which abstractions hurt,
- and what operational pain feels like once systems hit production.

Before standardizing new ideas across teams, they tested them themselves. They built prototypes. They reviewed pull requests. They debugged incidents. They stayed close enough to reality that their architectural decisions were grounded in practical experience instead of theoretical optimism.

That difference matters more than people realize.

Because architecture is not only about choosing technologies. It is about understanding consequences.

## The real job of an architect

A surprising number of people think architecture is about designing “advanced” systems. It is not.

The real responsibility of architecture is reducing unnecessary complexity while allowing the business to move faster. That often means making decisions that look boring from the outside.

Sometimes the correct solution is a modular monolith. Sometimes the right answer is sticking with proven technology the team already understands. Sometimes the best architecture decision is avoiding a rewrite entirely.

Strong architects optimize for:

- maintainability,
- delivery speed,
- operational simplicity,
- developer productivity,
- and adaptability over time.

Weak architects optimize for novelty. That distinction becomes obvious after enough years in the industry.

## Why engineers trust hands-on architects

There is also a human side to this.

Engineers can immediately tell when technical leadership is disconnected from implementation reality. When architecture decisions come from people who no longer build software, teams often stop trusting the process. Discussions become ideological instead of practical. Trade-offs become abstract instead of measurable.

But architects who still code create a completely different environment. Because they understand the pain firsthand.

They know what is difficult. They know what is fragile. They know what will probably fail at 2 AM during an outage.

And when engineers realize the architect has personally dealt with those realities before, technical discussions become more collaborative and grounded.

The architect stops feeling like an authority figure drawing diagrams from above. They become part of the engineering process itself.

## Architecture is responsibility

At its core, architecture is not about creating diagrams. It is about owning outcomes.

A real architect is responsible not only for how a system looks during design reviews, but also for:

- how it behaves in production,
- how difficult it is to maintain,
- how quickly teams can build on top of it,
- and how much operational burden it creates over time.

That responsibility requires staying connected to implementation.

Because the moment you stop building software yourself, you slowly lose visibility into the true cost of your decisions. And eventually, architecture stops being engineering. It becomes speculation.

If your architect cannot build a working prototype of what they are proposing, they probably do not understand the trade-offs deeply enough yet.

And that is a dangerous place to make decisions from.
