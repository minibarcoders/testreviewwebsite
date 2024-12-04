import { ArticleService } from '../../services/articleService';
import { Metadata } from 'next';
import BlogPostContent from './BlogPostContent';

type Props = {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export async function generateMetadata(
  props: Props,
  parent: Promise<Metadata>
): Promise<Metadata> {
  const post = await ArticleService.getBlogPostBySlug(props.params.slug);
  
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

export default async function BlogPost(props: Props) {
  const post = await ArticleService.getBlogPostBySlug(props.params.slug);
  return <BlogPostContent post={post} />;
} 