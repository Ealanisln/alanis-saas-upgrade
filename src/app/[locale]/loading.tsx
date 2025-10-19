export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-dark">
      {/* Hero Section Skeleton */}
      <section className="relative z-10 overflow-hidden pb-16 pt-[120px] md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[800px] animate-pulse text-center">
                {/* Title Skeleton */}
                <div className="mb-9 flex flex-col items-center gap-4">
                  <div className="h-16 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-16 w-2/3 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {/* Description Skeleton */}
                <div className="mb-11 space-y-3">
                  <div className="mx-auto h-6 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="mx-auto h-6 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="mx-auto h-6 w-4/6 rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {/* Buttons Skeleton */}
                <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <div className="h-14 w-48 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-14 w-48 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <div className="mb-16 animate-pulse">
            <div className="mx-auto h-12 w-64 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-lg bg-white p-6 dark:bg-gray-dark"
              >
                <div className="mb-4 h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="mb-3 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
