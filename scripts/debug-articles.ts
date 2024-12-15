import { Article } from '@prisma/client';
import { prisma } from '../app/lib/prisma';

async function debugArticles() {
  try {
    console.log('\nFetching all articles...');
    const articles = await prisma.article.findMany();
    console.log('Total articles found:', articles.length);
    console.log('Articles:', articles.map((a: Article) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      published: a.published
    })));

    if (articles.length > 0) {
      const firstArticle = articles[0];
      console.log('\nTrying to fetch first article by slug:', firstArticle.slug);
      const articleBySlug = await prisma.article.findUnique({
        where: { slug: firstArticle.slug }
      });
      console.log('Article found by slug:', articleBySlug);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugArticles();
