export type ProjectMotifIcon = "automation" | "web" | "streaming" | "creator";

export type ProjectMotifData = {
  from: string;
  to: string;
  icon: ProjectMotifIcon;
};

function Glyph({ icon, className }: { icon: ProjectMotifIcon; className?: string }) {
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (icon) {
    case "automation":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <rect x="7" y="7" width="10" height="10" rx="1.5" />
          <rect x="10" y="10" width="4" height="4" rx="0.5" />
          <path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3" />
        </svg>
      );
    case "web":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z" />
        </svg>
      );
    case "streaming":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <circle cx="12" cy="12" r="2.4" />
          <path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5" />
        </svg>
      );
    case "creator":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M7 5v14M17 5v14M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4" />
        </svg>
      );
  }
}

/**
 * NDA-safe generated visual for a project card. Renders a branded gradient
 * with a faint dot grid, a soft highlight, and a large domain glyph.
 * Sizing is controlled by the caller via `className` (e.g. height/aspect).
 */
export default function ProjectMotif({
  motif,
  className,
  glyphClassName = "h-44 w-44",
}: {
  motif: ProjectMotifData;
  className?: string;
  glyphClassName?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{ background: `linear-gradient(135deg, ${motif.from}, ${motif.to})` }}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.85) 1px, transparent 1px)",
          backgroundSize: "15px 15px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 85% at 78% 18%, rgba(255,255,255,0.28), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(8,11,18,0.45), transparent 55%)" }}
      />
      <div className="absolute -bottom-7 -right-6 text-white/25">
        <Glyph icon={motif.icon} className={glyphClassName} />
      </div>
    </div>
  );
}
