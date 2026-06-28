"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export interface DemoSlide {
  image: string;
  caption: string;
  sub?: string;
}

export interface DemoData {
  title: string;
  tags: string[];
  github?: string;
  slides: DemoSlide[];
}

const BG = "#0d0f12";

export default function DemoSlideshow({
  data,
  basePath,
}: {
  data: DemoData;
  basePath: string;
}) {
  const [index, setIndex] = useState(0);
  const total = data.slides.length;
  const touchStartX = useRef<number | null>(null);

  const go = useCallback(
    (next: number) => setIndex(((next % total) + total) % total),
    [total],
  );
  const prev = useCallback(() => go(index - 1), [go, index]);
  const next = useCallback(() => go(index + 1), [go, index]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) next();
    else prev();
  }

  const slide = data.slides[index];
  const progress = total > 1 ? ((index + 1) / total) * 100 : 100;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col overflow-hidden"
      style={{ background: BG, color: "#f4f4f5" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Progress bar */}
      <div className="h-[3px] w-full shrink-0" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${progress}%`, background: "var(--accent)" }}
        />
      </div>

      {/* Header */}
      <header className="shrink-0 px-6 py-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-white/10">
        <h1 className="text-lg font-bold tracking-tight">{data.title}</h1>
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <span
              key={tag}
              className="rounded px-2 py-0.5 text-xs font-medium bg-accent/15 text-accent"
            >
              {tag}
            </span>
          ))}
        </div>
        {data.github && (
          <a
            href={data.github}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-sm font-medium text-accent hover:opacity-80"
          >
            GitHub ↗
          </a>
        )}
      </header>

      {/* Slide area */}
      <main className="flex-1 min-h-0 flex flex-col items-center justify-center px-4 py-6 gap-6">
        {/* Image */}
        <div className="relative flex-1 min-h-0 w-full max-w-5xl rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
          <Image
            key={slide.image}
            src={`${basePath}/${slide.image}`}
            alt={slide.caption}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 80vw"
            priority
          />
        </div>

        {/* Caption */}
        <div className="w-full max-w-5xl text-center">
          <p
            className="text-base leading-relaxed"
            style={{ fontFamily: "var(--font-mono)", color: "#f4f4f5" }}
          >
            {slide.caption}
          </p>
          {slide.sub && (
            <p
              className="mt-1 text-sm"
              style={{ fontFamily: "var(--font-mono)", color: "rgba(244,244,245,0.5)" }}
            >
              {slide.sub}
            </p>
          )}
        </div>
      </main>

      {/* Controls footer */}
      <footer className="shrink-0 px-6 py-4 flex items-center gap-4 border-t border-white/10">
        <button
          onClick={prev}
          disabled={total <= 1}
          aria-label="Previous slide"
          className="rounded-full px-4 py-1.5 text-sm font-medium disabled:opacity-30 hover:opacity-80 transition-opacity border border-white/20"
        >
          ← Prev
        </button>
        <span className="text-sm tabular-nums" style={{ color: "rgba(244,244,245,0.5)" }}>
          {index + 1} / {total}
        </span>
        <button
          onClick={next}
          disabled={total <= 1}
          aria-label="Next slide"
          className="rounded-full px-4 py-1.5 text-sm font-medium disabled:opacity-30 hover:opacity-80 transition-opacity border border-white/20"
        >
          Next →
        </button>
      </footer>
    </div>
  );
}
