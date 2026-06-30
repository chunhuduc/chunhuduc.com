import type { Metadata } from "next";
import RevealStaggerRoot from "@/components/RevealStaggerRoot";
import { createRevealOrders } from "@/lib/revealStagger";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected architecture and engineering work, public code where available.",
};

export default function ProjectsPage() {
  const roMain = createRevealOrders();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <RevealStaggerRoot>
        <header className="max-w-3xl">
          <h1
            className="reveal-stagger-item text-4xl font-extrabold tracking-tight text-foreground"
            style={roMain()}
          >
            Projects
          </h1>
          <p className="reveal-stagger-item mt-3 text-base leading-relaxed text-muted" style={roMain()}>
            Initiative-level summaries suitable for public portfolios. Code lives in GitHub repos linked
            below when available.
          </p>
        </header>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {projects.map((p) => (
            <article
              key={p.title}
              className="reveal-stagger-item flex flex-col rounded-xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_12px_36px_rgba(0,0,0,0.25)]"
              style={roMain()}
            >
              <h2 className="text-lg font-bold text-foreground">{p.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.summary}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-white/[0.1] px-3 py-1 text-xs font-medium text-foreground/85"
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
      </RevealStaggerRoot>
    </div>
  );
}
