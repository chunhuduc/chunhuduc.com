import Link from "next/link";
import RevealStaggerRoot from "@/components/RevealStaggerRoot";
import { createRevealOrders } from "@/lib/revealStagger";

export default function NotFound() {
  const ro = createRevealOrders();

  return (
    <RevealStaggerRoot className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="reveal-stagger-item text-sm font-semibold uppercase tracking-wider text-accent" style={ro()}>
        404
      </p>
      <h1 className="reveal-stagger-item mt-3 text-3xl font-extrabold text-foreground" style={ro()}>
        Page not found
      </h1>
      <p className="reveal-stagger-item mt-3 text-muted" style={ro()}>
        That route does not exist (yet). Head back home or open the blog index.
      </p>
      <div className="reveal-stagger-item mt-8 flex flex-wrap justify-center gap-4" style={ro()}>
        <Link
          href="/"
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Home
        </Link>
        <Link
          href="/blog"
          className="rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-foreground hover:border-accent/40"
        >
          Blog
        </Link>
      </div>
    </RevealStaggerRoot>
  );
}
