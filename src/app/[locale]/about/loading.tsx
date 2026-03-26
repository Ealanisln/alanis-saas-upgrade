export default function AboutLoading() {
  return (
    <div className="min-h-screen">
      {/* Breadcrumb Skeleton */}
      <section className="border-b border-t-border pb-8 pt-28 lg:pb-12 lg:pt-[150px]">
        <div className="container">
          <div className="mx-auto max-w-3xl animate-pulse">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-2 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="mb-3 h-9 w-40 rounded-lg bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-80 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </section>

      {/* About Section Skeleton */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl animate-pulse space-y-4">
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-4/6 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </section>

      {/* Tech Stack Skeleton */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mb-10 animate-pulse">
            <div className="mx-auto h-8 w-48 rounded-lg bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="flex animate-pulse flex-col items-center gap-2 rounded-lg border border-t-border p-4"
              >
                <div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
