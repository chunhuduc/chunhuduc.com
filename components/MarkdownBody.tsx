import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mt-10 text-3xl font-bold tracking-tight text-foreground first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-9 text-2xl font-semibold tracking-tight text-foreground">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 text-xl font-semibold text-foreground">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mt-4 leading-relaxed text-foreground/90">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-accent underline decoration-line underline-offset-4 hover:opacity-90"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-foreground/90">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 text-foreground/90">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mt-4 border-l-4 border-accent/40 pl-4 italic text-muted">
      {children}
    </blockquote>
  ),
  code: ({ className, children }) => {
    const inline = !className;
    if (inline) {
      return (
        <code className="rounded bg-white/12 px-1.5 py-0.5 text-[0.9em] font-medium text-foreground">
          {children}
        </code>
      );
    }
    return (
      <code className={`font-mono text-[0.9em] ${className ?? ""}`}>{children}</code>
    );
  },
  pre: ({ children }) => (
    <pre className="mt-4 overflow-x-auto rounded-lg border border-white/12 bg-[#12141a] p-4 text-sm leading-relaxed text-foreground/95">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-10 border-line" />,
  table: ({ children }) => (
    <div className="mt-4 overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-line bg-white/[0.08] px-3 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-line px-3 py-2 align-top text-foreground/90">
      {children}
    </td>
  ),
};

export default function MarkdownBody({ content }: { content: string }) {
  return (
    <div className="">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
