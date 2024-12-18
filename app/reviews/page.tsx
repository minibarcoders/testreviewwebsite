import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '../lib/prisma';
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
  summary: string;
  imageUrl: string;
  slug: string;
  createdAt: Date;
  rating?: any;
  author: {
    name: string;
  };
}

function isRating(rating: any): rating is Rating {
  return rating && typeof rating === 'object' && 'overall' in rating;
}

// Add revalidation to enable ISR
export const revalidate = 3600; // Revalidate every hour

export default async function ReviewsPage() {
  const reviews = await prisma.article.findMany({
    where: {
      category: Category.REVIEW,
      published: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-black text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-indigo-900 opacity-90" />
          <div className="absolute inset-0" style={{
            backgroundImage: 'url(/images/grid.svg)',
            backgroundSize: '30px 30px',
            opacity: 0.2
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Tech Reviews
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl">
            In-depth analysis and hands-on reviews of the latest technology products, from smartphones to laptops and everything in between.
          </p>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <Link 
              key={review.id}
              href={`/reviews/${review.slug}`}
              className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={review.imageUrl}
                  alt={review.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Rating Badge */}
                {review.rating && isRating(review.rating) && (
                  <div className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg">
                    <span className="text-xl font-bold">{(review.rating as Rating).overall}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {review.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {review.summary}
                </p>
                
                {/* Meta */}
                <div className="flex items-center text-sm text-gray-500">
                  <span>{review.author.name}</span>
                  <span className="mx-2">•</span>
                  <time dateTime={review.createdAt.toISOString()}>
                    {format(new Date(review.createdAt), 'MMMM d, yyyy')}
                  </time>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
