'use client';

import { useEffect } from 'react';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-8">
        <div className="mb-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="mb-3 text-2xl font-bold text-gray-900">Something went wrong</h2>
          <p className="mb-2 text-gray-600">
            An unexpected error occurred. Please try again or contact support if the issue persists.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-gray-500 mt-2 font-mono">{error.message}</p>
          )}
        </div>
        <button
          onClick={reset}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

