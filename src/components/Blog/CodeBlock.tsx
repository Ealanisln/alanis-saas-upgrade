// src/components/Blog/CodeBlock.tsx
"use client";

import React, { Suspense, lazy } from "react";

const SyntaxHighlighter = lazy(() =>
  import("react-syntax-highlighter").then((mod) => ({
    default: mod.Prism,
  })),
);

interface CodeBlockValue {
  language?: string;
  code: string;
  filename?: string;
}

interface CodeBlockProps {
  value: CodeBlockValue;
}

function CodeBlockFallback() {
  return (
    <div className="my-0 animate-pulse rounded-lg bg-gray-800 p-4">
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-700" />
        <div className="h-4 w-1/2 rounded bg-gray-700" />
        <div className="h-4 w-5/6 rounded bg-gray-700" />
      </div>
    </div>
  );
}

function SyntaxHighlighterWrapper({
  language,
  code,
}: {
  language: string;
  code: string;
}) {
  const [style, setStyle] = React.useState<Record<
    string,
    React.CSSProperties
  > | null>(null);

  React.useEffect(() => {
    import("react-syntax-highlighter/dist/cjs/styles/prism").then((mod) =>
      setStyle(mod.atomDark),
    );
  }, []);

  if (!style) return <CodeBlockFallback />;

  return (
    <SyntaxHighlighter
      language={language || "text"}
      style={style}
      className="!my-0"
      showLineNumbers
    >
      {code}
    </SyntaxHighlighter>
  );
}

const CodeBlock = ({ value }: CodeBlockProps) => {
  const { language, code, filename } = value;

  return (
    <div className="my-6">
      {filename && (
        <div className="rounded-t-lg bg-gray-800 px-4 py-2 font-mono text-sm text-gray-200">
          {filename}
        </div>
      )}
      <div
        className={`overflow-hidden rounded-lg ${filename ? "rounded-t-none" : ""}`}
      >
        <Suspense fallback={<CodeBlockFallback />}>
          <SyntaxHighlighterWrapper language={language || "text"} code={code} />
        </Suspense>
      </div>
    </div>
  );
};

export default CodeBlock;
