import { ArticleService } from '../../services/articleService';
import { Metadata } from 'next';
import ReviewContent from './ReviewContent';

interface Props {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const review = await ArticleService.getReviewBySlug(params.slug);
  
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

export default async function ReviewPage({ params }: Props) {
  const review = await ArticleService.getReviewBySlug(params.slug);
  return <ReviewContent review={review} />;
} 