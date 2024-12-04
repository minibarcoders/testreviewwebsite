import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { MessageCircle, Heart, Share2, Bookmark } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const post = await prisma.article.findUnique({
    where: {
      slug: params.slug,
      published: true,
      category: 'BLOG',
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | Tech Blog`,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await prisma.article.findUnique({
    where: {
      slug: params.slug,
      published: true,
      category: 'BLOG',
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  // Get related posts
  const relatedPosts = await prisma.article.findMany({
    where: {
      published: true,
      category: 'BLOG',
      NOT: {
        id: post.id,
      },
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 3,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm">
              {/* Hero Image */}
              {post.imageUrl && (
                <div className="relative aspect-[2/1] rounded-t-xl overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-8">
                {/* Author Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                    {post.author.image ? (
                      <img 
                        src={post.author.image} 
                        alt={post.author.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-medium text-slate-600">
                        {post.author.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{post.author.name}</div>
                    <div className="text-sm text-slate-500">
                      {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h1 className="text-3xl font-bold text-slate-900 mb-4">{post.title}</h1>
                <p className="text-lg text-slate-600 mb-6">{post.summary}</p>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                {/* Interaction Buttons */}
                <div className="flex items-center gap-6 mt-8 pt-8 border-t text-slate-500">
                  <button className="flex items-center gap-2 hover:text-purple-600 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">234</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-purple-600 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">56</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-purple-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="flex items-center gap-2 hover:text-purple-600 transition-colors ml-auto">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <div className="lg:block">
            <div className="sticky top-8 space-y-8">
              {/* Author Bio */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">About the Author</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                    {post.author.image ? (
                      <img 
                        src={post.author.image} 
                        alt={post.author.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-medium text-slate-600 text-xl">
                        {post.author.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{post.author.name}</div>
                    <div className="text-sm text-slate-500">Tech Writer</div>
                  </div>
                </div>
                <p className="text-slate-600">
                  Expert in technology and software development with a passion for sharing knowledge and insights.
                </p>
              </div>

              {/* Related Posts */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Related Posts</h2>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <a
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="block group"
                    >
                      <h3 className="text-slate-900 group-hover:text-purple-600 transition-colors font-medium line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-slate-500">
                        By {relatedPost.author.name} • {format(new Date(relatedPost.createdAt), 'MMM d, yyyy')}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
