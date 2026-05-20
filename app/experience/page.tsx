import type { Metadata } from "next";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "Experience",
  description: "Employment history and delivery highlights for CHU NHƯ ĐỨC.",
};

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          Experience
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Snapshot aligned with the canonical CV in my private notes. Client names follow NDA-safe
          labels already used in public materials.
        </p>
      </header>

      <ol className="mt-12 space-y-12 border-l border-line pl-6 sm:pl-8">
        {experience.map((job) => (
          <li key={`${job.company}-${job.period}-${job.role}`} className="relative">
            <span className="absolute -left-[calc(0.25rem+1px)] top-2 h-3 w-3 -translate-x-[calc(50%+0.5px)] rounded-full bg-accent ring-4 ring-background sm:-left-[calc(0.5rem+1px)]" />
            <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">{job.role}</h2>
                <p className="text-base font-semibold text-accent">{job.company}</p>
              </div>
              <p className="text-sm font-medium text-muted">
                {job.period}
                {job.location ? ` · ${job.location}` : ""}
              </p>
            </div>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90">
              {job.highlights.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <section className="mt-16 rounded-xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
        <h2 className="text-lg font-bold text-foreground">Education</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Bachelor of Engineering in Software Engineering, FPT University (2009 to 2013),
          specialization in Embedded Systems.
        </p>
        <p className="mt-4 text-sm text-muted">
          Contact:{" "}
          <a className="font-medium text-accent hover:opacity-90" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </p>
      </section>
    </div>
  );
}
