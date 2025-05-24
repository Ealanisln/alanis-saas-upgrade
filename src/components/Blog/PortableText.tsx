// src/components/Blog/PortableText.tsx
import React from 'react';
import { PortableTextComponents } from '@portabletext/react';
import Image from 'next/image';
import CodeBlock from './CodeBlock';

export const portableTextComponents: PortableTextComponents = {
  types: {
    code: ({ value }) => <CodeBlock value={value} />,
    myCodeField: ({ value }) => <CodeBlock value={value} />,
    image: ({ value }) => {
      if (!value?.asset?.url) {
        return null;
      }
      return (
        <Image 
          src={value.asset.url} 
          alt={value.alt || ' '} 
          width={800}
          height={600}
          className="rounded-lg my-4"
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
      );
    },
  },
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold mt-6 mb-4">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-bold mt-6 mb-4">{children}</h4>,
    normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-6 text-gray-700 dark:text-gray-300">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      return (
        <a 
          href={value.href} 
          rel={rel} 
          className="text-blue-600 dark:text-blue-400 hover:underline"
          target={!value.href.startsWith('/') ? '_blank' : undefined}
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 font-mono text-sm">
        {children}
      </code>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 my-4 space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 my-4 space-y-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
};