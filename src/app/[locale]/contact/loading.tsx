export default function ContactLoading() {
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
            <div className="mb-3 h-9 w-36 rounded-lg bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-72 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </section>

      {/* Contact Form Skeleton */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl animate-pulse space-y-6">
            {/* Name field */}
            <div>
              <div className="mb-2 h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-11 w-full rounded-md border border-t-border bg-gray-200 dark:bg-gray-700" />
            </div>
            {/* Email field */}
            <div>
              <div className="mb-2 h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-11 w-full rounded-md border border-t-border bg-gray-200 dark:bg-gray-700" />
            </div>
            {/* Message field */}
            <div>
              <div className="mb-2 h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-32 w-full rounded-md border border-t-border bg-gray-200 dark:bg-gray-700" />
            </div>
            {/* Submit button */}
            <div className="h-11 w-32 rounded-md bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </section>
    </div>
  );
}
