// src/components/Blog/PortableText.tsx
import React from "react";
import Image from "next/image";
import { PortableTextComponents } from "@portabletext/react";
import CodeBlock from "./CodeBlock";

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
          alt={value.alt || " "}
          width={800}
          height={600}
          className="my-4 rounded-lg"
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      );
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="mb-4 mt-8 text-4xl font-bold">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-8 text-3xl font-bold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-4 mt-6 text-2xl font-bold">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-4 mt-6 text-xl font-bold">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-gray-300 pl-4 italic text-gray-700 dark:text-gray-300">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value.href || "";
      const isSafe = /^(https?:\/\/|\/|mailto:)/.test(href);
      if (!isSafe) return <>{children}</>;
      const isExternal = !href.startsWith("/");
      return (
        <a
          href={href}
          rel={isExternal ? "noreferrer noopener" : undefined}
          className="text-blue-600 hover:underline dark:text-blue-400"
          target={isExternal ? "_blank" : undefined}
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm dark:bg-gray-800">
        {children}
      </code>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-4 list-disc space-y-2 pl-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-4 list-decimal space-y-2 pl-6">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
};
