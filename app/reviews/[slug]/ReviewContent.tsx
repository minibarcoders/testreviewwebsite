'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ReviewArticle } from '@/services/articleService';
import { format } from 'date-fns';
import ScoreDisplay from '@/components/ui/ScoreDisplay';

type Props = {
  review: ReviewArticle;
};

export default function ReviewContent({ review }: Props) {
  const { trackEvent } = useAnalytics();

  return (
    <article className="min-h-screen pt-32 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <Link href="/reviews" className="hover:text-indigo-600">Reviews</Link>
            <span>•</span>
            <time>{format(new Date(review.createdAt), 'MMMM d, yyyy')}</time>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{review.title}</h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                {review.author.image ? (
                  <Image
                    src={review.author.image}
                    alt={review.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-lg font-medium text-slate-600">
                    {review.author.name[0]}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium">{review.author.name}</div>
                <div className="text-sm text-slate-600">Tech Reviewer</div>
              </div>
            </div>
            <ScoreDisplay score={review.rating} size="lg" />
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
          <Image
            src={review.imageUrl}
            alt={review.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="prose lg:prose-lg mx-auto">
          <div dangerouslySetInnerHTML={{ __html: review.content }} />
        </div>

        {/* Pros & Cons */}
        <div className="grid md:grid-cols-2 gap-8 my-12">
          <div className="bg-emerald-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-emerald-800 mb-4">Pros</h3>
            <ul className="space-y-2">
              {review.pros.map((pro, index) => (
                <li key={index} className="flex items-center gap-2 text-emerald-700">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-rose-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-rose-800 mb-4">Cons</h3>
            <ul className="space-y-2">
              {review.cons.map((con, index) => (
                <li key={index} className="flex items-center gap-2 text-rose-700">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Specifications */}
        {review.specifications && (
          <div className="my-12">
            <h3 className="text-2xl font-bold mb-6">Specifications</h3>
            <div className="bg-slate-50 rounded-xl p-6">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {Object.entries(review.specifications).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-sm font-medium text-slate-600">{key}</dt>
                    <dd className="mt-1 text-slate-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}

        {/* Verdict */}
        <div className="my-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-4">Verdict</h3>
          <p className="text-lg text-slate-700">{review.verdict}</p>
        </div>
      </div>
    </article>
  );
} 