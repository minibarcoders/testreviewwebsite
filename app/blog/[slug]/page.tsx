import { ArticleService } from '../../services/articleService';
import { Metadata } from 'next';
import BlogPostContent from './BlogPostContent';

type PageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
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

export default async function BlogPost({ params }: PageProps) {
  const post = await ArticleService.getBlogPostBySlug(params.slug);
  return <BlogPostContent post={post} />;
} 