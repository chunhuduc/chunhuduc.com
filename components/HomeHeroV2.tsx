import Image from "next/image";
import Link from "next/link";
import HeroFollowMe from "@/components/HeroFollowMe";
import HeroTypewriter from "@/components/HeroTypewriter";
import { HEADER_BLEED_ID } from "@/lib/headerBleed";
import { getAllPostsMeta } from "@/lib/posts";
import { profile } from "@/data/profile";
import { CONTACT_FORM_HREF } from "@/lib/contactHref";

/** Single full-bleed hero photo (`public/hero-v6.jpg`). Swap `HomeHero` back in `app/page.tsx` for the two-layer variant. */
const HERO_IMAGE = "/hero-v6.jpg";

export default function HomeHeroV2() {
  const latestPost = getAllPostsMeta()[0];

  return (
    <section
      id={HEADER_BLEED_ID}
      className="relative flex h-svh min-h-svh w-full flex-col overflow-hidden bg-hero-background text-hero-foreground [container-type:normal]"
      aria-label="Hero"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          unoptimized
          priority
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden
        />
        {/* Cinematic text-side scrim */}
        <div aria-hidden className="absolute inset-0" style={{background: "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.22) 62%, rgba(0,0,0,0.06) 100%)"}} />
        <div aria-hidden className="absolute inset-0" style={{background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 42%, rgba(0,0,0,0.18) 100%)"}} />
        <div aria-hidden className="absolute inset-0" style={{background: "radial-gradient(ellipse 55% 70% at 12% 50%, rgba(5,8,16,0.55), transparent 60%)"}} />
        {/* Right column text scrim */}
        <div aria-hidden className="absolute inset-0" style={{background: "linear-gradient(to left, rgba(5,8,18,0.72) 0%, rgba(5,8,18,0.55) 35%, transparent 62%)"}} />
        {/* Film grain */}
        <div className="hero-noise" aria-hidden />
      </div>

      <div className="hero-animate-text relative z-10 mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-4 sm:px-6 max-lg:h-full max-lg:justify-end max-lg:pb-6 max-lg:pt-[max(0.5rem,env(safe-area-inset-top,0px))] lg:justify-center lg:pb-16 lg:pt-28">
        <div className="grid min-h-0 w-full grid-cols-1 gap-12 max-lg:h-full max-lg:content-end max-lg:items-end max-lg:gap-0 lg:max-h-none lg:flex-1 lg:grid-cols-12 lg:content-normal lg:items-center lg:gap-8 xl:gap-10">
          <div className="order-1 flex w-full flex-col max-lg:justify-end lg:col-span-6 lg:justify-center">
            <div className="mb-5 h-1 w-12 rounded-full bg-hero-foreground sm:w-16" aria-hidden />
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-hero-foreground sm:text-5xl lg:text-[2.75rem] xl:text-[3.15rem]">
              I&apos;m Đức,
              <span className="mt-2 block text-2xl font-bold text-hero-muted sm:text-3xl">
                a <HeroTypewriter />.
              </span>
            </h1>
            <p className="mt-4 max-w-md text-sm font-semibold text-hero-foreground/90">
              {profile.subline}
            </p>
            <p className="mt-5 max-w-md text-base leading-relaxed text-hero-muted">{profile.headline}</p>
            <div className="mt-6">
              <a
                href={CONTACT_FORM_HREF}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_20px_rgba(31,75,130,0.35)] transition-all hover:scale-[1.02] hover:opacity-95"
              >
                Work together
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            <div className="hidden md:mt-10 md:block">
              <a
                href="#about"
                className="group inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_8px_24px_rgba(31,75,130,0.4)] transition-transform hover:scale-[1.04] hover:opacity-95 hero-cta-pulse"
                aria-label="Scroll to about section"
              >
                <span className="hero-scroll-chevron-bounce" aria-hidden>
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </a>
            </div>
          </div>

          <aside className="order-2 hidden lg:col-span-6 lg:block lg:justify-self-end">
            <div className="space-y-0 lg:max-w-md lg:justify-self-end">
              <div className="border-b border-hero-line pb-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-hero-foreground">
                  What I offer
                </p>
                <p className="mt-3 text-sm leading-relaxed text-hero-muted line-clamp-4">
                  Solution architecture from whiteboard to production — composable web platforms, distributed systems, and secure media delivery. Hands-on across the full stack with a track record at enterprise scale.
                </p>
                <Link
                  href="/experience"
                  className="mt-5 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-hero-foreground transition-colors hover:text-accent"
                >
                  See my work
                  <span aria-hidden> -&gt;</span>
                </Link>
              </div>
              <div className="border-b border-hero-line py-8">
                {latestPost ? (
                  <>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-hero-foreground leading-snug line-clamp-4">
                      {latestPost.title}
                    </p>
                    {latestPost.summary ? (
                      <p className="mt-3 text-sm leading-relaxed text-hero-muted line-clamp-4">
                        {latestPost.summary}
                      </p>
                    ) : null}
                    <Link
                      href={`/blog/${latestPost.slug}`}
                      className="mt-5 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-hero-foreground transition-colors hover:text-accent"
                    >
                      Read post
                      <span aria-hidden> -&gt;</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-hero-foreground">
                      My work
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-hero-muted">
                      Initiative snapshots and stack notes (NDA-safe). See projects for how engagement,
                      ownership, and delivery show up in practice.
                    </p>
                    <Link
                      href="/projects"
                      className="mt-5 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-hero-foreground transition-colors hover:text-accent"
                    >
                      Browse portfolio
                      <span aria-hidden> -&gt;</span>
                    </Link>
                  </>
                )}
              </div>
              <div className="pt-8">
                <HeroFollowMe variant="hero" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
