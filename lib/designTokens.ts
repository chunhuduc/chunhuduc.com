/**
 * Single source of truth for site colors and typography used in JS (email, header blend).
 * Keep `app/globals.css` `:root` hex values in sync with `siteColors`.
 */
export const siteColors = {
  background: "#1b1f24",
  foreground: "#f4f4f5",
  foregroundSoft: "rgba(244, 244, 245, 0.9)",
  foregroundPre: "rgba(244, 244, 245, 0.95)",
  muted: "#9ca3af",
  accent: "#6ea8ff",
  line: "rgba(255, 255, 255, 0.1)",
  preBackground: "#12141a",
  codeBackground: "rgba(255, 255, 255, 0.12)",
  tableHeaderBackground: "rgba(255, 255, 255, 0.08)",
  preBorder: "rgba(255, 255, 255, 0.12)",
  blockquoteBorder: "rgba(110, 168, 255, 0.4)",
} as const;

/** RGB triple for rgba overlays (e.g. header blend). Derived from `siteColors.background`. */
export const BACKGROUND_RGB = [27, 31, 36] as const;

export const siteFonts = {
  sansEmail:
    "'Manrope', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
} as const;
