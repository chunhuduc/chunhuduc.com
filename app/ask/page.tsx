import type { Metadata } from "next";
import AskDucChat from "@/components/ask/AskDucChat";
import AskHireCta from "@/components/ask/AskHireCta";
import SectionLabel from "@/components/SectionLabel";

export const metadata: Metadata = {
  title: "Ask Đức AI",
  description:
    "Ask AI about Đức's Solution Architecture experience, projects, and consulting. Answers from public portfolio materials only.",
};

export default function AskPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <SectionLabel>Ask AI</SectionLabel>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          Ask Đức AI
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Portfolio assistant grounded in public experience summaries, projects, and
          articles. Not a generic chatbot: it will not invent employers or projects.
        </p>
      </header>

      <div className="mt-10">
        <AskDucChat />
      </div>

      <div className="mt-10">
        <AskHireCta />
      </div>
    </div>
  );
}
