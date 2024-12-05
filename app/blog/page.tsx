import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';
import { format } from 'date-fns';

interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  imageUrl: string;
  slug: string;
  createdAt: Date;
  author: {
    name: string;
  };
}

export default async function BlogPage() {
  const posts = await prisma.article.findMany({
    where: {
      category: Category.BLOG,
      published: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10,
    include: {
      author: true
    }
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <article 
            key={post.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <Link href={`/blog/${post.slug}`}>
              <div className="relative aspect-[16/9]">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-gray-900">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {post.summary}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{post.author.name}</span>
                  <span className="mx-2">•</span>
                  <time>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</time>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
} 