import type { CSSProperties } from "react";
import { formatPostDateTime } from "@/lib/formatPostDate";

type Props = {
  date: string;
  className?: string;
  style?: CSSProperties;
};

/** Published date at the top of the article body (and time when present in frontmatter). */
export default function BlogPostByline({ date, className = "", style }: Props) {
  const { dateTime, label } = formatPostDateTime(date);
  if (!label) return null;

  return (
    <time
      dateTime={dateTime}
      className={`block text-sm font-medium text-muted ${className}`.trim()}
      style={style}
    >
      {label}
    </time>
  );
}
