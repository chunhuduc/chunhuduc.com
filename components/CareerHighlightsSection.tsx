import Link from "next/link";
import RevealStaggerRoot from "@/components/RevealStaggerRoot";
import SectionLabel from "@/components/SectionLabel";
import { createRevealOrders } from "@/lib/revealStagger";
import { experience } from "@/data/experience";

export default function CareerHighlightsSection() {
  const ro = createRevealOrders();
  const highlights = experience.slice(0, 3);

  return (
    <RevealStaggerRoot as="section" aria-labelledby="career-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="reveal-stagger-item" style={ro()}>
          <SectionLabel>Career highlights</SectionLabel>
          <h2
            id="career-heading"
            className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            From team lead to solution architect.
          </h2>
        </div>
        <Link
          href="/experience"
          className="reveal-stagger-item text-sm font-bold text-accent hover:opacity-90 sm:shrink-0"
          style={ro()}
        >
          View full experience -&gt;
        </Link>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((entry) => (
          <article
            key={entry.role}
            className="reveal-stagger-item flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.35)] transition-[border-color,box-shadow] hover:border-accent/25 hover:shadow-[0_20px_56px_rgba(0,0,0,0.4)]"
            style={ro()}
          >
            <div className="mb-4 h-1 w-10 rounded-full bg-accent" aria-hidden />
            <h3 className="text-lg font-bold leading-snug text-foreground">{entry.role}</h3>
            <p className="mt-1 text-sm font-semibold text-accent">{entry.company}</p>
            <p className="mt-1 text-xs text-muted">{entry.period}</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted line-clamp-3">
              {entry.highlights[0]}
            </p>
          </article>
        ))}
      </div>
    </RevealStaggerRoot>
  );
}
