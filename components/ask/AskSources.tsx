import Link from "next/link";
import type { ChatSourceCitation } from "@/lib/rag/types";

export default function AskSources({ sources }: { sources: ChatSourceCitation[] }) {
  if (sources.length === 0) return null;

  return (
    <div className="mt-3 border-t border-white/10 pt-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Sources</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {sources.map((s) => (
          <li key={s.documentId}>
            {s.sourceUri ? (
              <Link
                href={s.sourceUri}
                className="inline-flex rounded-full bg-white/[0.08] px-2.5 py-1 text-[11px] font-semibold text-accent transition-opacity hover:opacity-90"
              >
                [{s.index}] {s.title}
              </Link>
            ) : (
              <span className="inline-flex rounded-full bg-white/[0.08] px-2.5 py-1 text-[11px] font-semibold text-foreground/85">
                [{s.index}] {s.title}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
