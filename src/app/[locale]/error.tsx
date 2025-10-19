'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LocaleError({ error, reset }: ErrorProps) {
  const t = useTranslations('common');

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Locale route error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 dark:bg-gray-dark">
      <div className="mx-auto max-w-[550px] text-center">
        <div className="mb-10">
          <svg
            className="mx-auto h-32 w-32 text-red-500"
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
          {t('error') || 'Something went wrong!'}
        </h1>
        <p className="mb-8 text-base text-body-color dark:text-body-color-dark">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-8 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-200">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-300">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-7 py-3 text-center text-base font-medium text-white hover:bg-primary/90 dark:shadow-submit-dark"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-primary px-7 py-3 text-center text-base font-medium text-primary hover:bg-primary/5 dark:border-white dark:text-white"
          >
            Go back home
          </a>
        </div>
      </div>
    </div>
  );
}
