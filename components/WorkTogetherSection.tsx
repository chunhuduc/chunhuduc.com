import WorkTogetherContactForm from "@/components/WorkTogetherContactForm";
import RevealStaggerRoot from "@/components/RevealStaggerRoot";
import SectionLabel from "@/components/SectionLabel";
import { CONTACT_FORM_HREF } from "@/lib/contactHref";
import { createRevealOrders } from "@/lib/revealStagger";

export type WorkTogetherSectionProps = {
  id?: string;
  label?: string;
  heading?: string;
  lead?: string;
  ctaLabel?: string;
  /** Defaults to homepage contact form (`/#contact`) */
  ctaHref?: string;
  submitLabel?: string;
  className?: string;
  showForm?: boolean;
};

const DEFAULT_HEADING = "Interested in working together?";
const DEFAULT_LEAD =
  "A short intro plus realistic timelines helps me reply faster. For enterprise work, expect crisp scope and milestones we can both stand behind.";

/**
 * Two-column contact block: intro left (no frame), underline form right inside a raised panel.
 */
export default function WorkTogetherSection({
  id = "contact",
  label = "Get in touch",
  heading = DEFAULT_HEADING,
  lead = DEFAULT_LEAD,
  ctaLabel = "Let's talk",
  ctaHref = CONTACT_FORM_HREF,
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
      className={["scroll-mt-24", className].filter(Boolean).join(" ")}
    >
      <div
        className={
          showForm
            ? "grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-x-14 xl:gap-x-20"
            : "max-w-xl"
        }
      >
        <header className="min-w-0 text-left lg:max-w-md lg:pt-1">
          <SectionLabel className="reveal-stagger-item" style={ro()}>
            {label}
          </SectionLabel>
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
          <div
            className="reveal-stagger-item min-w-0 rounded-2xl bg-[#232b35] p-8 shadow-[0_18px_52px_rgba(0,0,0,0.42)] sm:p-10 lg:rounded-3xl lg:p-10 xl:p-12"
            style={ro()}
          >
            <WorkTogetherContactForm submitLabel={submitLabel} />
          </div>
        ) : null}
      </div>
    </RevealStaggerRoot>
  );
}
