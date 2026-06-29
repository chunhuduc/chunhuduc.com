"use client";

import type { CSSProperties, MouseEvent, ReactNode } from "react";

const CV_URL = "/cv.pdf";
const CV_FILENAME_PREFIX = "Chu-Nhu-Duc-Solution-Architect-CV";

/** YYYY-MM-DD in the visitor's local time, stamped at click. */
function todayStamp(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/**
 * Download CV link. Fetches the static /cv.pdf as a blob so the saved filename
 * can be stamped with the download date (a blob object URL always honors the
 * `download` attribute, unlike a same-origin URL behind a CDN/Content-Disposition).
 * Falls back to a plain navigation if the fetch fails.
 */
export default function DownloadCvButton({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  async function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    try {
      const res = await fetch(CV_URL);
      if (!res.ok) throw new Error(`status ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${CV_FILENAME_PREFIX}-${todayStamp()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.location.href = CV_URL;
    }
  }

  return (
    <a href={CV_URL} download onClick={handleClick} className={className} style={style}>
      {children}
    </a>
  );
}
