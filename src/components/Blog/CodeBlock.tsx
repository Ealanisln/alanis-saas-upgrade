// src/components/Blog/CodeBlock.tsx
'use client'

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockValue {
  language?: string;
  code: string;
  filename?: string;
}

interface CodeBlockProps {
  value: CodeBlockValue;
}

const CodeBlock = ({ value }: CodeBlockProps) => {
  const { language, code, filename } = value;
  
  return (
    <div className="my-6">
      {filename && (
        <div className="bg-gray-800 text-gray-200 px-4 py-2 text-sm rounded-t-lg font-mono">
          {filename}
        </div>
      )}
      <div className={`rounded-lg overflow-hidden ${filename ? 'rounded-t-none' : ''}`}>
        <SyntaxHighlighter
          language={language || 'text'}
          style={atomDark}
          className="!my-0"
          showLineNumbers
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;