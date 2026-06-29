import RevealStaggerRoot from "@/components/RevealStaggerRoot";
import SectionLabel from "@/components/SectionLabel";
import { createRevealOrders } from "@/lib/revealStagger";
import { testimonials } from "@/data/testimonials";

export default function TestimonialsSection() {
  const ro = createRevealOrders();
  if (testimonials.length === 0) return null;

  return (
    <RevealStaggerRoot as="section" aria-labelledby="testimonials-heading">
      <div className="reveal-stagger-item" style={ro()}>
        <SectionLabel>Testimonials</SectionLabel>
        <h2
          id="testimonials-heading"
          className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
        >
          What clients say.
        </h2>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <figure
            key={`${t.author}-${i}`}
            className="reveal-stagger-item flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.35)]"
            style={ro()}
          >
            <span aria-hidden className="text-4xl font-extrabold leading-none text-accent/50">
              &ldquo;
            </span>
            <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-foreground/90">
              {t.quote}
            </blockquote>
            <figcaption className="mt-5 border-t border-white/10 pt-4">
              <p className="text-sm font-bold text-foreground">{t.author}</p>
              <p className="mt-0.5 text-xs text-muted">{t.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </RevealStaggerRoot>
  );
}
