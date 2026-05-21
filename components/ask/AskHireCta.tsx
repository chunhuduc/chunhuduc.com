import Link from "next/link";
import { profile } from "@/data/profile";
import { CONTACT_FORM_HREF } from "@/lib/contactHref";

export default function AskHireCta() {
  const upwork = profile.social.upwork?.trim();

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
      <p className="text-sm font-semibold text-foreground">
        Need a Solution Architect for your project?
      </p>
      <div className="mt-3 flex flex-wrap gap-3 sm:mt-0">
        <Link
          href={CONTACT_FORM_HREF}
          className="inline-flex text-sm font-bold text-accent hover:opacity-90"
        >
          Contact
        </Link>
        {upwork ? (
          <a
            href={upwork}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-sm font-bold text-foreground/90 underline decoration-white/25 underline-offset-4 hover:text-accent"
          >
            Upwork
          </a>
        ) : null}
      </div>
    </div>
  );
}
