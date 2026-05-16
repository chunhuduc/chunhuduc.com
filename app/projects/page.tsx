import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { repos } from "@/data/repos";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected architecture and engineering work (NDA-safe summaries) plus GitHub showcase.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Projects</h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Initiative-level summaries suitable for public portfolios. Code lives in GitHub repos linked
          below when available.
        </p>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {projects.map((p) => (
          <article
            key={p.title}
            className="flex flex-col rounded-xl border border-line bg-white/60 p-6 shadow-[0_8px_24px_rgba(18,20,23,0.04)]"
          >
            <h2 className="text-lg font-bold text-foreground">{p.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.summary}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full bg-line/80 px-3 py-1 text-xs font-medium text-foreground/80"
                >
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
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
          </article>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">GitHub showcase</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted">
          Curated repositories (`data/repos.ts`). Add entries as you publish repos; optional build-time
          GitHub metadata can come later.
        </p>
        {repos.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-line bg-white/40 px-4 py-8 text-center text-sm text-muted">
            No public repos listed yet. Push code you want to highlight, then add rows to{" "}
            <code className="rounded bg-line/60 px-1 font-mono text-xs">data/repos.ts</code>.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {repos.map((r) => (
              <article
                key={r.title}
                className="rounded-xl border border-line bg-white/60 p-6 shadow-[0_8px_24px_rgba(18,20,23,0.04)]"
              >
                <h3 className="text-lg font-bold text-foreground">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{r.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {r.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full bg-line/80 px-3 py-1 text-xs font-medium text-foreground/80"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                  {r.githubUrl ? (
                    <a className="text-accent hover:opacity-90" href={r.githubUrl}>
                      GitHub
                    </a>
                  ) : null}
                  {r.demoUrl ? (
                    <a className="text-accent hover:opacity-90" href={r.demoUrl}>
                      Demo
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
