import Link from 'next/link';
import { reviews } from '../../data/reviews';

export default function ReviewsPage() {
  const reviewsList = Object.values(reviews);

  return (
    <main className="min-h-screen pt-32 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Tech Reviews</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewsList.map((review) => (
            <div key={review.id} className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <img
                  src={review.imageUrl}
                  alt={review.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-indigo-600 
                             shadow-sm group-hover:shadow-md transition-all duration-300">
                  {review.category}
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                  {review.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{review.snippet}</p>
                <div className="flex items-center justify-between">
                  <Link 
                    href={`/reviews/${review.slug}`}
                    className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-500 
                             transition-colors group/link"
                  >
                    Read full review 
                    <span className="ml-1 transform group-hover/link:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </Link>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 