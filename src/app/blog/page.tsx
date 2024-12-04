import { format } from 'date-fns';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { MessageCircle, Heart, Share2, Bookmark } from 'lucide-react';

export const metadata = {
  title: 'Blog | Tech Review Site',
  description: 'Latest tech insights, news, and discussions from our community.',
};

export default async function BlogPage() {
  const posts = await prisma.article.findMany({
    where: {
      published: true,
      category: { equals: 'BLOG' },
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Tech Blog</h1>
            
            {/* Blog Posts */}
            <div className="space-y-8">
              {posts.map((post) => (
                <article 
                  key={post.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="p-6">
                    {/* Author Info */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
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
                          {format(new Date(post.createdAt), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-bold text-slate-900 mb-2 hover:text-purple-600 transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    
                    <p className="text-slate-600 mb-4">{post.summary}</p>

                    {/* Image if exists */}
                    {post.imageUrl && (
                      <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Interaction Buttons */}
                    <div className="flex items-center gap-6 text-slate-500">
                      <button className="flex items-center gap-2 hover:text-purple-600 transition-colors">
                        <Heart className="w-5 h-5" />
                        <span className="text-sm">123</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-purple-600 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">45</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-purple-600 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                      <button className="flex items-center gap-2 hover:text-purple-600 transition-colors ml-auto">
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:block">
            <div className="sticky top-8 space-y-8">
              {/* Trending Topics */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Trending Topics</h2>
                <div className="space-y-3">
                  {['AI & Machine Learning', 'Web Development', 'Cybersecurity', 'Mobile Tech', 'Cloud Computing'].map((topic) => (
                    <Link
                      key={topic}
                      href={`/blog/topic/${topic.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                      className="block text-slate-600 hover:text-purple-600 transition-colors"
                    >
                      #{topic}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Popular Posts */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Popular Posts</h2>
                <div className="space-y-4">
                  {posts.slice(0, 3).map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <h3 className="text-slate-900 group-hover:text-purple-600 transition-colors font-medium line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                      </p>
                    </Link>
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
