type SectionLabelProps = {
  children: React.ReactNode;
};

/** Webflow-style path label: `/ Section name` */
export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent/90">
      / {children}
    </p>
  );
}
