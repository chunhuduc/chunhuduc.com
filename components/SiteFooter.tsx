import { profile } from "@/data/profile";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const gh = profile.social.github?.trim();
  const li = profile.social.linkedin?.trim();

  return (
    <footer className="mt-auto border-t border-line/80 bg-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-medium text-foreground/80">
          {profile.name}{" "}
          <span className="font-normal text-muted">· {year}</span>
        </p>
        <div className="flex flex-wrap gap-4">
          <a className="hover:text-accent transition-colors" href={`mailto:${profile.email}`}>
            Email
          </a>
          {gh ? (
            <a
              className="hover:text-accent transition-colors"
              href={gh}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          ) : null}
          {li ? (
            <a
              className="hover:text-accent transition-colors"
              href={li}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
