export default function BlogPostLoading() {
  return (
    <section className="pb-[120px] pt-[150px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full animate-pulse px-4 lg:w-8/12">
            {/* Title */}
            <div className="mb-8 space-y-3">
              <div className="h-9 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="h-9 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Date */}
            <div className="mb-6 h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />

            {/* Image */}
            <div className="mt-8 h-80 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />

            {/* Content */}
            <div className="mt-16 space-y-4">
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-4/6 rounded bg-gray-200 dark:bg-gray-700" />

              <div className="py-3" />

              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />

              <div className="py-3" />

              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
