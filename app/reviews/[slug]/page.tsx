import { ArticleService } from '../../services/articleService';
import { Metadata } from 'next';
import ReviewContent from './ReviewContent';

type Props = {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export async function generateMetadata(
  props: Props,
  parent: Promise<Metadata>
): Promise<Metadata> {
  const review = await ArticleService.getReviewBySlug(props.params.slug);
  
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

export default async function ReviewPage(props: Props) {
  const review = await ArticleService.getReviewBySlug(props.params.slug);
  return <ReviewContent review={review} />;
} 