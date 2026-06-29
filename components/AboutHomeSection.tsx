import Image from "next/image";
import DownloadCvButton from "@/components/DownloadCvButton";
import HeroFollowMe from "@/components/HeroFollowMe";
import RevealStaggerRoot from "@/components/RevealStaggerRoot";
import SectionLabel from "@/components/SectionLabel";
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
      className="scroll-mt-24"
      aria-labelledby="about-heading"
    >
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-x-16 lg:gap-y-0">
        <div className="min-w-0">
          <SectionLabel className="reveal-stagger-item" style={ro()}>
            About me
          </SectionLabel>
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
          <DownloadCvButton
            className="reveal-stagger-item group mt-8 inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-accent/50 hover:text-accent"
            style={ro()}
          >
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download CV
          </DownloadCvButton>
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
            <div className="flex min-w-[13rem] items-baseline gap-3">
              <span className="text-5xl font-extrabold tabular-nums tracking-tight text-foreground sm:text-[3.25rem]">
                6+
              </span>
              <span className="max-w-[9.5rem] text-sm font-medium leading-snug text-muted">
                Industries and team contexts
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
        className="reveal-stagger-item mt-8 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-5"
        style={ro()}
      >
        {employers.map(({ name, logoSrc }) => (
          <li
            key={name}
            className="group flex flex-col items-center gap-3.5 px-2 py-4 text-center transition-all duration-300 hover:-translate-y-1"
          >
            <span className="employer-logo-chip relative inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden p-1.5 transition-transform duration-300 group-hover:scale-105">
              <Image
                src={logoSrc}
                alt=""
                fill
                sizes="48px"
                className="object-contain p-0.5"
              />
            </span>
            <span className="text-xs font-semibold leading-snug tracking-tight text-foreground/90">
              {name}
            </span>
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
