"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

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
/** Below this surface alpha while on hero, use light inks (readable on hero image). */
const HERO_INK_SURFACE_MAX = 0.52;

/** Intersect [viewport top, viewport top + stripPx] with hero rect; hero coverage → transparent header. Returns 1 = full surface, 0 = none. */
function headerSurfaceAlphaForHero(stripPx: number): number {
  if (typeof document === "undefined" || stripPx <= 0) return 1;
  const hero = document.getElementById("hero");
  if (!hero) return 1;
  const h = hero.getBoundingClientRect();
  const overlap = Math.max(0, Math.min(stripPx, h.bottom) - Math.max(0, h.top));
  const coverFrac = Math.min(Math.max(overlap / stripPx, 0), 1);
  return 1 - coverFrac;
}

function isCompactHeaderChrome(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  /** false = slid up out of view while scrolling down; true = docked flush with top */
  const [dockVisible, setDockVisible] = useState(false);
  /** After first paint / route sync, allow transform transition (avoids intro slide on desktop). */
  const [dockMotionEnabled, setDockMotionEnabled] = useState(false);
  /** Mobile-only: becomes true once scrollY crosses MOBILE_DOCK_PRIMED_AFTER_Y (session + route). */
  const [mobileDockPrimed, setMobileDockPrimed] = useState(false);
  /** 1 = opaque white bar chrome; on home start at 0 to avoid a white flash before hero overlap is measured. */
  const [surfaceAlpha, setSurfaceAlpha] = useState(() => (pathname === "/" ? 0 : 1));
  const headerRef = useRef<HTMLElement | null>(null);
  const stripHRef = useRef(72);
  const lastAlphaRef = useRef(-1);
  const lastYRef = useRef(0);
  const menuOpenRef = useRef(menuOpen);
  menuOpenRef.current = menuOpen;

  const publishSurfaceAlpha = useCallback((forceMenuOpaque: boolean) => {
    let next = 1;
    if (forceMenuOpaque) {
      /* Open mobile menu needs solid bar readability */
      next = 1;
    } else if (isCompactHeaderChrome()) {
      /* Compact: toolbar stays clear until menu expands */
      next = 0;
    } else if (!onHome) {
      next = 1;
    } else {
      const strip = Math.ceil(headerRef.current?.getBoundingClientRect().height ?? stripHRef.current);
      stripHRef.current = Math.max(strip, 48);
      next = headerSurfaceAlphaForHero(stripHRef.current);
    }
    if (Math.abs(next - lastAlphaRef.current) < 0.012) return;
    lastAlphaRef.current = next;
    setSurfaceAlpha(next);
  }, [onHome]);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    const compact = window.matchMedia("(max-width: 767px)").matches;
    const mo = menuOpenRef.current;

    publishSurfaceAlpha(mo);

    if (mo) {
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
  }, [mobileDockPrimed, publishSurfaceAlpha]);

  /**
   * Runs before browser paint so mobile cold-load (dock tucked) never flashes “visible header” frame.
   */
  useLayoutEffect(() => {
    setDockMotionEnabled(false);
    lastAlphaRef.current = -1;

    const y = window.scrollY;
    lastYRef.current = y;

    publishSurfaceAlpha(menuOpenRef.current);

    const compact = window.matchMedia("(max-width: 767px)").matches;
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

    const raf = requestAnimationFrame(() => setDockMotionEnabled(true));

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll, pathname, publishSurfaceAlpha]);

  /** Observe header height for hero-strip overlap sampling */
  useLayoutEffect(() => {
    const node = headerRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;

    const sync = () => {
      stripHRef.current = Math.max(48, Math.ceil(node.getBoundingClientRect().height));
      publishSurfaceAlpha(menuOpenRef.current);
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(node);
    return () => ro.disconnect();
  }, [pathname, menuOpen, publishSurfaceAlpha]);

  useLayoutEffect(() => {
    lastAlphaRef.current = -1;
    publishSurfaceAlpha(menuOpenRef.current);
  }, [menuOpen, publishSurfaceAlpha]);

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

  /** Logo on home scrolls back to top; other routes navigate via href. */
  const handleBrandClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== "/") return;
      e.preventDefault();
      setMenuOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [pathname],
  );

  const a = Math.min(Math.max(surfaceAlpha, 0), 1);
  /** Light text on hero; dark text once bar is visibly white / mobile menu forces opaque bar. */
  const heroInk = onHome && !menuOpen && a < HERO_INK_SURFACE_MAX;

  return (
    <header
      ref={headerRef}
      style={{
        transform: dockVisible ? "translateY(0)" : "translateY(-100%)",
        transition: dockMotionEnabled
          ? "transform 300ms cubic-bezier(0.22, 1, 0.36, 1), background-color 360ms cubic-bezier(0.22, 1, 0.36, 1), border-color 360ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 360ms cubic-bezier(0.22, 1, 0.36, 1)"
          : "background-color 360ms cubic-bezier(0.22, 1, 0.36, 1), border-color 360ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 360ms cubic-bezier(0.22, 1, 0.36, 1)",
        backgroundColor: `rgba(10, 11, 15, ${0.92 * a})`,
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: `rgba(255, 255, 255, ${0.1 * a})`,
        boxShadow: a > 0.04 ? `0 1px 0 rgb(255 255 255 / ${0.05 * a})` : "none",
      }}
      className={`fixed inset-x-0 z-[100] transition-colors duration-300 ease-out ${
        heroInk ? "text-white" : "text-foreground"
      } ${dockVisible ? "" : "pointer-events-none"}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          onClick={handleBrandClick}
          className={`group flex items-center gap-2 text-sm font-semibold tracking-tight transition-colors ${
            heroInk ? "text-white drop-shadow-[0_2px_6px_rgb(0_0_0/0.55)] hover:text-white/95" : "text-foreground hover:text-accent"
          }`}
        >
          <span
            className={
              heroInk
                ? "flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-white/[0.22] bg-white/14 shadow-[0_8px_20px_rgb(0_0_0/0.38)]"
                : "flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-white/12 bg-accent/18"
            }
            aria-hidden
          >
            <Image
              src="/favi.svg"
              alt=""
              width={32}
              height={32}
              className="h-6 w-6 object-contain"
              priority
            />
          </span>
          <span className="hidden sm:inline">chunhuduc.com</span>
        </Link>

        <nav
          className={`hidden flex-wrap items-center justify-end gap-x-6 gap-y-1 text-sm font-medium md:flex ${
            heroInk
              ? "text-white [&_a]:text-white [&_a]:drop-shadow-[0_2px_6px_rgb(0_0_0/0.5)] [&_a]:transition-opacity [&_a:hover]:opacity-95"
              : "text-muted [&_a]:transition-colors [&_a:hover]:text-accent"
          }`}
          aria-label="Primary"
        >
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors md:hidden ${
            heroInk
              ? "border-white/35 text-white drop-shadow-[0_2px_6px_rgb(0_0_0/0.5)] hover:bg-white/[0.1]"
              : "border-white/14 text-foreground hover:bg-white/[0.06]"
          }`}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <span className="relative block h-3.5 w-5" aria-hidden>
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 rounded-full transition-all ${
                heroInk ? "bg-white" : "bg-foreground"
              } ${menuOpen ? "top-1.5 rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-5 rounded-full transition-all ${
                heroInk ? "bg-white" : "bg-foreground"
              } ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute left-0 top-3 h-0.5 w-5 rounded-full transition-all ${
                heroInk ? "bg-white" : "bg-foreground"
              } ${menuOpen ? "top-1.5 -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {menuOpen ? (
        <div
          id="mobile-nav"
          className="border-t border-white/10 bg-[#0c0e14] shadow-[0_16px_40px_rgba(0,0,0,0.55)] md:hidden"
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-base font-semibold text-foreground hover:bg-white/[0.06]"
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
