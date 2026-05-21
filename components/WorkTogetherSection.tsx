import WorkTogetherContactForm from "@/components/WorkTogetherContactForm";
import RevealStaggerRoot from "@/components/RevealStaggerRoot";
import SectionLabel from "@/components/SectionLabel";
import { profile } from "@/data/profile";
import { createRevealOrders } from "@/lib/revealStagger";

export type WorkTogetherSectionProps = {
  id?: string;
  label?: string;
  heading?: string;
  lead?: string;
  ctaLabel?: string;
  /** Defaults to `mailto:` using `profile.email` */
  ctaHref?: string;
  submitLabel?: string;
  className?: string;
  showForm?: boolean;
};

const DEFAULT_HEADING = "Interested in working together?";
const DEFAULT_LEAD =
  "A short intro plus realistic timelines helps me reply faster. For enterprise work, expect crisp scope and milestones we can both stand behind.";

/**
 * Two-column contact block: intro + optional underline form. Styled for site tokens, not a literal reference mockup.
 */
export default function WorkTogetherSection({
  id = "contact",
  label = "Get in touch",
  heading = DEFAULT_HEADING,
  lead = DEFAULT_LEAD,
  ctaLabel = "Let's talk",
  ctaHref = `mailto:${profile.email}`,
  submitLabel = "Submit",
  className = "",
  showForm = true,
}: WorkTogetherSectionProps) {
  const ro = createRevealOrders();
  const headingId = id ? `${id}-heading` : "work-together-heading";

  return (
    <RevealStaggerRoot
      as="section"
      id={id}
      aria-labelledby={headingId}
      className={className}
    >
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_20px_56px_rgba(0,0,0,0.38)] sm:p-10 lg:p-12">
        <div
          className={
            showForm
              ? "grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-x-16 xl:gap-x-20"
              : "max-w-xl"
          }
        >
          <header className="min-w-0">
            <SectionLabel className="reveal-stagger-item" style={ro()}>
              {label}
            </SectionLabel>
            <div
              className="reveal-stagger-item mb-6 h-1 w-10 rounded-full bg-accent"
              aria-hidden
              style={ro()}
            />
            <h2
              id={headingId}
              className="reveal-stagger-item text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl"
              style={ro()}
            >
              {heading}
            </h2>
            <p
              className="reveal-stagger-item mt-5 max-w-md text-sm leading-relaxed text-muted sm:text-base"
              style={ro()}
            >
              {lead}
            </p>
            {!showForm ? (
              <a
                href={ctaHref}
                className="reveal-stagger-item group mt-8 inline-flex items-center gap-1.5 text-sm font-bold text-accent transition-opacity hover:opacity-90"
                style={ro()}
              >
                {ctaLabel}
                <span
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                >
                  -&gt;
                </span>
              </a>
            ) : null}
          </header>

          {showForm ? (
            <WorkTogetherContactForm
              submitLabel={submitLabel}
              className="reveal-stagger-item min-w-0 lg:pt-1"
              style={ro()}
            />
          ) : null}
        </div>
      </div>
    </RevealStaggerRoot>
  );
}
