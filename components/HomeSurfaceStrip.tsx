import type { ReactNode } from "react";

/** Full-bleed surfaces under the hero: soft vs base alternate on the homepage. */
const SURFACE = {
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

const STRIP_VERTICAL: Record<HomeSurfaceStripKind, string> = {
  firstAfterHero: "lg:py-32 md:py-24 sm:py-16 py-12",
  continuation: "lg:py-32 md:py-24 sm:py-16 py-12",
  closing: "lg:py-32 md:py-24 sm:py-16 py-12",
};

type Props = {
  surface: HomeSurface;
  kind: HomeSurfaceStripKind;
  children: ReactNode;
};

/**
 * Homepage colored bands plus one shared gutter system for horizontal and vertical rhythm.
 */
export default function HomeSurfaceStrip({ surface, kind, children }: Props) {
  const inner = ["mx-auto max-w-6xl px-4 sm:px-6", STRIP_VERTICAL[kind]].join(" ");

  return (
    <div className={`${SURFACE[surface]} text-foreground`}>
      <div className={inner}>{children}</div>
    </div>
  );
}
