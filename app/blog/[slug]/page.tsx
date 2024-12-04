import { ArticleService } from '@/services/articleService';
import { Metadata } from 'next';
import { format } from 'date-fns';
import BlogPostContent from './BlogPostContent';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await ArticleService.getBlogPostBySlug(params.slug);
  
  return {
    title: `${post.title} | Fixed or Custom`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      images: [post.imageUrl],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const post = await ArticleService.getBlogPostBySlug(params.slug);

  return <BlogPostContent post={post} />;
} 