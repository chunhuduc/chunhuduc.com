import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-accent">404</p>
      <h1 className="mt-3 text-3xl font-extrabold text-foreground">Page not found</h1>
      <p className="mt-3 text-muted">
        That route does not exist (yet). Head back home or open the blog index.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
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
    </div>
  );
}
