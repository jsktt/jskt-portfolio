import ReactMarkdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";

const remarkPlugins = [remarkMath];
const rehypePlugins = [rehypeKatex, rehypeHighlight, rehypeRaw];

const MarkdownRenderer = ({
  children,
  components,
}: {
  children: string;
  components?: Partial<Components>;
}) => (
  <ReactMarkdown
    remarkPlugins={remarkPlugins}
    rehypePlugins={rehypePlugins}
    components={components}
  >
    {children}
  </ReactMarkdown>
);

export default MarkdownRenderer;
