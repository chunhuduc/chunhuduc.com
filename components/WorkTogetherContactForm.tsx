"use client";

import AltchaWidget from "@/components/AltchaWidget";
import { useState, type CSSProperties, type FormEvent } from "react";

export type WorkTogetherContactFormProps = {
  submitLabel?: string;
  className?: string;
  style?: CSSProperties;
};

const fieldClass =
  "w-full border-0 border-b border-slate-400/40 bg-transparent py-3.5 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-accent/70 focus:outline-none";

const labelClass = "block text-sm font-bold text-foreground";

const submitClass =
  "group inline-flex shrink-0 cursor-pointer items-center gap-2.5 border-0 bg-transparent px-2 py-1 text-lg font-extrabold uppercase tracking-[0.12em] text-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#232b35] disabled:cursor-not-allowed disabled:opacity-50 sm:text-xl";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function WorkTogetherContactForm({
  submitLabel = "Submit",
  className = "",
  style,
}: WorkTogetherContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [altchaKey, setAltchaKey] = useState(0);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const altcha = String(data.get("altcha") ?? "").trim();
    if (!altcha) {
      setStatus("error");
      setErrorMessage("Complete the verification challenge before submitting.");
      return;
    }

    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      project: String(data.get("project") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      altcha,
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
      setAltchaKey((k) => k + 1);
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
            Name
          </label>
          <input
            id="work-together-name"
            name="name"
            type="text"
            autoComplete="name"
            disabled={status === "loading"}
            className={`${fieldClass} mt-3`}
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
            className={`${fieldClass} mt-3`}
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
            className={`${fieldClass} mt-3 resize-y min-h-[6.5rem]`}
            placeholder="Scope, stack, timeline, or what you need clarity on"
          />
        </p>
      </div>
      <div className="mt-10 flex w-full flex-col gap-4 max-sm:gap-6 sm:gap-3">
        <AltchaWidget
          disabled={status === "loading"}
          resetKey={altchaKey}
        />
        <button
          type="submit"
          className={`${submitClass} self-end sm:self-start`}
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
      </div>
      {status !== "idle" ? (
        <p
          id={statusId}
          role={status === "error" ? "alert" : "status"}
          className={`mt-4 text-sm leading-relaxed sm:mt-3 ${
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
