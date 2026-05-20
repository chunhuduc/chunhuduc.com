import Link from "next/link";
import AboutHomeSection from "@/components/AboutHomeSection";
// Swap to `@/components/HomeHero` for the two-layer hero (background + portrait cutout).
import HomeHeroV2 from "@/components/HomeHeroV2";
import RevealStaggerRoot from "@/components/RevealStaggerRoot";
import SectionLabel from "@/components/SectionLabel";
import { profile } from "@/data/profile";
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
  const ctaRo = createRevealOrders();

  return (
    <>
      <HomeHeroV2 />

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6">
        <AboutHomeSection />

        {/* Skills */}
        <RevealStaggerRoot as="section" className="mt-24">
          <SectionLabel className="reveal-stagger-item mb-3" style={skillsRo()}>
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

        {/* Portfolio */}
        <RevealStaggerRoot as="section" className="mt-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="reveal-stagger-item" style={portfolioRo()}>
              <SectionLabel className="mb-3">My portfolio</SectionLabel>
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

        {/* Blog */}
        <RevealStaggerRoot as="section" className="mt-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="reveal-stagger-item" style={blogRo()}>
              <SectionLabel className="mb-3">Blog & articles</SectionLabel>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Latest notes on delivery and architecture.
              </h2>
            </div>
            <Link
              href="/blog"
              className="reveal-stagger-item text-sm font-bold text-accent hover:opacity-90"
              style={blogRo()}
            >
              Browse all -&gt;
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {posts.length === 0 ? (
              <p className="reveal-stagger-item text-sm text-muted md:col-span-3" style={blogRo()}>
                No posts yet.
              </p>
            ) : (
              posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="reveal-stagger-item group flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.35)] transition-all hover:border-accent/25 hover:shadow-[0_22px_56px_rgba(0,0,0,0.42)]"
                  style={blogRo()}
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
        </RevealStaggerRoot>

        {/* CTA */}
        <RevealStaggerRoot
          as="section"
          className="mt-28 rounded-3xl bg-accent px-8 py-14 text-center text-white shadow-[0_24px_64px_rgba(110,168,255,0.22)] sm:px-12"
        >
          <h2
            className="reveal-stagger-item text-2xl font-extrabold tracking-tight sm:text-3xl"
            style={ctaRo()}
          >
            Interested in working together?
          </h2>
          <p
            className="reveal-stagger-item mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/85"
            style={ctaRo()}
          >
            Short intro plus ideal timelines helps me reply faster. For enterprise work, expect crisp
            scope and realistic milestones.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="reveal-stagger-item mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-extrabold text-accent transition-opacity hover:opacity-95"
            style={ctaRo()}
          >
            Let&apos;s talk -&gt;
          </a>
        </RevealStaggerRoot>
      </div>
    </>
  );
}
