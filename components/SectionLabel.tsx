import type { CSSProperties } from "react";

type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
};

/** Home section path label (canonical): `/ Section name` — accent, uppercase, tracking 0.2em */
export default function SectionLabel({ children, className = "", style }: SectionLabelProps) {
  return (
    <p
      className={`mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent/90 ${className}`.trim()}
      style={style}
    >
      / {children}
    </p>
  );
}
