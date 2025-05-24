import { FC } from 'react';

interface TechBadgeProps {
  tech: string;
}

const TechBadge: FC<TechBadgeProps> = ({ tech }) => {
  return (
    <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
      {tech}
    </span>
  );
};

export default TechBadge; 