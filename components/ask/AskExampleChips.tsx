"use client";

import { EXAMPLE_PROMPTS } from "./constants";

type Props = {
  onSelect: (text: string) => void;
  disabled?: boolean;
};

export default function AskExampleChips({ onSelect, disabled }: Props) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-2.5">
      {EXAMPLE_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(prompt)}
          className="shrink-0 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-left text-xs font-semibold text-foreground/90 transition-colors hover:border-accent/30 hover:bg-white/[0.08] disabled:opacity-50 sm:text-sm"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
