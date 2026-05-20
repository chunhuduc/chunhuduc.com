import Image from "next/image";
import Link from "next/link";
import HeroFollowMe from "@/components/HeroFollowMe";
import RevealStaggerRoot from "@/components/RevealStaggerRoot";
import { createRevealOrders } from "@/lib/revealStagger";
import { profile } from "@/data/profile";

const employers = [
  { name: "FPT Software", logoSrc: "/employers/fpt-software.png" },
  { name: "TTC Technology Solutions", logoSrc: "/employers/ttc.png" },
  { name: "HOTTAB", logoSrc: "/employers/hottab.png" },
  { name: "Appota", logoSrc: "/employers/appota.png" },
  { name: "OwlGaming Community", logoSrc: "/employers/owlgaming.png" },
] as const;

/**
 * Layout matches the home “About” reference: two-column summary + stats, then employer strip.
 * Scroll reveal timing matches hero-style motion via `RevealStaggerRoot` + `.reveal-stagger-item`.
 */
export default function AboutHomeSection() {
  const ro = createRevealOrders();

  return (
    <RevealStaggerRoot
      as="section"
      id="about"
      className="scroll-mt-24 py-20"
      aria-labelledby="about-heading"
    >
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-x-16 lg:gap-y-0">
        <div className="min-w-0">
          <p
            className="reveal-stagger-item mb-3 text-xs font-bold uppercase tracking-[0.22em]"
            style={ro()}
          >
            <span className="text-accent">/</span> About me
          </p>
          <h2
            id="about-heading"
            className="reveal-stagger-item text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.125rem]"
            style={ro()}
          >
            I&apos;ve been shipping production systems for over a decade.
          </h2>
          <p
            className="reveal-stagger-item mt-6 max-w-xl text-base leading-relaxed text-muted"
            style={ro()}
          >
            {profile.aboutLead}
          </p>
          <Link
            href="/experience"
            className="reveal-stagger-item mt-8 inline-flex items-center gap-1 text-sm font-bold text-foreground underline decoration-foreground/35 underline-offset-[6px] transition-opacity hover:opacity-90"
            style={ro()}
          >
            More about me
            <span aria-hidden> -&gt;</span>
          </Link>
        </div>

        <div className="flex min-w-0 flex-col gap-10">
          <div className="reveal-stagger-item flex flex-wrap gap-x-12 gap-y-8" style={ro()}>
            <div className="flex min-w-[12rem] items-baseline gap-3">
              <span className="text-5xl font-extrabold tabular-nums tracking-tight text-foreground sm:text-[3.25rem]">
                13+
              </span>
              <span className="max-w-[9.5rem] text-sm font-medium leading-snug text-muted">
                Years of experience
              </span>
            </div>
            <div className="flex min-w-[12rem] items-baseline gap-3">
              <span className="text-5xl font-extrabold tabular-nums tracking-tight text-foreground sm:text-[3.25rem]">
                900
              </span>
              <span className="max-w-[9.5rem] text-sm font-medium leading-snug text-muted">
                TOEIC (English depth)
              </span>
            </div>
          </div>
          <p className="reveal-stagger-item text-sm leading-relaxed text-muted" style={ro()}>
            {profile.aboutFocus}
          </p>
        </div>
      </div>

      <div className="reveal-stagger-item mt-16 border-t border-line/80 pt-12" style={ro()}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">
          Previously worked on
        </p>
      </div>
      <ul
        className="reveal-stagger-item mt-8 flex list-none flex-col gap-6 p-0 md:flex-row md:flex-wrap md:gap-x-14 md:gap-y-6"
        style={ro()}
      >
        {employers.map(({ name, logoSrc }) => (
          <li key={name} className="flex w-full items-center gap-3 md:w-auto">
            <span className="employer-logo-chip relative inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden p-1.5">
              <Image
                src={logoSrc}
                alt=""
                fill
                sizes="44px"
                className="object-contain p-0.5"
              />
            </span>
            <span className="text-sm font-semibold tracking-tight text-foreground/90">{name}</span>
          </li>
        ))}
      </ul>

      <div
        className="reveal-stagger-item mt-16 border-t border-line/80 pt-12 lg:hidden"
        style={ro()}
      >
        <HeroFollowMe variant="section" />
      </div>
    </RevealStaggerRoot>
  );
}
