'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAnalytics } from '@/hooks/useAnalytics';
import { BlogArticle } from '@/services/articleService';
import { format } from 'date-fns';

type Props = {
  post: BlogArticle;
};

export default function BlogPostContent({ post }: Props) {
  const { trackEvent } = useAnalytics();

  return (
    <article className="min-h-screen pt-32 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <Link href="/blog" className="hover:text-indigo-600">Blog</Link>
            <span>•</span>
            <time>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</time>
            {post.readingTime && (
              <>
                <span>•</span>
                <span>{post.readingTime}</span>
              </>
            )}
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                {post.author.image ? (
                  <Image
                    src={post.author.image}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-lg font-medium text-slate-600">
                    {post.author.name[0]}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium">{post.author.name}</div>
                <div className="text-sm text-slate-600">Writer</div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="prose lg:prose-lg mx-auto">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts Placeholder */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="text-slate-600">
            Coming soon...
          </div>
        </div>
      </div>
    </article>
  );
} 