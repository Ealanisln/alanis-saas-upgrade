// src/components/Blog/CodeBlock.tsx
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockProps {
  value: {
    language?: string;
    code: string;
  };
}

const CodeBlock = ({ value }: CodeBlockProps) => {
  const { language, code } = value;
  
  return (
    <div className="my-4 rounded-lg overflow-hidden">
      <SyntaxHighlighter
        language={language || 'text'}
        style={atomDark}
        className="rounded-lg"
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;