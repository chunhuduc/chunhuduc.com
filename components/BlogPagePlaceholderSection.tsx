import type { CSSProperties } from "react";
import SectionLabel from "@/components/SectionLabel";

type Props = {
  ro?: () => CSSProperties;
};

/** Placeholder band below the blog index — swap for tags, series, or newsletter later. */
export default function BlogPagePlaceholderSection({ ro }: Props) {
  return (
    <div className="mx-auto max-w-3xl">
      <SectionLabel className="reveal-stagger-item" style={ro?.()}>
        More to explore
      </SectionLabel>
      <h2
        className="reveal-stagger-item text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
        style={ro?.()}
      >
        Topics and series coming soon
      </h2>
      <p
        className="reveal-stagger-item mt-5 text-base leading-relaxed text-muted"
        style={ro?.()}
      >
        This section is reserved for tags, article series, or a newsletter archive. Check back as
        the blog grows.
      </p>
    </div>
  );
}
