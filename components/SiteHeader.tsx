"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
];

const SCROLL_DELTA = 8;
/** Mobile: user must scroll past this once before the dock is allowed near the top (hide on cold load only). */
const MOBILE_DOCK_PRIMED_AFTER_Y = 40;
/** Within this scroll offset from top, hero-style snap rules apply. */
const NEAR_TOP_PX = 72;

function scrollPastHero(): boolean {
  if (typeof window === "undefined") return false;
  return window.scrollY > window.innerHeight * 0.92;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [heroPassed, setHeroPassed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /** false = tucked above viewport while scrolling down; true = slid down flush with top */
  const [dockVisible, setDockVisible] = useState(true);
  /** Mobile-only: becomes true once scrollY crosses MOBILE_DOCK_PRIMED_AFTER_Y (session + route). */
  const [mobileDockPrimed, setMobileDockPrimed] = useState(false);
  const lastYRef = useRef(0);

  const syncHeroPassed = useCallback(() => {
    if (!onHome) {
      setHeroPassed(true);
      return;
    }
    setHeroPassed(scrollPastHero());
  }, [onHome]);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    const compact = window.matchMedia("(max-width: 767px)").matches;

    syncHeroPassed();

    if (menuOpen) {
      syncHeroPassed();
      lastYRef.current = y;
      return;
    }

    if (compact && y > MOBILE_DOCK_PRIMED_AFTER_Y && !mobileDockPrimed) {
      setMobileDockPrimed(true);
    }

    const primed = mobileDockPrimed || y > MOBILE_DOCK_PRIMED_AFTER_Y;
    const nearTop = y < NEAR_TOP_PX;

    if (compact && !primed && nearTop) {
      setDockVisible(false);
      lastYRef.current = y;
      return;
    }

    if (nearTop) {
      if (!compact || primed) setDockVisible(true);
      lastYRef.current = y;
      return;
    }

    const delta = y - lastYRef.current;
    lastYRef.current = y;

    if (delta > SCROLL_DELTA) setDockVisible(false);
    else if (delta < -SCROLL_DELTA) setDockVisible(true);
  }, [menuOpen, syncHeroPassed, mobileDockPrimed]);

  useEffect(() => {
    syncHeroPassed();

    const y = typeof window !== "undefined" ? window.scrollY : 0;
    lastYRef.current = y;

    const compact = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
    const primedRoute = y > MOBILE_DOCK_PRIMED_AFTER_Y;
    setMobileDockPrimed(primedRoute);

    if (!compact) {
      setDockVisible(y < NEAR_TOP_PX);
    } else if (y < NEAR_TOP_PX && !primedRoute) {
      setDockVisible(false);
    } else if (y < NEAR_TOP_PX) {
      setDockVisible(true);
    } else {
      setDockVisible(true);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll, pathname, syncHeroPassed]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) setDockVisible(true);
  }, [menuOpen]);

  const overHero =
    dockVisible &&
    !menuOpen &&
    onHome &&
    !heroPassed;

  /** Solid bar everywhere except transparent stretch over hero on home while docked visible */
  const solidBar =
    dockVisible &&
    (!onHome || heroPassed || menuOpen);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        dockVisible ? "translate-y-0" : "-translate-y-full pointer-events-none"
      }`}
    >
      <div
        className={`transition-[background-color,backdrop-filter,border-color] duration-300 ${
          solidBar ? "border-b border-line/80 bg-background/90 backdrop-blur-md" : "border-b border-transparent bg-transparent backdrop-blur-0"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className={`group flex items-center gap-2 text-sm font-semibold tracking-tight transition-colors ${
              overHero ? "text-hero-foreground hover:text-white" : "text-foreground hover:text-accent"
            }`}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                overHero ? "bg-accent text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)]" : "bg-accent/10 text-accent"
              }`}
              aria-hidden
            >
              {"</>"}
            </span>
            <span className="hidden sm:inline">chunhuduc.com</span>
          </Link>

          <nav
            className={`hidden flex-wrap items-center justify-end gap-x-6 gap-y-1 text-sm font-medium md:flex ${
              overHero ? "text-hero-muted" : "text-muted"
            }`}
            aria-label="Primary"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  overHero ? "transition-colors hover:text-hero-foreground" : "transition-colors hover:text-accent"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors md:hidden ${
              overHero ? "border-hero-line text-hero-foreground hover:bg-white/5" : "border-line text-foreground hover:bg-black/[0.04]"
            }`}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <span className="relative block h-3.5 w-5" aria-hidden>
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 rounded-full transition-all ${
                  overHero ? "bg-hero-foreground" : "bg-foreground"
                } ${menuOpen ? "top-1.5 rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-1.5 h-0.5 w-5 rounded-full transition-all ${
                  overHero ? "bg-hero-foreground" : "bg-foreground"
                } ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute left-0 top-3 h-0.5 w-5 rounded-full transition-all ${
                  overHero ? "bg-hero-foreground" : "bg-foreground"
                } ${menuOpen ? "top-1.5 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>

        {menuOpen ? (
          <div
            id="mobile-nav"
            className="border-t border-line/70 bg-background/95 backdrop-blur-md md:hidden"
          >
            <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6" aria-label="Mobile">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-3 text-base font-semibold text-foreground hover:bg-black/[0.04]"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
