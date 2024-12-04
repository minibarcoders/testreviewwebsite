import { ArticleService } from '../../services/articleService';
import { Metadata } from 'next';
import BlogPostContent from './BlogPostContent';
import { notFound } from 'next/navigation';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateStaticParams() {
  const posts = await ArticleService.getLatestPosts(100);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await ArticleService.getBlogPostBySlug(params.slug).catch(() => null);
  
  if (!post) {
    return {
      title: 'Post Not Found | Fixed or Custom',
      description: 'The requested blog post could not be found.',
    };
  }
  
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
  const post = await ArticleService.getBlogPostBySlug(params.slug).catch(() => null);
  
  if (!post) {
    notFound();
  }

  return <BlogPostContent post={post} />;
} 