"use client";

import { useEffect, useRef, useState } from "react";

const ROLES = [
  "Solution Architect",
  "hands-on engineer",
  "systems builder",
  "problem solver",
];

const TYPE_MS = 65;
const ERASE_MS = 38;
const PAUSE_AFTER_TYPE = 2500;
const PAUSE_BEFORE_TYPE = 380;

export default function HeroTypewriter() {
  const [text, setText] = useState(ROLES[0]);
  const indexRef = useRef(0);
  const posRef = useRef(ROLES[0].length);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const schedule = (fn: () => void, ms: number) => {
      timerRef.current = setTimeout(fn, ms);
    };

    const type = () => {
      const role = ROLES[indexRef.current];
      if (posRef.current < role.length) {
        posRef.current++;
        setText(role.slice(0, posRef.current));
        schedule(type, TYPE_MS);
      } else {
        schedule(erase, PAUSE_AFTER_TYPE);
      }
    };

    const erase = () => {
      if (posRef.current > 0) {
        posRef.current--;
        setText(ROLES[indexRef.current].slice(0, posRef.current));
        schedule(erase, ERASE_MS);
      } else {
        indexRef.current = (indexRef.current + 1) % ROLES.length;
        schedule(type, PAUSE_BEFORE_TYPE);
      }
    };

    schedule(erase, PAUSE_AFTER_TYPE);
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <span>
      {text}
      <span className="hero-cursor" aria-hidden />
    </span>
  );
}
