"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AskSources from "./AskSources";
import type { ChatSourceCitation } from "@/lib/rag/types";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: ChatSourceCitation[];
  streaming?: boolean;
};

export default function AskMessageList({ messages }: { messages: ChatMessage[] }) {
  if (messages.length === 0) {
    return (
      <p className="text-sm leading-relaxed text-muted">
        Ask about architecture, projects, stack, or how Đức works with clients.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {messages.map((m) => (
        <li
          key={m.id}
          className={
            m.role === "user"
              ? "flex justify-end"
              : "flex justify-start"
          }
        >
          <div
            className={
              m.role === "user"
                ? "max-w-[92%] rounded-2xl rounded-br-md border border-accent/20 bg-white/[0.08] px-4 py-3 text-sm leading-relaxed text-foreground sm:max-w-[85%]"
                : "max-w-[95%] rounded-2xl rounded-bl-md bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-foreground/95 sm:max-w-[90%]"
            }
          >
            {m.role === "assistant" ? (
              <div className="prose prose-invert prose-sm max-w-none [&_p]:my-2 [&_ul]:my-2">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                {m.streaming ? (
                  <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-accent align-middle" />
                ) : null}
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{m.content}</p>
            )}
            {m.role === "assistant" && m.sources && !m.streaming ? (
              <AskSources sources={m.sources} />
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
