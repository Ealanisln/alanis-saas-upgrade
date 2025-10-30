'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BlogError({ error, reset }: ErrorProps) {
  const _t = useTranslations('blog');
  const tCommon = useTranslations('common');

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Blog route error:', error);
    }
  }, [error]);

  return (
    <section className="pb-[120px] pt-[150px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 lg:w-8/12">
            <div className="text-center">
              <div className="mb-10 inline-flex h-32 w-32 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
                <svg
                  className="h-16 w-16 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl">
                Unable to Load Blog
              </h1>
              <p className="mb-8 text-base text-body-color dark:text-body-color-dark">
                We encountered an error while loading the blog content. This could be a temporary issue.
              </p>
              {process.env.NODE_ENV === 'development' && error.message && (
                <div className="mb-8 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                  <p className="text-sm text-left text-red-800 dark:text-red-200">
                    {error.message}
                  </p>
                </div>
              )}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <button
                  onClick={reset}
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-7 py-3 text-center text-base font-medium text-white hover:bg-primary/90"
                >
                  {tCommon('retry') || 'Try again'}
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-lg border border-primary px-7 py-3 text-center text-base font-medium text-primary hover:bg-primary/5 dark:border-white dark:text-white"
                >
                  {tCommon('backHome') || 'Go back home'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
