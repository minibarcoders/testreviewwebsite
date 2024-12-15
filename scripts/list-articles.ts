import { prisma } from '../app/lib/prisma';

async function listArticles() {
  try {
    const articles = await prisma.article.findMany();
    console.log('Articles:', JSON.stringify(articles, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listArticles();
