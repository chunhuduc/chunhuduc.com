import Image from "next/image";
import Link from "next/link";
import SocialLinksRow from "@/components/SocialLinksRow";
import { SITE_FOOTER_NAV } from "@/data/site-nav";
import { profile } from "@/data/profile";
import { phoneDigits } from "@/lib/phoneDigits";

const FOOTER_CONTACT = [
  { href: `mailto:${profile.email}`, label: "Contact" as const },
];

function FooterNavLink({ href, label }: { href: string; label: string }) {
  const isMailOrTel =
    href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("http");
  const className = "font-medium text-foreground/90 underline-offset-[3px] transition-colors hover:text-accent";
  if (isMailOrTel) {
    return (
      <a href={href} className={`${className} underline decoration-foreground/30`}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={`${className} underline decoration-transparent hover:decoration-foreground/30`}>
      {label}
    </Link>
  );
}

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const digits = phoneDigits(profile.phone);
  const mailto = `mailto:${profile.email}`;

  const navItems = [...SITE_FOOTER_NAV, ...FOOTER_CONTACT] as readonly { href: string; label: string }[];

  return (
    <footer className="mt-auto border-t border-line/80 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-[4.25rem]">
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start lg:gap-x-14">
          {/* Left · identity + socials */}
          <div className="flex flex-col gap-8 lg:gap-10">
            <div className="flex flex-row items-start gap-4 sm:gap-5">
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/15 bg-white/[0.06] sm:h-16 sm:w-16 md:h-[4.75rem] md:w-[4.75rem]">
                <Image
                  src="/hero-portrait.png"
                  alt={`${profile.name} portrait`}
                  fill
                  className="object-cover object-[50%_12%]"
                  sizes="76px"
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xl font-extrabold tracking-tight text-foreground normal-case sm:text-[1.35rem]">
                  {profile.name}
                </p>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{profile.title}</p>
              </div>
            </div>
            <SocialLinksRow className="text-foreground/90" />
          </div>

          {/* Right · CTA */}
          <div className="flex flex-col gap-10">
            <h2 className="flex flex-wrap items-center gap-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-[1.65rem]">
              Get in touch
              <span className="inline-flex shrink-0 text-accent" aria-hidden>
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 sm:gap-x-10">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Email me:</p>
                <a
                  href={mailto}
                  className="mt-3 inline-block text-base font-bold text-foreground underline decoration-foreground/40 decoration-2 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent/70"
                >
                  {profile.email}
                </a>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Call me:</p>
                <a
                  href={`tel:${digits}`}
                  className="mt-3 inline-block text-base font-bold text-foreground underline decoration-foreground/40 decoration-2 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent/70"
                >
                  {profile.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 sm:mt-16" />

        <div className="flex flex-col-reverse gap-6 pt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-8 sm:gap-y-4">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm sm:gap-x-8">
            {navItems.map((item) => (
              <li key={`${item.label}-${item.href}`}>
                <FooterNavLink href={item.href} label={item.label} />
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted sm:text-sm">
            © {year} {profile.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
