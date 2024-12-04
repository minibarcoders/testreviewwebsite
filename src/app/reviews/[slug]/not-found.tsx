import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl py-16 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900">Review not found</h2>
      <p className="mt-4 text-lg text-gray-600">
        Sorry, we couldn't find the review you're looking for.
      </p>
      <div className="mt-8">
        <Link
          href="/reviews"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          View all reviews
        </Link>
      </div>
    </div>
  );
}
