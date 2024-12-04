'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-32">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Something went wrong!</h1>
        <p className="text-lg text-slate-600 mb-8">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium 
                     hover:bg-indigo-500 transition-colors duration-300"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium 
                     hover:bg-slate-200 transition-colors duration-300"
          >
            Go back home
          </Link>
        </div>
      </div>
    </main>
  );
}
