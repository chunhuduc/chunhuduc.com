"use client";

import { useEffect, useState } from "react";
import { isLocalhostClient } from "@/lib/altcha-local";
import "altcha";
import "altcha/themes/business.css";

/** Passed via the widget `configuration` attribute (see ALTCHA Configuration options). */
const ALTCHA_CONFIGURATION = JSON.stringify({ hideLogo: true });

type AltchaWidgetProps = {
  disabled?: boolean;
  resetKey?: number;
  className?: string;
};

export default function AltchaWidget({
  disabled = false,
  resetKey = 0,
  className = "",
}: AltchaWidgetProps) {
  const [mounted, setMounted] = useState(false);
  const [skipOnLocalhost, setSkipOnLocalhost] = useState(false);

  useEffect(() => {
    setSkipOnLocalhost(isLocalhostClient());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <p className={`text-xs text-muted ${className}`.trim()} aria-hidden>
        Loading verification…
      </p>
    );
  }

  if (skipOnLocalhost) {
    return null;
  }

  return (
    <div
      key={resetKey}
      className={[
        "min-w-0 w-full sm:w-auto sm:max-w-md",
        disabled ? "pointer-events-none opacity-50" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <altcha-widget
        challenge="/api/altcha/challenge"
        auto="onsubmit"
        theme="business"
        configuration={ALTCHA_CONFIGURATION}
      />
    </div>
  );
}
