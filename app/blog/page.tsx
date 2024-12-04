import Link from 'next/link';
import { blogPosts } from '../../data/blog-posts';

export default function BlogPage() {
  const posts = Object.values(blogPosts);

  return (
    <main className="min-h-screen pt-32 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <article 
              key={post.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="relative h-48 md:h-64">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">
                    {post.category}
                  </div>
                  {post.readingTime && (
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {post.readingTime}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-3 hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        {post.author[0]}
                      </div>
                      <span className="text-gray-700">{post.author}</span>
                    </div>
                    <span className="text-gray-500">{post.date}</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
} 