import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { prisma } from '@/lib/prisma';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const article = await prisma.article.findUnique({
    where: {
      slug: params.slug,
      published: true,
      category: { not: 'REVIEW' },
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }

  return {
    title: article.title,
    description: article.summary,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await prisma.article.findUnique({
    where: {
      slug: params.slug,
      published: true,
      category: { not: 'REVIEW' },
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-slate-600 mb-4">
            <span>{article.category}</span>
            <span className="mx-2">•</span>
            <time>{format(new Date(article.createdAt), 'MMMM d, yyyy')}</time>
          </div>
          
          <h1 className="text-4xl font-bold text-slate-900 mb-3">{article.title}</h1>
          {article.subtitle && (
            <p className="text-xl text-slate-600 mb-6">{article.subtitle}</p>
          )}
          
          {/* Author Info */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
              <span className="font-medium text-slate-600">
                {article.author.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <div className="font-medium text-slate-900">By {article.author.name}</div>
              <div className="text-sm text-slate-600">Tech Writer</div>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative aspect-[2/1] mb-8 bg-slate-100 rounded-lg overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Summary */}
        <div className="bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-lg p-6 mb-8">
          <p className="text-lg text-slate-600">{article.summary}</p>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </article>
    </div>
  );
}
