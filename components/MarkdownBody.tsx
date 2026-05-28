import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { markdownProseClasses as c } from "@/lib/markdownProse";

const components: Components = {
  h1: ({ children }) => <h1 className={c.h1}>{children}</h1>,
  h2: ({ children }) => <h2 className={c.h2}>{children}</h2>,
  h3: ({ children }) => <h3 className={c.h3}>{children}</h3>,
  p: ({ children }) => <p className={c.p}>{children}</p>,
  a: ({ href, children }) => (
    <a
      href={href}
      className={c.a}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className={c.ul}>{children}</ul>,
  ol: ({ children }) => <ol className={c.ol}>{children}</ol>,
  li: ({ children }) => <li className={c.li}>{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className={c.blockquote}>{children}</blockquote>
  ),
  code: ({ className, children }) => {
    const inline = !className;
    if (inline) {
      return <code className={c.codeInline}>{children}</code>;
    }
    return (
      <code className={`${c.codeBlock} ${className ?? ""}`}>{children}</code>
    );
  },
  pre: ({ children }) => <pre className={c.pre}>{children}</pre>,
  hr: () => <hr className={c.hr} />,
  table: ({ children }) => (
    <div className={c.tableWrapper}>
      <table className={c.table}>{children}</table>
    </div>
  ),
  th: ({ children }) => <th className={c.th}>{children}</th>,
  td: ({ children }) => <td className={c.td}>{children}</td>,
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
