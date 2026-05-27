import type { ReactNode } from "react";

/** Full-bleed surfaces under the hero: soft vs base alternate on the homepage. */
export const SURFACE = {
  soft: "bg-section-soft",
  base: "bg-background",
} as const;

export type HomeSurface = keyof typeof SURFACE;

/**
 * Vertical rhythm for centered column (`max-w-6xl`):
 * - `firstAfterHero`: Matches the legacy About stack (`pt-12` + inner `py-20` ~= `pt-32`), plus a matching bottom gutter.
 * - `continuation`: Same top inset at every subsequent band boundary.
 * - `closing`: Same top inset plus extra bottom space before the footer.
 */
export type HomeSurfaceStripKind = "firstAfterHero" | "continuation" | "closing";

export const STRIP_VERTICAL: Record<HomeSurfaceStripKind, string> = {
  firstAfterHero: "lg:py-32 md:py-24 sm:py-16 py-12",
  continuation: "lg:py-32 md:py-24 sm:py-16 py-12",
  closing: "lg:py-32 md:py-24 sm:py-16 py-12",
};

/** Less top inset when a band follows a hero/header (e.g. blog article body). */
const STRIP_VERTICAL_COMPACT_TOP: Record<HomeSurfaceStripKind, string> = {
  firstAfterHero: "pb-12 pt-6 sm:pb-16 sm:pt-8 md:pb-24 md:pt-12 lg:pb-32 lg:pt-16",
  continuation: "pb-12 pt-6 sm:pb-16 sm:pt-8 md:pb-24 md:pt-12 lg:pb-32 lg:pt-16",
  closing: "pb-12 pt-6 sm:pb-16 sm:pt-8 md:pb-24 md:pt-12 lg:pb-32 lg:pt-16",
};

/** Optional 1.5px rule between stacked bands (off by default). */
export const SURFACE_BAND_TOP_SEPARATOR = "surface-band-border-top";

type Props = {
  surface: HomeSurface;
  kind: HomeSurfaceStripKind;
  /** Tighter top padding; bottom rhythm unchanged. */
  compactTop?: boolean;
  /** Top edge rule when the band follows a same-surface or split block above. */
  topSeparator?: boolean;
  children: ReactNode;
};

/**
 * Homepage colored bands plus one shared gutter system for horizontal and vertical rhythm.
 */
export default function HomeSurfaceStrip({
  surface,
  kind,
  compactTop,
  topSeparator = false,
  children,
}: Props) {
  const vertical = compactTop ? STRIP_VERTICAL_COMPACT_TOP[kind] : STRIP_VERTICAL[kind];
  const inner = ["mx-auto max-w-6xl px-4 sm:px-6", vertical].join(" ");
  const outer = [SURFACE[surface], "text-foreground", topSeparator ? SURFACE_BAND_TOP_SEPARATOR : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={outer}>
      <div className={inner}>{children}</div>
    </div>
  );
}
