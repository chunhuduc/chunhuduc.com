"use client";

import AltchaWidget from "@/components/AltchaWidget";
import { isLocalhostClient } from "@/lib/altcha-local";
import { useState, type CSSProperties, type FormEvent } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

type Props = {
  className?: string;
  style?: CSSProperties;
};

export default function BlogNewsletterForm({ className = "", style }: Props) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [altchaKey, setAltchaKey] = useState(0);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const altcha = String(data.get("altcha") ?? "").trim();
    if (!isLocalhostClient() && !altcha) {
      setStatus("error");
      setErrorMessage("Complete the verification challenge before subscribing.");
      return;
    }

    const payload = {
      email: String(data.get("email") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      altcha,
    };

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(
          json.error ?? "Could not subscribe. Try again later.",
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

  const statusId = "blog-newsletter-form-status";

  return (
    <form
      onSubmit={handleSubmit}
      className={className}
      style={style}
      noValidate
      aria-describedby={status !== "idle" ? statusId : undefined}
    >
      <p className="sr-only" aria-hidden="true">
        <label htmlFor="blog-newsletter-company">Company</label>
        <input
          id="blog-newsletter-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
        />
      </p>
      <label
        htmlFor="blog-newsletter-email"
        className="text-base font-semibold tracking-wide text-foreground"
      >
        Your email address
      </label>
      <input
        id="blog-newsletter-email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        disabled={status === "loading" || status === "success"}
        placeholder="name@company.com"
        className="mt-5 block w-full border-0 border-b border-[#3f444e] bg-transparent px-0 pb-3 text-base text-foreground placeholder:text-muted/70 focus:border-accent focus:outline-none sm:text-lg"
      />
      <div className="mt-7 space-y-4">
        <AltchaWidget disabled={status === "loading" || status === "success"} resetKey={altchaKey} />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="inline-flex items-center gap-1.5 border-b border-[#5a6473] pb-1 text-base font-bold text-foreground transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading" ? "Subscribing…" : status === "success" ? "Subscribed" : "Subscribe now"}
          {status !== "loading" && status !== "success" ? <span aria-hidden>→</span> : null}
        </button>
      </div>
      <p className="mt-4 text-sm text-muted/90">Occasional emails. Unsubscribe anytime.</p>
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
            ? "You are subscribed. Watch your inbox for the next post."
            : status === "error"
              ? errorMessage
              : null}
        </p>
      ) : null}
    </form>
  );
}
