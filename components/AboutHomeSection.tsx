"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";

const employers = [
  "FPT Software",
  "TTC Technology Solutions",
  "HOTTAB",
  "Appota",
  "OwlGaming Community",
] as const;

/**
 * Layout matches the home “About” reference: two-column summary + stats, then employer strip.
 * Stagger: left column top-to-bottom, then right column, then bottom strip (top then row).
 */
export default function AboutHomeSection() {
  const rootRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      id="about"
      className={`scroll-mt-24 py-20 ${inView ? "about-section-in-view" : ""}`}
      aria-labelledby="about-heading"
    >
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-x-16 lg:gap-y-0">
        <div className="min-w-0">
          <p className="about-reveal mb-3 text-xs font-bold uppercase tracking-[0.22em]" data-order="1">
            <span className="text-accent">/</span> About me
          </p>
          <h2
            id="about-heading"
            className="about-reveal text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.125rem]"
            data-order="2"
          >
            I&apos;ve been shipping production systems for over a decade.
          </h2>
          <p
            className="about-reveal mt-6 max-w-xl text-base leading-relaxed text-muted"
            data-order="3"
          >
            {profile.aboutLead}
          </p>
          <Link
            href="/experience"
            className="about-reveal mt-8 inline-flex items-center gap-1 text-sm font-bold text-foreground underline decoration-foreground/35 underline-offset-[6px] transition-opacity hover:opacity-90"
            data-order="4"
          >
            More about me
            <span aria-hidden> -&gt;</span>
          </Link>
        </div>

        <div className="flex min-w-0 flex-col gap-10">
          <div className="about-reveal flex flex-wrap gap-x-12 gap-y-8" data-order="5">
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
          <p className="about-reveal text-sm leading-relaxed text-muted" data-order="6">
            {profile.aboutFocus}
          </p>
        </div>
      </div>

      <div className="about-reveal mt-16 border-t border-line/80 pt-12" data-order="7">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">
          Previously worked on
        </p>
      </div>
      <ul
        className="about-reveal mt-8 flex list-none flex-wrap gap-x-12 gap-y-6 p-0 sm:gap-x-14"
        data-order="8"
      >
        {employers.map((name) => (
          <li key={name} className="flex items-center gap-3">
            <span
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] ring-1 ring-white/[0.12]"
              aria-hidden
            >
              <span className="h-2 w-2 rotate-45 rounded-[1px] bg-white/70" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-foreground/90">{name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
