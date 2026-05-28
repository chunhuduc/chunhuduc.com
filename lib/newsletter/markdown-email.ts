import type { Element, Root as HastRoot } from "hast";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { markdownProseEmailStyle } from "@/lib/markdownProse";

function rehypeEmailStyles() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element) => {
      const className = node.properties?.className;
      const classes =
        typeof className === "string"
          ? className
          : Array.isArray(className)
            ? className.join(" ")
            : undefined;
      const style = markdownProseEmailStyle(node.tagName, {
        isBlockCode: node.tagName === "code" && Boolean(classes),
      });
      if (style) {
        node.properties = { ...node.properties, style };
      }
    });
  };
}

export function renderMarkdownForEmail(markdown: string): string {
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeEmailStyles)
    .use(rehypeStringify)
    .processSync(markdown);

  return String(file);
}
