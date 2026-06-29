import RevealStaggerRoot from "@/components/RevealStaggerRoot";
import SectionLabel from "@/components/SectionLabel";
import { createRevealOrders } from "@/lib/revealStagger";
import { services, type ServiceIcon } from "@/data/services";

function ServiceGlyph({ icon }: { icon: ServiceIcon }) {
  const stroke = {
    className: "h-6 w-6",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (icon) {
    case "architecture":
      return (
        <svg {...stroke} aria-hidden>
          <path d="M3 21h18" />
          <path d="M5 21V7l7-4 7 4v14" />
          <path d="M9 21v-6h6v6" />
        </svg>
      );
    case "delivery":
      return (
        <svg {...stroke} aria-hidden>
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        </svg>
      );
    case "web":
      return (
        <svg {...stroke} aria-hidden>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18M7 6.5h.01M10 6.5h.01" />
        </svg>
      );
    case "security":
      return (
        <svg {...stroke} aria-hidden>
          <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
  }
}

export default function ServicesSection() {
  const ro = createRevealOrders();

  return (
    <RevealStaggerRoot as="section" aria-labelledby="services-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="reveal-stagger-item" style={ro()}>
          <SectionLabel>How I can help</SectionLabel>
          <h2
            id="services-heading"
            className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            Ways we can work together.
          </h2>
        </div>
        <a
          href="#contact"
          className="reveal-stagger-item text-sm font-bold text-accent hover:opacity-90 sm:shrink-0"
          style={ro()}
        >
          Start a project -&gt;
        </a>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {services.map((s) => (
          <article
            key={s.title}
            className="reveal-stagger-item flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.35)] transition-[border-color,box-shadow] hover:border-accent/25 hover:shadow-[0_20px_56px_rgba(0,0,0,0.4)]"
            style={ro()}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/12 text-accent">
              <ServiceGlyph icon={s.icon} />
            </div>
            <h3 className="mt-4 text-lg font-bold leading-snug text-foreground">{s.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.description}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {s.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full bg-white/[0.08] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground/80"
                >
                  {t}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </RevealStaggerRoot>
  );
}
