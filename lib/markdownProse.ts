import { siteColors, siteFonts } from "@/lib/designTokens";

/**
 * Shared blog/markdown prose styling for web (Tailwind) and email (inline CSS).
 * Update this file when blog typography changes — both surfaces read from here.
 */
export const markdownProseClasses = {
  h1: "mt-10 text-3xl font-bold tracking-tight text-foreground first:mt-0",
  h2: "mt-9 text-2xl font-semibold tracking-tight text-foreground",
  h3: "mt-8 text-xl font-semibold text-foreground",
  p: "mt-4 leading-relaxed text-foreground/90",
  a: "font-medium text-accent underline decoration-line underline-offset-4 hover:opacity-90",
  ul: "mt-4 list-disc space-y-2 pl-6 text-foreground/90",
  ol: "mt-4 list-decimal space-y-2 pl-6 text-foreground/90",
  li: "leading-relaxed",
  blockquote: "mt-4 border-l-4 border-accent/40 pl-4 italic text-muted",
  codeInline:
    "rounded bg-white/12 px-1.5 py-0.5 text-[0.9em] font-medium text-foreground",
  codeBlock: "font-mono text-[0.9em]",
  pre: "mt-4 overflow-x-auto rounded-lg border border-white/12 bg-[#12141a] p-4 text-sm leading-relaxed text-foreground/95",
  hr: "my-10 border-line",
  tableWrapper: "mt-4 overflow-x-auto rounded-lg border border-line",
  table: "w-full border-collapse text-sm",
  th: "border-b border-line bg-white/[0.08] px-3 py-2 text-left font-semibold",
  td: "border-b border-line px-3 py-2 align-top text-foreground/90",
} as const;

const C = siteColors;
const mono = siteFonts.mono;

export function markdownProseEmailStyle(
  tagName: string,
  options?: { isBlockCode?: boolean },
): string | undefined {
  switch (tagName) {
    case "h1":
      return `margin:40px 0 0;font-size:28px;font-weight:800;line-height:1.12;letter-spacing:-0.02em;color:${C.foreground};`;
    case "h2":
      return `margin:36px 0 0;font-size:22px;font-weight:600;line-height:1.2;letter-spacing:-0.01em;color:${C.foreground};`;
    case "h3":
      return `margin:32px 0 0;font-size:18px;font-weight:600;line-height:1.3;color:${C.foreground};`;
    case "p":
      return `margin:16px 0 0;font-size:16px;line-height:1.65;color:${C.foregroundSoft};`;
    case "a":
      return `color:${C.accent};font-weight:500;text-decoration:underline;text-underline-offset:3px;`;
    case "ul":
    case "ol":
      return `margin:16px 0 0;padding-left:24px;font-size:16px;line-height:1.65;color:${C.foregroundSoft};`;
    case "li":
      return `margin:8px 0 0;line-height:1.65;`;
    case "blockquote":
      return `margin:16px 0 0;padding-left:16px;border-left:4px solid ${C.blockquoteBorder};font-style:italic;color:${C.muted};`;
    case "hr":
      return `margin:40px 0 0;border:none;border-top:1px solid ${C.line};`;
    case "strong":
      return `font-weight:700;color:${C.foreground};`;
    case "table":
      return `margin:16px 0 0;width:100%;border-collapse:collapse;font-size:14px;border:1px solid ${C.line};`;
    case "th":
      return `padding:8px 12px;text-align:left;font-weight:600;border-bottom:1px solid ${C.line};background:${C.tableHeaderBackground};color:${C.foreground};`;
    case "td":
      return `padding:8px 12px;vertical-align:top;border-bottom:1px solid ${C.line};color:${C.foregroundSoft};`;
    case "pre":
      return `margin:16px 0 0;padding:16px;border-radius:8px;border:1px solid ${C.preBorder};background:${C.preBackground};overflow-x:auto;white-space:pre-wrap;word-break:break-word;`;
    case "code":
      if (options?.isBlockCode) {
        return `font-family:${mono};font-size:14px;line-height:1.6;color:${C.foregroundPre};`;
      }
      return `font-family:${mono};font-size:0.9em;font-weight:500;background:${C.codeBackground};border-radius:4px;padding:2px 6px;color:${C.foreground};`;
    default:
      return undefined;
  }
}
