export default function BlogLoading() {
  return (
    <div className="min-h-screen">
      {/* Breadcrumb Skeleton */}
      <section className="border-b border-t-border pb-8 pt-28 lg:pb-12 lg:pt-[150px]">
        <div className="container">
          <div className="mx-auto max-w-3xl animate-pulse">
            {/* Breadcrumb nav */}
            <div className="mb-4 flex items-center gap-2">
              <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-2 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-10 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            {/* Title */}
            <div className="mb-3 h-9 w-32 rounded-lg bg-gray-200 dark:bg-gray-700" />
            {/* Description */}
            <div className="h-6 w-72 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </section>

      {/* Blog Grid Skeleton */}
      <section className="pb-8 pt-8 md:pb-16 md:pt-16">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-lg border border-t-border bg-t-surface"
              >
                {/* Image */}
                <div className="h-48 w-full bg-gray-200 dark:bg-gray-700" />
                <div className="p-5">
                  {/* Title */}
                  <div className="mb-3 h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                  {/* Description */}
                  <div className="mb-2 h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="mb-4 h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
                  {/* Date */}
                  <div className="h-3 w-28 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
