"use client";

import { useState, type CSSProperties, type FormEvent } from "react";

export type WorkTogetherContactFormProps = {
  submitLabel?: string;
  className?: string;
  style?: CSSProperties;
};

const fieldClass =
  "w-full border-0 border-b border-white/15 bg-transparent py-3 text-sm text-foreground placeholder:text-muted/70 transition-colors focus:border-accent/80 focus:outline-none";

const labelClass =
  "block text-xs font-bold uppercase tracking-[0.14em] text-foreground";

const submitClass =
  "group mt-10 inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-sm font-extrabold uppercase tracking-[0.14em] text-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function WorkTogetherContactForm({
  submitLabel = "Submit",
  className = "",
  style,
}: WorkTogetherContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      project: String(data.get("project") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
    };

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(
          json.error ?? "Could not send your message. Try again later.",
        );
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Check your connection and try again.");
    }
  }

  const statusId = "work-together-form-status";

  return (
    <form
      onSubmit={handleSubmit}
      className={className}
      style={style}
      noValidate
      aria-describedby={status !== "idle" ? statusId : undefined}
    >
      <div className="space-y-8">
        <p className="sr-only" aria-hidden="true">
          <label htmlFor="work-together-company">Company</label>
          <input
            id="work-together-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
          />
        </p>
        <p>
          <label htmlFor="work-together-name" className={labelClass}>
            Your name
          </label>
          <input
            id="work-together-name"
            name="name"
            type="text"
            autoComplete="name"
            disabled={status === "loading"}
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
            disabled={status === "loading"}
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
            disabled={status === "loading"}
            className={`${fieldClass} mt-2 resize-y min-h-[6.5rem]`}
            placeholder="Scope, stack, timeline, or what you need clarity on"
          />
        </p>
      </div>
      <button
        type="submit"
        className={submitClass}
        disabled={status === "loading" || status === "success"}
      >
        {status === "loading" ? "Sending…" : submitLabel}
        <span
          className="text-accent transition-transform group-hover:-translate-y-0.5"
          aria-hidden
        >
          ↑
        </span>
      </button>
      {status !== "idle" ? (
        <p
          id={statusId}
          role={status === "error" ? "alert" : "status"}
          className={`mt-4 text-sm leading-relaxed ${
            status === "success"
              ? "text-foreground/90"
              : status === "error"
                ? "text-red-400"
                : "text-muted"
          }`}
        >
          {status === "success"
            ? "Message sent. Check your inbox for a short confirmation."
            : status === "error"
              ? errorMessage
              : null}
        </p>
      ) : null}
    </form>
  );
}
