import Image from "next/image";
import Link from "next/link";
import { profile } from "@/data/profile";

export default function HomeHero() {
  const gh = profile.social.github?.trim();
  const li = profile.social.linkedin?.trim();
  const portrait = profile.heroPortrait.trim();
  const heroBg = profile.heroBackground.trim();

  return (
    <section
      id="hero"
      className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-hero-background text-hero-foreground [container-type:size] lg:h-[100dvh] lg:max-h-[100dvh]"
      aria-label="Hero"
    >
      {/* Layer 1: background photo */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {heroBg ? (
          <Image
            src={heroBg}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            aria-hidden
          />
        ) : (
          <div className="absolute inset-0 bg-hero-background" aria-hidden />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/80"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_80%_-20%,rgba(31,75,130,0.35),transparent_55%)]"
          aria-hidden
        />
      </div>

      {/* Layer 2: portrait band height from globals; contain + bottom keeps full silhouette (avoid cover+bottom which clips the head). */}
      {portrait ? (
        <div className="hero-animate-portrait pointer-events-none absolute inset-0 z-[1]">
          <div className="hero-portrait-slot absolute bottom-0 left-1/2 w-[min(99vw,1400px)] -translate-x-1/2">
            <div className="relative h-full w-full">
              <Image
                src={portrait}
                alt={`${profile.name}, professional portrait`}
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 99vw, 1400px"
                className="object-contain object-bottom"
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* Layer 3: copy + links, vertically centered in remaining viewport */}
      <div className="hero-animate-text relative z-10 mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:pb-16 lg:pt-28">
        <div className="grid min-h-0 grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-8 xl:gap-10">
          <div className="order-1 flex flex-col justify-center lg:col-span-4">
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
            <div className="mt-10">
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

          {/* Center lane: flow spacer + placeholder when no portrait; Layer 2 draws on top when set */}
          <div
            className={`order-2 flex w-full justify-center lg:col-span-4 lg:items-center ${
              portrait ? "min-h-[36dvh] lg:min-h-0" : "min-h-[260px] lg:min-h-[min(58dvh,620px)]"
            }`}
          >
            {!portrait ? (
              <div className="relative flex w-full max-w-[400px] flex-col items-end justify-center lg:h-full">
                <div className="relative h-[min(52dvh,480px)] w-full sm:h-[min(50dvh,520px)] lg:h-[min(58dvh,620px)] lg:max-h-none">
                  <div
                    className="flex h-full w-full flex-col items-center justify-end rounded-2xl border border-dashed border-hero-line bg-black/30 px-6 pb-16 pt-12 text-center backdrop-blur-sm"
                    role="img"
                    aria-label="Portrait placeholder: add heroPortrait in data/profile.ts"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-hero-muted">
                      Photo
                    </span>
                    <p className="mt-2 max-w-[200px] text-sm leading-snug text-hero-muted">
                      Drop a cutout PNG or WebP in <code className="text-hero-foreground/80">public/</code>,
                      then set <code className="text-hero-foreground/80">heroPortrait</code> in{" "}
                      <code className="text-hero-foreground/80">data/profile.ts</code>.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <aside className="order-3 lg:col-span-4">
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
              </div>
              <div className="pt-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-hero-foreground">
                  Follow me
                </p>
                <div className="mt-4 flex flex-wrap gap-4">
                  <a
                    className="text-hero-foreground transition-opacity hover:opacity-80"
                    href={`mailto:${profile.email}`}
                    aria-label="Email"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </a>
                  {gh ? (
                    <a
                      className="text-hero-foreground transition-opacity hover:opacity-80"
                      href={gh}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-1.215-.12-.258-1.23-1.11.12-2.535 1.005-.315 3.3 1.2 3.3 1.2 1.5-.42 3.105-.42 4.605 0 0 0 2.295-1.515 3.3-1.2 1.35 1.425.24 2.277-.12 2.535.765 1.17 1.23 2.91 1.23 1.215 0 4.635-2.79 5.625-5.475.435.825.69 1.815.69 2.805 0 2.025-.015 3.67-.015 4.155 0 .435.33.96.825.78C20.565 21.795 24 17.31 24 12 24 5.37 18.63 0 12 0z" />
                      </svg>
                    </a>
                  ) : null}
                  {li ? (
                    <a
                      className="text-hero-foreground transition-opacity hover:opacity-80"
                      href={li}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
