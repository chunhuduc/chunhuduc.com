"use client";

import { useEffect, useRef } from "react";

/**
 * Soft cursor-following radial glow over the hero photo.
 * Drop inside the hero's background layer div.
 */
export default function HeroSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = document.querySelector('[aria-label="Hero"]') as HTMLElement;
    const el = ref.current;
    if (!hero || !el) return;

    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
      const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
      el.style.background = `radial-gradient(ellipse 28% 38% at ${x}% ${y}%, rgba(110,168,255,0.05), rgba(80,130,220,0.02) 50%, transparent 70%)`;
    };
    const onLeave = () => { el.style.background = "none"; };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div ref={ref} className="absolute inset-0 pointer-events-none" aria-hidden />;
}
