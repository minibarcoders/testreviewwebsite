import prisma from './lib/prisma';

async function main() {
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

    console.log('Articles:', JSON.stringify(articles, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
