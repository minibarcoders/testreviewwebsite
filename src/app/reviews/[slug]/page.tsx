import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { Star, ThumbsUp, ThumbsDown, Award, Keyboard, DollarSign } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

interface Rating {
  overall: number;
  performance: number;
  build: number;
  features: number;
  value: number;
  reliability: number;
}

interface Price {
  store: string;
  price: number;
  link: string;
}

// Convert rating to percentage for progress bars
const getPercentage = (score: number) => (score * 10) + '%';

// Get category icon
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'peripherals':
      return <Keyboard className="w-5 h-5" />;
    default:
      return <Keyboard className="w-5 h-5" />;
  }
};

export async function generateMetadata({ params }: PageProps) {
  const article = await prisma.article.findUnique({
    where: {
      slug: params.slug,
      published: true,
      category: 'REVIEW',
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
      title: 'Review Not Found',
      description: 'The requested review could not be found.',
    };
  }

  return {
    title: article.title,
    description: article.summary,
  };
}

export default async function ReviewPage({ params }: PageProps) {
  const article = await prisma.article.findUnique({
    where: {
      slug: params.slug,
      published: true,
      category: 'REVIEW',
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

  const rating = article.rating as Rating || {
    overall: 0,
    performance: 0,
    build: 0,
    features: 0,
    value: 0,
    reliability: 0,
  };

  const prices = article.prices as Price[] || [];
  const pros = article.pros || [];
  const cons = article.cons || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-slate-600 mb-4">
            {getCategoryIcon(article.category)}
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
              <div className="text-sm text-slate-600">Tech Reviewer</div>
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

        {/* Quick Verdict */}
        <section className="bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Award className="text-blue-600" />
            Quick Verdict
          </h2>
          <p className="text-slate-600 mb-6">{article.summary}</p>
          
          {/* Overall Score */}
          {rating.overall > 0 && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-blue-600 fill-current" />
                <span className="text-2xl font-bold text-slate-900">{rating.overall}</span>
                <span className="text-slate-600">/5</span>
              </div>
              <div className="text-sm text-slate-600">Overall Score</div>
            </div>
          )}

          {/* Detailed Scores */}
          {rating.overall > 0 && (
            <div className="grid gap-4">
              {Object.entries(rating).map(([category, score]) => {
                if (category === 'overall') return null;
                return (
                  <div key={category} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium text-slate-700 capitalize">
                      {category}
                    </div>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: getPercentage(score) }}
                      ></div>
                    </div>
                    <div className="w-12 text-sm text-slate-600 text-right">
                      {score}/10
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Pros & Cons */}
        {(pros.length > 0 || cons.length > 0) && (
          <section className="grid md:grid-cols-2 gap-6 mb-8">
            {pros.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-4">
                  <ThumbsUp className="text-green-600" />
                  Pros
                </h3>
                <ul className="space-y-3">
                  {pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-600">
                      <span className="text-green-600 mt-1">•</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {cons.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-4">
                  <ThumbsDown className="text-red-600" />
                  Cons
                </h3>
                <ul className="space-y-3">
                  {cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-600">
                      <span className="text-red-600 mt-1">•</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Price Comparison */}
        {prices.length > 0 && (
          <section className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <DollarSign className="text-blue-600" />
              Where to Buy
            </h2>
            <div className="space-y-4">
              {prices.map((item, index) => (
                <a 
                  key={index}
                  href={item.link}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-500 transition-colors"
                >
                  <span className="font-medium text-slate-900">{item.store}</span>
                  <span className="text-blue-600 font-bold">${item.price}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Article Content */}
        <section className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </section>
      </article>
    </div>
  );
}
