import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          We couldn't find the page you're looking for.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium 
                   hover:bg-indigo-700 transition-colors inline-block"
        >
          Go back home
        </Link>
      </div>
    </main>
  );
}
