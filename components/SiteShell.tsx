"use client";

import { usePathname } from "next/navigation";
import { pathnameUsesHeaderBleed } from "@/lib/headerBleed";

/**
 * Inner pages need top offset because SiteHeader is position:fixed off the layout flow.
 * Bleed routes keep content under the translucent header via `#header-bleed` padding only.
 */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const headerBleeds = pathnameUsesHeaderBleed(pathname);

  return (
    <div className={headerBleeds ? "flex-1" : "flex-1 pt-[4.75rem] sm:pt-[4.875rem]"}>{children}</div>
  );
}
