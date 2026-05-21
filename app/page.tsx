import Link from "next/link";
import AboutHomeSection from "@/components/AboutHomeSection";
// Swap to `@/components/HomeHero` for the two-layer hero (background + portrait cutout).
import HomeHeroV2 from "@/components/HomeHeroV2";
import HomeSurfaceStrip from "@/components/HomeSurfaceStrip";
import RevealStaggerRoot from "@/components/RevealStaggerRoot";
import SectionLabel from "@/components/SectionLabel";
import WorkTogetherSection from "@/components/WorkTogetherSection";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/homeSkills";
import { createRevealOrders } from "@/lib/revealStagger";
import { getAllPostsMeta } from "@/lib/posts";

export default function Home() {
  const posts = getAllPostsMeta().slice(0, 3);
  const featuredProjects = projects.slice(0, 3);

  const skillsRo = createRevealOrders();
  const portfolioRo = createRevealOrders();
  const blogRo = createRevealOrders();

  return (
    <>
      {/* Full-viewport hero: its own overlays and semantics inside the component */}
      <HomeHeroV2 />

      {/* Strip 1 · soft · About */}
      <HomeSurfaceStrip surface="soft" kind="firstAfterHero">
        <AboutHomeSection />
      </HomeSurfaceStrip>

      {/* Strip 2 · base · Skills */}
      <HomeSurfaceStrip surface="base" kind="continuation">
        <RevealStaggerRoot as="section">
          <SectionLabel className="reveal-stagger-item" style={skillsRo()}>
            My skills
          </SectionLabel>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2
              className="reveal-stagger-item max-w-xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
              style={skillsRo()}
            >
              A practical stack for enterprise web and distributed backends.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((g) => (
              <article
                key={g.title}
                className="reveal-stagger-item flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.35)] transition-[border-color,box-shadow] hover:border-accent/25 hover:shadow-[0_20px_56px_rgba(0,0,0,0.4)]"
                style={skillsRo()}
              >
                <div className="mb-4 h-1 w-10 rounded-full bg-accent" aria-hidden />
                <h3 className="text-lg font-bold text-foreground">{g.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{g.blurb}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {g.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full bg-white/[0.08] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground/80"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </RevealStaggerRoot>
      </HomeSurfaceStrip>

      {/* Strip 3 · soft · Portfolio */}
      <HomeSurfaceStrip surface="soft" kind="continuation">
        <RevealStaggerRoot as="section">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="reveal-stagger-item" style={portfolioRo()}>
              <SectionLabel>My portfolio</SectionLabel>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Recent initiative snapshots (NDA-safe).
              </h2>
            </div>
            <Link
              href="/projects"
              className="reveal-stagger-item text-sm font-bold text-accent hover:opacity-90 sm:shrink-0"
              style={portfolioRo()}
            >
              Browse all projects -&gt;
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((p) => (
              <article
                key={p.title}
                className="reveal-stagger-item group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_18px_48px_rgba(0,0,0,0.32)] transition-[border-color,box-shadow] hover:border-accent/20"
                style={portfolioRo()}
              >
                <div className="h-2 bg-gradient-to-r from-accent to-accent/40 transition-opacity group-hover:opacity-90" />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap gap-2">
                    {p.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-white/[0.08] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted"
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
        </RevealStaggerRoot>
      </HomeSurfaceStrip>

      {/* Strip 4 · base · Blog */}
      <HomeSurfaceStrip surface="base" kind="continuation">
        <RevealStaggerRoot as="section">
          <div className="flex flex-col gap-14 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-14 xl:gap-x-[4.25rem]">
            <header className="max-lg:max-w-xl lg:col-span-5">
              <SectionLabel className="reveal-stagger-item" style={blogRo()}>
                Blog & articles
              </SectionLabel>
              <h2
                className="reveal-stagger-item text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
                style={blogRo()}
              >
                Check out my latest articles and tutorials
              </h2>
              <Link
                href="/blog"
                className="reveal-stagger-item mt-8 inline-block text-sm font-bold text-accent transition-opacity hover:opacity-90"
                style={blogRo()}
              >
                Browse all articles -&gt;
              </Link>
            </header>

            <div className="lg:col-span-7">
              {posts.length === 0 ? (
                <p className="reveal-stagger-item text-sm text-muted lg:pt-1" style={blogRo()}>
                  No posts yet.
                </p>
              ) : (
                <ul className="m-0 list-none space-y-0 p-0">
                  {posts.map((post, idx) => (
                    <li
                      key={post.slug}
                      className={`reveal-stagger-item ${idx > 0 ? "border-t border-[#3f444e] pt-10 mt-10" : "lg:pt-1"}`}
                      style={blogRo()}
                    >
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
                          {post.date}{" "}
                          <span className="text-accent">/ Articles</span>
                        </p>
                        <h3 className="mt-3 text-lg font-bold uppercase leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent lg:text-xl">
                          {post.title}
                        </h3>
                        {post.summary ? (
                          <p className="mt-4 text-sm leading-relaxed text-muted">{post.summary}</p>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </RevealStaggerRoot>
      </HomeSurfaceStrip>

      {/* Strip 5 · soft · Contact CTA */}
      <HomeSurfaceStrip surface="base" kind="closing">
        <WorkTogetherSection />
      </HomeSurfaceStrip>
    </>
  );
}
