"use client";

import type { CSSProperties, FormEvent } from "react";
import { profile } from "@/data/profile";

export type WorkTogetherContactFormProps = {
  email?: string;
  submitLabel?: string;
  className?: string;
  style?: CSSProperties;
};

const fieldClass =
  "w-full border-0 border-b border-white/15 bg-transparent py-3 text-sm text-foreground placeholder:text-muted/70 transition-colors focus:border-accent/80 focus:outline-none";

const labelClass =
  "block text-xs font-bold uppercase tracking-[0.14em] text-foreground";

const submitClass =
  "group mt-10 inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-sm font-extrabold uppercase tracking-[0.14em] text-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function WorkTogetherContactForm({
  email = profile.email,
  submitLabel = "Submit",
  className = "",
  style,
}: WorkTogetherContactFormProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const fromEmail = String(data.get("email") ?? "").trim();
    const project = String(data.get("project") ?? "").trim();

    const subject = encodeURIComponent(
      name ? `Project inquiry from ${name}` : "Project inquiry",
    );
    const body = encodeURIComponent(
      [
        name ? `Name: ${name}` : null,
        fromEmail ? `Email: ${fromEmail}` : null,
        "",
        project || "(no message)",
      ]
        .filter((line) => line !== null)
        .join("\n"),
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={className}
      style={style}
      noValidate
    >
      <div className="space-y-8">
        <p>
          <label htmlFor="work-together-name" className={labelClass}>
            Your name
          </label>
          <input
            id="work-together-name"
            name="name"
            type="text"
            autoComplete="name"
            className={`${fieldClass} mt-2`}
            placeholder="How should I address you?"
          />
        </p>
        <p>
          <label htmlFor="work-together-email" className={labelClass}>
            Email address
          </label>
          <input
            id="work-together-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={`${fieldClass} mt-2`}
            placeholder="you@company.com"
          />
        </p>
        <p>
          <label htmlFor="work-together-project" className={labelClass}>
            Project or question
          </label>
          <textarea
            id="work-together-project"
            name="project"
            rows={4}
            className={`${fieldClass} mt-2 resize-y min-h-[6.5rem]`}
            placeholder="Scope, stack, timeline, or what you need clarity on"
          />
        </p>
      </div>
      <button type="submit" className={submitClass}>
        {submitLabel}
        <span
          className="text-accent transition-transform group-hover:-translate-y-0.5"
          aria-hidden
        >
          ↑
        </span>
      </button>
    </form>
  );
}
