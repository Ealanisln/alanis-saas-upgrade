// src/components/Blog/PortableText.tsx
import React from 'react';
import { PortableTextComponents } from '@portabletext/react';
import CodeBlock from './CodeBlock';

export const portableTextComponents: PortableTextComponents = {
  types: {
    code: CodeBlock,
    myCodeField: CodeBlock, 
    image: ({ value }) => {
      if (!value?.asset?.url) {
        return null;
      }
      return (
        <img 
          src={value.asset.url} 
          alt={value.alt || ' '} 
          className="rounded-lg my-4"
        />
      );
    },
  },
  block: {
    // Soporte para el nuevo estilo personalizado 'customquote'
    customquote: ({ children }) => {
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
          {children}
        </blockquote>
      );
    },
    // Mantenemos soporte para blockquote existente en contenidos previos
    blockquote: ({ children }) => {
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
          {children}
        </blockquote>
      );
    },
    h1: ({ children }) => <h1 className="text-3xl font-bold my-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold my-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold my-4">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-bold my-4">{children}</h4>,
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      return (
        <a href={value.href} rel={rel} className="text-blue-600 hover:underline">
          {children}
        </a>
      );
    },
    code: ({ children }) => <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 font-mono text-sm">{children}</code>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-5 my-4">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-5 my-4">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="my-2">{children}</li>,
    number: ({ children }) => <li className="my-2">{children}</li>,
  },
};