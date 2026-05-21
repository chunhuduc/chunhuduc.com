export type SiteNavItem = {
  readonly href: string;
  readonly label: string;
};

export const SITE_HEADER_NAV = [
  { href: "/", label: "Home" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
] as const satisfies readonly SiteNavItem[];

export const SITE_FOOTER_NAV = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
] as const satisfies readonly SiteNavItem[];
