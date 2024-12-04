import Image from 'next/image';
import Link from 'next/link';
import { type Review } from '@/lib/notion';
import PerformanceScore from './PerformanceScore';

type ReviewCardProps = {
  review: Review;
  priority?: boolean;
};

export default function ReviewCard({ review, priority = false }: ReviewCardProps) {
  return (
    <Link
      href={`/reviews/${review.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:scale-[1.02]"
    >
      <div className="relative aspect-[16/9]">
        <Image
          src={review.coverImage}
          alt={review.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={priority}
        />
        <div className="absolute bottom-4 right-4">
          <PerformanceScore score={review.performance.score} size="sm" />
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">
            {review.title}
          </h2>
          <p className="mt-2 text-gray-600 line-clamp-2">{review.excerpt}</p>
        </div>
        
        <div className="mt-4 flex items-center gap-x-3">
          <Image
            src={review.author.avatar}
            alt={review.author.name}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">{review.author.name}</p>
            <p className="text-sm text-gray-500">
              {new Date(review.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
