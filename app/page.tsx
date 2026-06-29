import Link from "next/link";
import AboutHomeSection from "@/components/AboutHomeSection";
import BlogArticlesSection from "@/components/BlogArticlesSection";
import CareerHighlightsSection from "@/components/CareerHighlightsSection";
import HomeFeaturedProjects from "@/components/HomeFeaturedProjects";
// Swap to `@/components/HomeHero` for the two-layer hero (background + portrait cutout).
import HomeHeroV2 from "@/components/HomeHeroV2";
import HomeSurfaceStrip from "@/components/HomeSurfaceStrip";
import RevealStaggerRoot from "@/components/RevealStaggerRoot";
import SectionLabel from "@/components/SectionLabel";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WorkTogetherSection from "@/components/WorkTogetherSection";
import { skillGroups } from "@/data/homeSkills";
import { testimonials } from "@/data/testimonials";
import { createRevealOrders } from "@/lib/revealStagger";
import { getAllPostsMeta } from "@/lib/posts";

export default function Home() {
  const posts = getAllPostsMeta();
  const skillsRo = createRevealOrders();
  const blogRo = createRevealOrders();
  const hasTestimonials = testimonials.length > 0;

  return (
    <>
      {/* Full-viewport hero: its own overlays and semantics inside the component */}
      <HomeHeroV2 />

      {/* Strip 1 · soft · Portfolio (primary conversion asset, surfaced first) */}
      <HomeSurfaceStrip surface="soft" kind="firstAfterHero">
        <HomeFeaturedProjects />
      </HomeSurfaceStrip>

      {/* Strip 2 · base · Services */}
      <HomeSurfaceStrip surface="base" kind="continuation">
        <ServicesSection />
      </HomeSurfaceStrip>

      {/* Strip 3 · soft · About */}
      <HomeSurfaceStrip surface="soft" kind="continuation">
        <AboutHomeSection />
      </HomeSurfaceStrip>

      {/* Strip 4 · base · Career Highlights */}
      <HomeSurfaceStrip surface="base" kind="continuation">
        <CareerHighlightsSection />
      </HomeSurfaceStrip>

      {/* Strip 5 · soft · Skills */}
      <HomeSurfaceStrip surface="soft" kind="continuation">
        <RevealStaggerRoot as="section">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="reveal-stagger-item" style={skillsRo()}>
              <SectionLabel>My skills</SectionLabel>
              <h2
                className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
              >
                A practical stack for enterprise web and distributed backends.
              </h2>
            </div>
            <Link
              href="/experience"
              className="reveal-stagger-item text-sm font-bold text-accent hover:opacity-90 sm:shrink-0"
              style={skillsRo()}
            >
              View full experience -&gt;
            </Link>
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

      {/* Strip 6 · base · Blog */}
      <HomeSurfaceStrip surface="base" kind="continuation">
        <RevealStaggerRoot as="section">
          <BlogArticlesSection posts={posts} ro={blogRo} showBrowseLink layout="split" />
        </RevealStaggerRoot>
      </HomeSurfaceStrip>

      {/* Strip 7 · soft · Testimonials (only when real quotes exist) */}
      {hasTestimonials && (
        <HomeSurfaceStrip surface="soft" kind="continuation">
          <TestimonialsSection />
        </HomeSurfaceStrip>
      )}

      {/* Closing · Contact CTA — surface keeps soft/base alternation with/without testimonials */}
      <HomeSurfaceStrip surface={hasTestimonials ? "base" : "soft"} kind="closing">
        <WorkTogetherSection />
      </HomeSurfaceStrip>
    </>
  );
}
