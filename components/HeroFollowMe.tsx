import SocialLinksRow from "@/components/SocialLinksRow";

/**
 * Heading “Contact me” plus shared icon row. Row-only logic lives in `SocialLinksRow`.
 * Row styling hooks: `.contact-social-links` in `globals.css` (sibling fade, lift).
 */
export default function HeroFollowMe({
  variant = "hero",
  className = "",
}: {
  variant?: "hero" | "section";
  className?: string;
}) {
  const headingClassName =
    variant === "hero"
      ? "text-[11px] font-bold uppercase tracking-[0.2em] text-hero-foreground"
      : "text-xs font-bold uppercase tracking-[0.18em] text-foreground";

  const rowToneClass =
    variant === "hero" ? "text-hero-foreground" : "text-foreground";

  return (
    <div className={className}>
      <p className={headingClassName}>Contact me</p>
      <SocialLinksRow className={`mt-5 ${rowToneClass}`} />
    </div>
  );
}
