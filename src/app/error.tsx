'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">Error</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mb-8">Something went wrong!</h2>
        <p className="text-lg text-gray-600 mb-8">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
}
