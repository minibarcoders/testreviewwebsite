import { ArticleService } from '../services/articleService';
import Link from 'next/link';
import Image from 'next/image';

export default async function ReviewsPage() {
  const reviews = await ArticleService.getLatestReviews(10);

  return (
    <main className="min-h-screen pt-32 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Tech Reviews</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Link key={review.id} href={`/reviews/${review.slug}`}>
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4">
                <Image
                  src={review.imageUrl}
                  alt={review.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
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
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
} 