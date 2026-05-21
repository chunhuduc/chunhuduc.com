export type SiteNavItem = {
  readonly href: string;
  readonly label: string;
};

/** Primary nav in the site header */
export const SITE_HEADER_NAV = [
  { href: "/", label: "Home" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
] as const satisfies readonly SiteNavItem[];

/**
 * Footer link row ends at Blog. Append `mailto:` Contact in the footer from `profile.email`.
 */
export const SITE_FOOTER_NAV = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
] as const satisfies readonly SiteNavItem[];
