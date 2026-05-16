import Link from "next/link";
import SectionLabel from "@/components/SectionLabel";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/homeSkills";
import { getAllPostsMeta } from "@/lib/posts";

const employers = [
  "FPT Software",
  "TTC Technology Solutions",
  "HOTTAB",
  "Appota",
  "OwlGaming Community",
];

export default function Home() {
  const posts = getAllPostsMeta().slice(0, 3);
  const featuredProjects = projects.slice(0, 3);
  const gh = profile.social.github?.trim();
  const li = profile.social.linkedin?.trim();

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
      {/* Hero */}
      <section className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end lg:gap-16">
        <div>
          <SectionLabel>Intro</SectionLabel>
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
            I&apos;m Đức,
            <span className="mt-2 block text-2xl font-bold text-muted sm:text-3xl">
              a Solution Architect and hands-on engineer.
            </span>
          </h1>
          <p className="mt-3 text-sm font-semibold text-foreground/80">{profile.name}</p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">{profile.subline}</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground/90">
            {profile.aboutLead}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
              href={`mailto:${profile.email}`}
            >
              Get in touch
            </a>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-full border border-line bg-white/70 px-6 py-3 text-sm font-bold text-foreground transition-colors hover:border-accent/40"
            >
              Browse projects
            </Link>
            {gh ? (
              <a
                className="inline-flex items-center justify-center rounded-full border border-transparent px-4 py-3 text-sm font-bold text-accent underline decoration-line underline-offset-4 hover:opacity-90"
                href={gh}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            ) : null}
            {li ? (
              <a
                className="inline-flex items-center justify-center rounded-full border border-transparent px-4 py-3 text-sm font-bold text-accent underline decoration-line underline-offset-4 hover:opacity-90"
                href={li}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            ) : null}
          </div>
        </div>

        <aside className="flex flex-col gap-4 rounded-2xl border border-line bg-white/70 p-6 shadow-[0_12px_40px_rgba(18,20,23,0.06)]">
          <div className="rounded-xl bg-accent/[0.06] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Currently
            </p>
            <p className="mt-2 text-sm font-semibold leading-snug text-foreground">
              Solution Architect at FPT Software
            </p>
            <p className="mt-1 text-sm text-muted">{profile.location}</p>
          </div>
          <p className="text-sm leading-relaxed text-muted">{profile.aboutFocus}</p>
          <Link
            href="/experience"
            className="text-sm font-bold text-accent hover:opacity-90"
          >
            Full timeline
          </Link>
        </aside>
      </section>

      {/* Stats */}
      <section className="mt-24 border-y border-line bg-white/40 py-16">
        <SectionLabel>About me</SectionLabel>
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,340px)] lg:gap-16">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              I&apos;ve been shipping production systems for over a decade.
            </h2>
            <p className="mt-5 max-w-prose text-base leading-relaxed text-muted">
              Architecture ownership plus hands-on delivery: stakeholder alignment, integration
              boundaries, and code-level execution when schedules are tight.
            </p>
            <Link
              href="/experience"
              className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-accent hover:opacity-90"
            >
              More about me
              <span aria-hidden> -&gt;</span>
            </Link>
          </div>
          <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-1 lg:gap-8">
            <div className="rounded-xl border border-line bg-background px-4 py-5">
              <dt className="text-4xl font-extrabold tabular-nums text-accent">13+</dt>
              <dd className="mt-2 text-sm font-semibold text-foreground">Years in software</dd>
            </div>
            <div className="rounded-xl border border-line bg-background px-4 py-5">
              <dt className="text-4xl font-extrabold tabular-nums text-accent">SA</dt>
              <dd className="mt-2 text-sm font-semibold text-foreground">
                Architect-led delivery today
              </dd>
            </div>
            <div className="rounded-xl border border-line bg-background px-4 py-5">
              <dt className="text-4xl font-extrabold tabular-nums text-accent">900</dt>
              <dd className="mt-2 text-sm font-semibold text-foreground">
                TOEIC (English depth)
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Previously worked with
          </p>
          <div className="mt-4 flex flex-wrap gap-x-10 gap-y-3">
            {employers.map((name) => (
              <span
                key={name}
                className="text-sm font-bold tracking-tight text-foreground/70"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="mt-24">
        <SectionLabel>My skills</SectionLabel>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            A practical stack for enterprise web and distributed backends.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g) => (
            <article
              key={g.title}
              className="flex flex-col rounded-2xl border border-line bg-white/60 p-6 shadow-[0_8px_24px_rgba(18,20,23,0.04)] transition-shadow hover:shadow-[0_12px_32px_rgba(18,20,23,0.07)]"
            >
              <div className="mb-4 h-1 w-10 rounded-full bg-accent" aria-hidden />
              <h3 className="text-lg font-bold text-foreground">{g.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{g.blurb}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-line/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground/75"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Portfolio */}
      <section className="mt-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel>My portfolio</SectionLabel>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Recent initiative snapshots (NDA-safe).
            </h2>
          </div>
          <Link
            href="/projects"
            className="text-sm font-bold text-accent hover:opacity-90 sm:shrink-0"
          >
            Browse all projects -&gt;
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((p) => (
            <article
              key={p.title}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white/70 shadow-[0_10px_36px_rgba(18,20,23,0.05)]"
            >
              <div className="h-2 bg-gradient-to-r from-accent to-accent/40 transition-opacity group-hover:opacity-90" />
              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap gap-2">
                  {p.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-line/80 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="mt-4 text-lg font-bold leading-snug text-foreground">{p.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{p.summary}</p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
                  {p.href ? (
                    <a className="text-accent hover:opacity-90" href={p.href}>
                      Repository
                    </a>
                  ) : null}
                  {p.demoUrl ? (
                    <a className="text-accent hover:opacity-90" href={p.demoUrl}>
                      Demo
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Blog */}
      <section className="mt-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel>Blog & articles</SectionLabel>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Latest notes on delivery and architecture.
            </h2>
          </div>
          <Link href="/blog" className="text-sm font-bold text-accent hover:opacity-90">
            Browse all -&gt;
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.length === 0 ? (
            <p className="text-sm text-muted md:col-span-3">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-line bg-white/60 p-6 shadow-[0_8px_24px_rgba(18,20,23,0.04)] transition-all hover:border-accent/25 hover:shadow-[0_14px_40px_rgba(18,20,23,0.08)]"
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  {post.date}{" "}
                  <span className="text-accent">/ Articles</span>
                </p>
                <h3 className="mt-3 text-lg font-bold leading-snug text-foreground group-hover:text-accent">
                  {post.title}
                </h3>
                {post.summary ? (
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{post.summary}</p>
                ) : null}
                <span className="mt-4 text-sm font-bold text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  Read -&gt;
                </span>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-28 rounded-3xl bg-accent px-8 py-14 text-center text-white shadow-[0_20px_50px_rgba(31,75,130,0.35)] sm:px-12">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Interested in working together?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/85">
          Short intro plus ideal timelines helps me reply faster. For enterprise work, expect crisp
          scope and realistic milestones.
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-extrabold text-accent transition-opacity hover:opacity-95"
        >
          Let&apos;s talk -&gt;
        </a>
      </section>
    </div>
  );
}
