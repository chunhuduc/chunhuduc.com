export type SiteNavItem = {
  readonly href: string;
  readonly label: string;
};

/** True when `pathname` is the nav target or a nested route (e.g. `/blog/foo`). Home is exact `/` only. */
export function isSiteNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export const SITE_HEADER_NAV = [
  { href: "/", label: "Home" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/ask", label: "Ask AI" },
] as const satisfies readonly SiteNavItem[];

export const SITE_FOOTER_NAV = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/ask", label: "Ask AI" },
] as const satisfies readonly SiteNavItem[];
