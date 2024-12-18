import prisma from './lib/prisma';

async function debugArticles() {
  try {
    const articles = await prisma.article.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    console.log('Articles with full content:');
    articles.forEach((article) => {
      console.log('\n-------------------');
      console.log(`Title: ${article.title}`);
      console.log(`Author: ${article.author.name} (${article.author.email})`);
      console.log(`Content length: ${article.content.length} characters`);
      console.log(`First 500 chars: ${article.content.substring(0, 500)}...`);
      console.log('-------------------\n');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugArticles();
