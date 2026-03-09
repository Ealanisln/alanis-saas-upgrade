import { FC } from "react";

interface SectionTitleProps {
  title: string;
  paragraph?: string;
  mb?: string;
  center?: boolean;
  width?: string;
}

const SectionTitle: FC<SectionTitleProps> = ({
  title,
  paragraph,
  center,
  width = "max-w-[768px]",
}) => {
  return (
    <div
      className={`w-full ${width} ${center ? "mx-auto text-center" : "text-left"} mb-12 md:mb-16`}
    >
      <h2 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
        {title}
      </h2>

      {paragraph && (
        <p className="text-base text-neutral-600 dark:text-neutral-400 md:text-lg">
          {paragraph}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
