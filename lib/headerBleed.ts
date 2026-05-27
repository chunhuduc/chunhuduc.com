/** Element the fixed header samples for transparent overlay (home hero, blog index first band, …). */
export const HEADER_BLEED_ID = "header-bleed";

/** Top inset so band content clears the fixed header when SiteShell offset is omitted. */
export const HEADER_CLEARANCE_CLASS = "pt-[4.75rem] sm:pt-[4.875rem]";

/** Routes where the header overlays the first content band instead of pushing it down. */
export function pathnameUsesHeaderBleed(pathname: string): boolean {
  return pathname === "/" || pathname === "/blog";
}

/** Intersect [viewport top, viewport top + stripPx] with bleed rect; coverage → transparent header. */
export function headerSurfaceAlphaForBleed(stripPx: number, bleedId = HEADER_BLEED_ID): number {
  if (typeof document === "undefined" || stripPx <= 0) return 1;
  const bleed = document.getElementById(bleedId);
  if (!bleed) return 1;
  const h = bleed.getBoundingClientRect();
  const overlap = Math.max(0, Math.min(stripPx, h.bottom) - Math.max(0, h.top));
  const coverFrac = Math.min(Math.max(overlap / stripPx, 0), 1);
  return 1 - coverFrac;
}
