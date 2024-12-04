import { Star, Search } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function ReviewsPage() {
  const reviews = await prisma.article.findMany({
    where: {
      published: true,
      category: { equals: 'REVIEW' },
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tech Reviews</h1>
          <p className="text-lg text-gray-600">
            Discover our in-depth analysis of both modern and retro tech
          </p>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Link 
              key={review.id}
              href={`/reviews/${review.slug}`}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
            >
              <div className="aspect-video relative bg-gray-100">
                <img 
                  src={review.imageUrl} 
                  alt={review.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                    {review.title}
                  </h4>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{review.summary}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">By {review.author.name}</span>
                  <span className="text-gray-500">
                    {format(new Date(review.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {reviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No reviews published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
