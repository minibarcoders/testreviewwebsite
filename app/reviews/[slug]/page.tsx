import { FC } from 'react';
import { ArticleService } from '../../services/articleService';
import { Metadata } from 'next';
import ReviewContent from './ReviewContent';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateStaticParams() {
  const reviews = await ArticleService.getLatestReviews(100);
  return reviews.map((review) => ({
    slug: review.slug,
  }));
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const review = await ArticleService.getReviewBySlug(params.slug).catch(() => null);
  
  if (!review) {
    return {
      title: 'Review Not Found | Fixed or Custom',
      description: 'The requested review could not be found.',
    };
  }
  
  return {
    title: `${review.title} Review | Fixed or Custom`,
    description: review.summary,
    openGraph: {
      title: review.title,
      description: review.summary,
      images: [review.imageUrl],
    },
  };
}

const ReviewPage: FC<PageProps> = async ({ params }) => {
  const review = await ArticleService.getReviewBySlug(params.slug).catch(() => null);
  
  if (!review) {
    notFound();
  }

  return <ReviewContent review={review} />;
};

export default ReviewPage; 