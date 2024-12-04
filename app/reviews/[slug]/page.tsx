import { ArticleService } from '../../services/articleService';
import { Metadata } from 'next';
import ReviewContent from './ReviewContent';

interface GenerateMetadataProps {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export async function generateMetadata(
  { params }: GenerateMetadataProps
): Promise<Metadata> {
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

interface PageProps {
  params: { slug: string };
}

export default async function ReviewPage({ params }: PageProps) {
  const review = await ArticleService.getReviewBySlug(params.slug);
  return <ReviewContent review={review} />;
} 