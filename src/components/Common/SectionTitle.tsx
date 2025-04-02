// src/components/Common/SectionTitle.tsx
import { FC } from 'react';

interface SectionTitleProps {
  title: string;
  paragraph?: string;
  mb?: string; 
  center?: boolean;
  width?: string;
  subtitle?: string;
  highlight?: string;
}

const SectionTitle: FC<SectionTitleProps> = ({
  title,
  paragraph,
  center,
  width = 'max-w-[768px]',
  subtitle,
  highlight,
}) => {
  // Split title to highlight a specific part if provided
  const titleParts = highlight ? title.split(highlight) : [title];
  const highlightIndex = highlight ? title.indexOf(highlight) : -1;

  return (
    <div
      className={`w-full ${width} ${center ? 'mx-auto text-center' : 'text-left'}`}
    >
      {subtitle && (
        <span className="mb-3 inline-block rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-semibold tracking-wide text-blue-600 dark:text-blue-400">
          {subtitle}
        </span>
      )}

      <h2 className="mb-4 text-3xl font-bold !leading-tight text-gray-800 dark:text-white sm:text-4xl md:text-[42px]">
        {highlight ? (
          <>
            {highlightIndex > 0 && titleParts[0]}
            <span className="relative inline-block">
              <span className="relative z-10 text-blue-600 dark:text-blue-400">{highlight}</span>
              <span className="absolute bottom-2 left-0 z-0 h-3 w-full bg-blue-100 dark:bg-blue-900/50"></span>
            </span>
            {titleParts[1]}
          </>
        ) : (
          title
        )}
      </h2>

      {paragraph && (
        <p className="text-base !leading-relaxed text-gray-600 dark:text-gray-300 md:text-lg">
          {paragraph}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;