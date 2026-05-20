import Image from "next/image";
import Link from "next/link";
import HeroFollowMe from "@/components/HeroFollowMe";
import { getAllPostsMeta } from "@/lib/posts";
import { profile } from "@/data/profile";

/** Single full-bleed hero photo (`public/hero-v6.jpg`). Swap `HomeHero` back in `app/page.tsx` for the two-layer variant. */
const HERO_IMAGE = "/hero-v6.jpg";

export default function HomeHeroV2() {
  const latestPost = getAllPostsMeta()[0];

  return (
    <section
      id="hero"
      className="relative flex min-h-dvh w-full max-lg:h-[100svh] max-lg:max-h-[100svh] flex-col overflow-hidden bg-hero-background text-hero-foreground [container-type:normal] lg:h-[100dvh] lg:max-h-[100dvh]"
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
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/50 to-black/25"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/35"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_30%,rgba(10,14,22,0.45),transparent_55%)]"
          aria-hidden
        />
      </div>

      <div className="hero-animate-text relative z-10 mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-4 sm:px-6 max-lg:h-full max-lg:justify-end max-lg:pb-6 max-lg:pt-[max(0.5rem,env(safe-area-inset-top,0px))] lg:justify-center lg:pb-16 lg:pt-28">
        <div className="grid min-h-0 w-full grid-cols-1 gap-12 max-lg:h-full max-lg:content-end max-lg:items-end max-lg:gap-0 lg:max-h-none lg:flex-1 lg:grid-cols-12 lg:content-normal lg:items-center lg:gap-8 xl:gap-10">
          <div className="order-1 flex w-full flex-col max-lg:justify-end lg:col-span-6 lg:justify-center">
            <div className="mb-5 h-1 w-12 rounded-full bg-hero-foreground sm:w-16" aria-hidden />
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-hero-foreground sm:text-5xl lg:text-[2.75rem] xl:text-[3.15rem]">
              I&apos;m Đức,
              <span className="mt-2 block text-2xl font-bold text-hero-muted sm:text-3xl">
                a Solution Architect and hands-on engineer.
              </span>
            </h1>
            <p className="mt-4 max-w-md text-sm font-semibold text-hero-foreground/90">
              {profile.subline}
            </p>
            <p className="mt-5 max-w-md text-base leading-relaxed text-hero-muted">{profile.headline}</p>
            <div className="hidden md:mt-10 md:block">
              <a
                href="#about"
                className="group inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-[0_8px_24px_rgba(31,75,130,0.4)] transition-transform hover:scale-105 hover:opacity-95"
                aria-label="Scroll to about section"
              >
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-y-0.5"
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
              </a>
            </div>
          </div>

          <aside className="order-2 hidden lg:col-span-6 lg:block lg:justify-self-end">
            <div className="space-y-0 lg:max-w-md lg:justify-self-end">
              <div className="border-b border-hero-line pb-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-hero-foreground">
                  About me
                </p>
                <p className="mt-3 text-sm leading-relaxed text-hero-muted line-clamp-4">{profile.aboutFocus}</p>
                <Link
                  href="/experience"
                  className="mt-5 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-hero-foreground transition-colors hover:text-accent"
                >
                  Learn more
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
