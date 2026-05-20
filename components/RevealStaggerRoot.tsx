"use client";

import { useEffect, useRef, useState } from "react";

type AsTag = "div" | "section" | "article";

export default function RevealStaggerRoot({
  as = "div",
  className = "",
  children,
  revealDelayMs = 90,
  threshold = 0,
  /** Positive bottom expands the viewport box so intersect fires before the block is fully inside */
  rootMargin = "0px 0px 18% 0px",
  ...rest
}: {
  as?: AsTag;
  children: React.ReactNode;
  className?: string;
  revealDelayMs?: number;
  threshold?: number;
  rootMargin?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "children">) {
  const nodeRef = useRef<Element | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;

    let revealTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;
    let activated = false;

    const armReveal = () => {
      if (activated || cancelled) return;
      activated = true;
      revealTimer = setTimeout(() => {
        if (!cancelled) setInView(true);
      }, revealDelayMs);
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          obs.disconnect();
          armReveal();
        }
      },
      { threshold, rootMargin },
    );

    obs.observe(el);

    /** IO sometimes skips the first paint frame; geometry fallback avoids stuck opacity:0 */
    requestAnimationFrame(() => {
      if (activated || cancelled || !nodeRef.current) return;
      const r = nodeRef.current.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const overlaps = r.top < vh && r.bottom > 0;
      if (overlaps) {
        obs.disconnect();
        armReveal();
      }
    });

    return () => {
      cancelled = true;
      obs.disconnect();
      if (revealTimer !== undefined) clearTimeout(revealTimer);
    };
  }, [revealDelayMs, threshold, rootMargin]);

  const mergedClass =
    `reveal-stagger-root ${inView ? "reveal-stagger-in-view" : ""} ${className}`.trim();

  if (as === "section") {
    return (
      <section
        ref={(el) => {
          nodeRef.current = el;
        }}
        className={mergedClass}
        {...rest}
      >
        {children}
      </section>
    );
  }

  if (as === "article") {
    return (
      <article
        ref={(el) => {
          nodeRef.current = el;
        }}
        className={mergedClass}
        {...rest}
      >
        {children}
      </article>
    );
  }

  return (
    <div
      ref={(el) => {
        nodeRef.current = el;
      }}
      className={mergedClass}
      {...rest}
    >
      {children}
    </div>
  );
}
