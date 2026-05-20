import type { CSSProperties } from "react";

const STEP_MS = 95;

/**
 * Per-item stagger via inline `animation-delay` (two values for dual animations).
 * Avoids `calc(var(--order) * 95ms)` which breaks in several engines when paired with animation shorthand.
 */
export function revealOrderStyle(order: number): CSSProperties {
  const d = `${order * STEP_MS}ms`;
  return {
    animationDelay: `${d}, ${d}`,
  };
}

/** Fresh counter per section so order indices stay local and readable. */
export function createRevealOrders() {
  let n = 0;
  return () => revealOrderStyle(n++);
}
