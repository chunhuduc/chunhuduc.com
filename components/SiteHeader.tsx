"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
];

function scrollPastHero(): boolean {
  if (typeof window === "undefined") return false;
  // Home hero is full viewport height: switch header after leaving that fold.
  return window.scrollY > window.innerHeight * 0.92;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [heroPassed, setHeroPassed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const updateHeroPassed = useCallback(() => {
    if (!onHome) {
      setHeroPassed(true);
      return;
    }
    setHeroPassed(scrollPastHero());
  }, [onHome]);

  useEffect(() => {
    updateHeroPassed();
    window.addEventListener("scroll", updateHeroPassed, { passive: true });
    window.addEventListener("resize", updateHeroPassed);
    return () => {
      window.removeEventListener("scroll", updateHeroPassed);
      window.removeEventListener("resize", updateHeroPassed);
    };
  }, [updateHeroPassed]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const dark = onHome && !heroPassed;

  return (
    <header
      className={
        dark
          ? "sticky top-0 z-50 border-b border-hero-line bg-hero-background/88 backdrop-blur-md"
          : "sticky top-0 z-50 border-b border-line/80 bg-background/90 backdrop-blur-md"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className={`group flex items-center gap-2 text-sm font-semibold tracking-tight transition-colors ${
            dark ? "text-hero-foreground hover:text-white" : "text-foreground hover:text-accent"
          }`}
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
              dark
                ? "bg-accent text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                : "bg-accent/10 text-accent"
            }`}
            aria-hidden
          >
            {"</>"}
          </span>
          <span className="hidden sm:inline">chunhuduc.com</span>
        </Link>

        <nav
          className={`hidden flex-wrap items-center justify-end gap-x-6 gap-y-1 text-sm font-medium md:flex ${
            dark ? "text-hero-muted" : "text-muted"
          }`}
          aria-label="Primary"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                dark
                  ? "transition-colors hover:text-hero-foreground"
                  : "transition-colors hover:text-accent"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors md:hidden ${
            dark
              ? "border-hero-line text-hero-foreground hover:bg-white/5"
              : "border-line text-foreground hover:bg-black/[0.04]"
          }`}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <span className="relative block h-3.5 w-5" aria-hidden>
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 rounded-full transition-all ${
                dark ? "bg-hero-foreground" : "bg-foreground"
              } ${menuOpen ? "top-1.5 rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-5 rounded-full transition-all ${
                dark ? "bg-hero-foreground" : "bg-foreground"
              } ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute left-0 top-3 h-0.5 w-5 rounded-full transition-all ${
                dark ? "bg-hero-foreground" : "bg-foreground"
              } ${menuOpen ? "top-1.5 -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {menuOpen ? (
        <div
          id="mobile-nav"
          className={`border-t md:hidden ${dark ? "border-hero-line bg-hero-background" : "border-line bg-background"}`}
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-3 text-base font-semibold ${
                  dark
                    ? "text-hero-foreground hover:bg-white/5"
                    : "text-foreground hover:bg-black/[0.04]"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
