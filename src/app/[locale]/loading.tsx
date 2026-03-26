export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-dark">
      {/* Hero Section Skeleton */}
      <section className="relative flex min-h-[100dvh] w-full items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center lg:justify-between">
            {/* Left column */}
            <div className="max-w-2xl animate-pulse py-24 lg:py-0">
              {/* Terminal prompt */}
              <div className="mb-4 h-4 w-64 rounded bg-gray-200 dark:bg-gray-700" />

              {/* Name */}
              <div className="mb-6 space-y-3">
                <div className="h-14 w-96 rounded-lg bg-gray-200 dark:bg-gray-700 sm:h-16 lg:h-20" />
                <div className="h-14 w-64 rounded-lg bg-gray-200 dark:bg-gray-700 sm:h-16 lg:h-20" />
              </div>

              {/* Bio */}
              <div className="mb-2 h-6 w-80 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mb-6 space-y-2">
                <div className="h-5 w-full max-w-lg rounded bg-gray-200 dark:bg-gray-700" />
              </div>

              {/* Badges */}
              <div className="mb-8 flex flex-wrap gap-2">
                <div className="h-7 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-7 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-7 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-7 w-28 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>

              {/* Social icons */}
              <div className="mb-8 flex items-center gap-5">
                <div className="h-6 w-6 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-6 w-6 rounded bg-gray-200 dark:bg-gray-700" />
              </div>

              {/* CTA buttons */}
              <div className="flex items-center gap-4">
                <div className="h-10 w-32 rounded-md bg-gray-200 dark:bg-gray-700" />
                <div className="h-10 w-28 rounded-md bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>

            {/* Right column — Code block skeleton (desktop only) */}
            <div className="hidden w-full max-w-md shrink-0 animate-pulse lg:block">
              <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-gradient-to-b from-gray-50 to-gray-100/80 dark:border-white/[0.08] dark:bg-white/[0.04] dark:from-gray-800 dark:to-gray-900">
                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-3">
                  <div className="flex gap-[7px]">
                    <span className="h-[13px] w-[13px] rounded-full bg-gray-300 dark:bg-gray-600" />
                    <span className="h-[13px] w-[13px] rounded-full bg-gray-300 dark:bg-gray-600" />
                    <span className="h-[13px] w-[13px] rounded-full bg-gray-300 dark:bg-gray-600" />
                  </div>
                  <div className="flex-1 text-center">
                    <div className="mx-auto h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="w-[54px]" />
                </div>
                {/* Separator */}
                <div className="mx-3 h-px bg-gray-200 dark:bg-gray-700" />
                {/* Code lines */}
                <div className="space-y-2.5 px-5 py-5">
                  {[
                    "w-28",
                    "w-40",
                    "w-52",
                    "w-56",
                    "w-40",
                    "w-20",
                    "w-64",
                    "w-64",
                    "w-56",
                    "w-16",
                    "w-40",
                    "w-12",
                  ].map((width, i) => (
                    <div key={i} className="flex items-center gap-5">
                      <div className="h-3 w-4 rounded bg-gray-200 dark:bg-gray-700" />
                      <div
                        className={`h-3.5 ${width} rounded bg-gray-200 dark:bg-gray-700`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
