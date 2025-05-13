import { Feature } from "@/types/feature";

const SingleFeature = ({ feature }: { feature: Feature }) => {
  const { icon, title, paragraph } = feature;
  return (
    <div className="w-full h-full">
      <div className="relative group h-full p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-800/70 shadow-lg shadow-blue-100/20 dark:shadow-blue-900/5 border border-blue-50 dark:border-blue-950/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/30 dark:hover:shadow-blue-900/10">
        {/* Icon container with gradient background and glow effect */}
        <div className="relative mb-8 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300 shadow-md shadow-blue-300/30 dark:shadow-blue-900/30">
          <span className="relative z-10 text-2xl">
            {icon}
          </span>
          <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </div>
        
        {/* Title with hover effect */}
        <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white sm:text-2xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {title}
        </h3>
        
        {/* Description with improved typography */}
        <p className="text-base font-medium leading-relaxed text-gray-600 dark:text-gray-300">
          {paragraph}
        </p>
        
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 h-20 w-20 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 h-5 w-5 -mt-2 -mr-2 rounded-full bg-blue-100 dark:bg-blue-900/30 opacity-70"></div>
        </div>
      </div>
    </div>
  );
};

export default SingleFeature;
