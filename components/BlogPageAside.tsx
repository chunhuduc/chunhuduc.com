import BlogNewsletterForm from "@/components/BlogNewsletterForm";
import type { CSSProperties } from "react";

type Props = {
  ro?: () => CSSProperties;
  /** `panel`: raised card. `flat`: flush on soft stripe background. */
  variant?: "panel" | "flat";
  className?: string;
};

/** Right column on /blog — newsletter subscription. */
export default function BlogPageAside({ ro, variant = "panel", className = "" }: Props) {
  const shell =
    variant === "flat"
      ? ""
      : "rounded-2xl border border-white/10 bg-white/[0.04] p-8 sm:p-10 lg:sticky lg:top-28";

  return (
    <aside className={`${shell} ${className}`.trim()}>
      <h2
        className="reveal-stagger-item max-w-md text-[2rem] font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem]"
        style={ro?.()}
      >
        Subscribe to my newsletter today
      </h2>
      <p
        className="reveal-stagger-item mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
        style={ro?.()}
      >
        Occasional notes on architecture, integrations, and practical delivery patterns. No spam,
        only useful updates.
      </p>

      <BlogNewsletterForm className="reveal-stagger-item mt-12 max-w-xl" style={ro?.()} />
    </aside>
  );
}
