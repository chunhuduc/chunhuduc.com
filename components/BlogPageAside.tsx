import Link from "next/link";
import type { CSSProperties } from "react";
import { CONTACT_FORM_HREF } from "@/lib/contactHref";

type Props = {
  ro?: () => CSSProperties;
  /** `panel`: raised card. `flat`: flush on soft stripe background. */
  variant?: "panel" | "flat";
  className?: string;
};

/** Right column on /blog — contact CTA styled like a newsletter panel. */
export default function BlogPageAside({ ro, variant = "panel", className = "" }: Props) {
  const shell =
    variant === "flat"
      ? "lg:sticky lg:top-28 lg:py-2"
      : "rounded-2xl border border-white/10 bg-white/[0.04] p-8 sm:p-10 lg:sticky lg:top-28";

  return (
    <aside className={`${shell} ${className}`.trim()}>
      <h2
        className="reveal-stagger-item text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-[1.65rem]"
        style={ro?.()}
      >
        Interested in working together?
      </h2>
      <p
        className="reveal-stagger-item mt-4 text-sm leading-relaxed text-muted sm:text-base"
        style={ro?.()}
      >
        Architecture, integrations, or hands-on delivery — a short intro and realistic timelines help me
        reply faster.
      </p>
      <div className="reveal-stagger-item mt-8 border-t border-line pt-6" style={ro?.()}>
        <Link
          href={CONTACT_FORM_HREF}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-accent transition-opacity hover:opacity-90"
        >
          Get in touch
          <span aria-hidden>→</span>
        </Link>
      </div>
    </aside>
  );
}
