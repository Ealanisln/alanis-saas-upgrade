export default function BlogLoading() {
  return (
    <section className="pb-[120px] pt-[150px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            {/* Page Title Skeleton */}
            <div className="mb-12 animate-pulse">
              <div className="mx-auto h-12 w-64 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>

            {/* Blog Grid Skeleton */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-lg bg-white p-4 shadow-md dark:bg-gray-dark"
                >
                  {/* Image Skeleton */}
                  <div className="mb-4 h-48 w-full rounded-lg bg-gray-200 dark:bg-gray-700"></div>

                  {/* Title Skeleton */}
                  <div className="mb-3 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>

                  {/* Description Skeleton */}
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
                  </div>

                  {/* Date Skeleton */}
                  <div className="mt-4 h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
