import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';
import { format } from 'date-fns';

interface Rating {
  overall: number;
  design: number;
  features: number;
  performance: number;
  value: number;
}

interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  imageUrl: string;
  slug: string;
  createdAt: Date;
  rating: Rating | null;
  author: {
    name: string;
  };
}

export default async function ReviewsPage() {
  const reviews = await prisma.article.findMany({
    where: {
      category: Category.REVIEW,
      published: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10,
    include: {
      author: true
    }
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Reviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.map((review) => (
          <article 
            key={review.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <Link href={`/reviews/${review.slug}`}>
              <div className="relative aspect-[16/9]">
                <Image
                  src={review.imageUrl}
                  alt={review.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-gray-900">
                  {review.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {review.summary}
                </p>
                {review.rating && (
                  <div className="flex items-center mb-4 text-yellow-500">
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 15.934l-6.18 3.254 1.18-6.892L.083 7.514l6.92-1.006L10 0l2.997 6.508 6.92 1.006-4.917 4.782 1.18 6.892z"
                      />
                    </svg>
                    <span className="font-medium">{review.rating.overall}/10</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <span>{review.author.name}</span>
                  <span className="mx-2">•</span>
                  <time>{format(new Date(review.createdAt), 'MMMM d, yyyy')}</time>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
} 