import type { ReactNode } from "react";
import Link from "next/link";
import ProjectArchitecture from "@/components/ProjectArchitecture";
import ProjectMotif from "@/components/ProjectMotif";
import RevealStaggerRoot from "@/components/RevealStaggerRoot";
import SectionLabel from "@/components/SectionLabel";
import { createRevealOrders } from "@/lib/revealStagger";
import { projects, type ProjectCard } from "@/data/projects";

function GithubIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-white/[0.08] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted">
      {children}
    </span>
  );
}

/** Pill shown over a card banner, e.g. "Public repo" or "NDA-protected". */
function BannerBadge({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
      {icon}
      {children}
    </span>
  );
}

/**
 * Card banner visual. Priority: real screenshot banner -> architecture diagram
 * -> motif. Public repos get a "Public repo" pill; everything else (NDA work)
 * gets an "NDA-protected" pill, since the diagram already conveys the build.
 */
function CardVisual({
  project,
  className,
  glyphClassName,
}: {
  project: ProjectCard;
  className?: string;
  glyphClassName?: string;
}) {
  const isPublic = Boolean(project.href);
  const badge = isPublic ? (
    <BannerBadge icon={<GithubIcon />}>Public repo</BannerBadge>
  ) : (
    <BannerBadge icon={<LockIcon />}>NDA-protected</BannerBadge>
  );

  if (project.bannerImage) {
    return (
      <div className={`relative ${className ?? ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.bannerImage}
          alt={`${project.title} preview`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute left-4 top-4 z-10">{badge}</div>
      </div>
    );
  }

  if (project.architecture) {
    return (
      <ProjectArchitecture
        architecture={project.architecture}
        className={className}
        badge={badge}
      />
    );
  }

  return (
    <ProjectMotif motif={project.motif!} className={className} glyphClassName={glyphClassName} />
  );
}

export default function HomeFeaturedProjects() {
  const ro = createRevealOrders();
  // projects is pre-sorted by complexityScore descending (see data/projects.ts); index 0 is the hero card.
  const [featured, ...rest] = projects;

  return (
    <RevealStaggerRoot as="section" aria-labelledby="portfolio-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="reveal-stagger-item" style={ro()}>
          <SectionLabel>Selected work</SectionLabel>
          <h2
            id="portfolio-heading"
            className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            Projects that show how I deliver.
          </h2>
          <p className="mt-2 text-sm text-muted">
            Public code where I can, NDA-safe summaries where I can&apos;t — outcomes over client names.
          </p>
        </div>
        <Link
          href="/projects"
          className="reveal-stagger-item text-sm font-bold text-accent hover:opacity-90 sm:shrink-0"
          style={ro()}
        >
          Browse all projects -&gt;
        </Link>
      </div>

      {/* Featured card — thumbnail-driven, full width */}
      {featured && (
        <article
          className="reveal-stagger-item group mt-12 overflow-hidden rounded-2xl border border-accent/25 bg-white/[0.04] shadow-[0_18px_56px_rgba(0,0,0,0.38)] transition-[border-color,box-shadow] hover:border-accent/45 hover:shadow-[0_24px_64px_rgba(0,0,0,0.45)] lg:grid lg:grid-cols-2"
          style={ro()}
        >
          <div className="relative h-52 lg:h-full lg:min-h-[20rem]">
            <CardVisual
              project={featured}
              className="h-full w-full"
              glyphClassName="h-56 w-56"
            />
          </div>
          <div className="flex flex-col p-6 sm:p-8">
            <div className="flex flex-wrap gap-2">
              {featured.tags.slice(0, 5).map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
            <h3 className="mt-4 text-xl font-bold leading-snug text-foreground sm:text-2xl">
              {featured.title}
            </h3>
            {featured.outcome && (
              <p className="mt-2 text-sm font-semibold text-foreground/85">{featured.outcome}</p>
            )}
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{featured.summary}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {featured.href && (
                <a
                  href={featured.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-foreground/[0.08] px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-foreground/[0.14] hover:text-accent"
                >
                  <GithubIcon />
                  View on GitHub
                </a>
              )}
              {featured.demoUrl && (
                <a
                  href={featured.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-accent/30 px-4 py-2.5 text-sm font-bold text-accent transition-colors hover:border-accent/60 hover:bg-accent/[0.06]"
                >
                  Live demo
                  <ExternalIcon />
                </a>
              )}
            </div>
          </div>
        </article>
      )}

      {/* Remaining cards — thumbnail banner on top */}
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => {
          const hasLinks = p.href || p.demoUrl;
          return (
            <article
              key={p.title}
              className="reveal-stagger-item group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_18px_48px_rgba(0,0,0,0.32)] transition-[border-color,box-shadow] hover:border-accent/20 hover:shadow-[0_22px_56px_rgba(0,0,0,0.38)]"
              style={ro()}
            >
              <div className="h-40 overflow-hidden">
                <CardVisual
                  project={p}
                  className="h-40 transition-transform duration-500 group-hover:scale-[1.03]"
                  glyphClassName="h-40 w-40"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap gap-2">
                  {p.tags.slice(0, 3).map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
                <h3 className="mt-4 text-lg font-bold leading-snug text-foreground">{p.title}</h3>
                {p.outcome && (
                  <p className="mt-2 text-sm font-semibold text-foreground/85">{p.outcome}</p>
                )}
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.summary}</p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {hasLinks ? (
                    <>
                      {p.href && (
                        <a
                          href={p.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:opacity-80"
                        >
                          <GithubIcon />
                          GitHub
                        </a>
                      )}
                      {p.demoUrl && (
                        <a
                          href={p.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:opacity-80"
                        >
                          Demo
                          <ExternalIcon />
                        </a>
                      )}
                    </>
                  ) : (
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-muted/80">
                      Architecture overview
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </RevealStaggerRoot>
  );
}
