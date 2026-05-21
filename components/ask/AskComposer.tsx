"use client";

import AltchaWidget from "@/components/AltchaWidget";
import { isLocalhostClient } from "@/lib/altcha-local";
import { type FormEvent, useState } from "react";
import { ALTCHA_SESSION_KEY, ALTCHA_TTL_MS } from "./constants";

const skipAltcha = () =>
  typeof window !== "undefined" && isLocalhostClient();

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (altcha: string) => void;
  disabled?: boolean;
  loading?: boolean;
};

function readAltchaFromForm(form: HTMLFormElement): string {
  const input = form.querySelector<HTMLInputElement>('input[name="altcha"]');
  return input?.value?.trim() ?? "";
}

function isSessionVerified(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  const raw = sessionStorage.getItem(ALTCHA_SESSION_KEY);
  if (!raw) return false;
  const until = Number(raw);
  return Number.isFinite(until) && until > Date.now();
}

export function markAltchaVerified() {
  sessionStorage.setItem(ALTCHA_SESSION_KEY, String(Date.now() + ALTCHA_TTL_MS));
}

export default function AskComposer({
  value,
  onChange,
  onSubmit,
  disabled,
  loading,
}: Props) {
  const [showAltcha, setShowAltcha] = useState(
    () => !skipAltcha() && !isSessionVerified(),
  );
  const [altchaKey, setAltchaKey] = useState(0);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading || disabled) return;

    const form = e.currentTarget;
    const altcha = readAltchaFromForm(form);

    if (!skipAltcha() && !isSessionVerified()) {
      if (!altcha) {
        setError("Complete the verification challenge before submitting.");
        return;
      }
      markAltchaVerified();
      setShowAltcha(false);
    }

    setError("");
    onSubmit(altcha || "");
  }

  const fieldClass =
    "w-full resize-y border-0 border-b border-slate-400/40 bg-transparent py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-accent/70 focus:outline-none min-h-[3rem] max-h-32";

  const submitClass =
    "group inline-flex shrink-0 cursor-pointer items-center gap-2 border-0 bg-transparent px-2 py-1 text-sm font-extrabold uppercase tracking-[0.12em] text-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      {showAltcha ? (
        <div className="mb-4">
          <AltchaWidget disabled={loading} resetKey={altchaKey} />
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="sr-only" htmlFor="ask-input">
          Your question
        </label>
        <textarea
          id="ask-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          maxLength={2000}
          disabled={loading || disabled}
          placeholder="Ask about experience, architecture, or consulting…"
          className={fieldClass}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <button type="submit" className={submitClass} disabled={loading || disabled}>
          {loading ? "Sending…" : "Send"}
          <span className="text-accent" aria-hidden>
            ↑
          </span>
        </button>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <p className="mt-3 text-xs text-muted">
        AI answers use public portfolio materials only. May be incomplete.
        {skipAltcha() ? null : (
          <>
            {" "}
            <button
              type="button"
              className="underline decoration-white/20 hover:text-foreground"
              onClick={() => {
                sessionStorage.removeItem(ALTCHA_SESSION_KEY);
                setShowAltcha(true);
                setAltchaKey((k) => k + 1);
              }}
            >
              Reset verification
            </button>
          </>
        )}
      </p>
    </form>
  );
}
