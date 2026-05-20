"use client";

import { usePathname } from "next/navigation";

/**
 * Inner pages need top offset because SiteHeader is position:fixed off the layout flow.
 * Home keeps bleed under the translucent header via HomeHero padding only.
 */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className={isHome ? "flex-1" : "flex-1 pt-[4.75rem] sm:pt-[4.875rem]"}>{children}</div>
  );
}
