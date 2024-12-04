import { ArticleService } from '../../services/articleService';
import { Metadata } from 'next';
import BlogPostContent from './BlogPostContent';

interface GenerateMetadataProps {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export async function generateMetadata(
  { params }: GenerateMetadataProps
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

interface PageProps {
  params: { slug: string };
}

export default async function BlogPost({ params }: PageProps) {
  const post = await ArticleService.getBlogPostBySlug(params.slug);
  return <BlogPostContent post={post} />;
} 