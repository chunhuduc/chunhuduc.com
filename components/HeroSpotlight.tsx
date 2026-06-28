"use client";

import { useEffect, useRef } from "react";

export default function HeroSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = document.querySelector('[aria-label="Hero"]') as HTMLElement;
    const el = ref.current;
    if (!hero || !el) return;

    let rect = hero.getBoundingClientRect();
    let pending = false;
    let px = 50, py = 50;

    const onResize = () => { rect = hero.getBoundingClientRect(); };
    window.addEventListener("resize", onResize, { passive: true });

    const flush = () => {
      el.style.background = `radial-gradient(ellipse 28% 38% at ${px}% ${py}%, rgba(110,168,255,0.05), rgba(80,130,220,0.02) 50%, transparent 70%)`;
      pending = false;
    };

    const onMove = (e: MouseEvent) => {
      px = +((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      py = +((e.clientY - rect.top) / rect.height * 100).toFixed(1);
      if (!pending) { pending = true; requestAnimationFrame(flush); }
    };

    const onLeave = () => { el.style.background = "none"; pending = false; };

    hero.addEventListener("mousemove", onMove, { passive: true });
    hero.addEventListener("mouseleave", onLeave);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <div ref={ref} className="absolute inset-0 pointer-events-none" aria-hidden />;
}
