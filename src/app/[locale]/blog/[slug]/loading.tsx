export default function BlogPostLoading() {
  return (
    <section className="pb-[120px] pt-[150px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 lg:w-8/12">
            <article className="animate-pulse">
              {/* Title Skeleton */}
              <div className="mb-8">
                <div className="mb-4 h-12 w-full rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-12 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>

              {/* Date Skeleton */}
              <div className="mb-6 h-4 w-48 rounded bg-gray-200 dark:bg-gray-700"></div>

              {/* Image Skeleton */}
              <div className="mb-8 h-96 w-full rounded-xl bg-gray-200 dark:bg-gray-700"></div>

              {/* Content Skeleton */}
              <div className="space-y-4">
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-4/6 rounded bg-gray-200 dark:bg-gray-700"></div>

                <div className="py-4"></div>

                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>

                <div className="py-4"></div>

                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
