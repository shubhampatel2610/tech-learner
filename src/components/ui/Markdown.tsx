import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/** Themed markdown renderer. GFM tables/lists supported. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-dsa max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-card border border-border">
              <table className="w-full border-collapse text-xs">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-border bg-surface-2 px-3 py-2 text-left font-semibold text-text">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border px-3 py-2 align-top text-muted">{children}</td>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
