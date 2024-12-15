const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedTestArticle() {
  try {
    // First create a test admin user if it doesn't exist
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Test Admin',
        password: 'hashed_password', // In a real app, this would be properly hashed
        role: 'ADMIN'
      }
    });

    console.log('Admin user:', adminUser);

    // Create a test article
    const article = await prisma.article.create({
      data: {
        title: 'Test Article',
        content: 'This is a test article content.',
        summary: 'Test article summary',
        slug: 'test-article',
        imageUrl: '/images/placeholder.png',
        category: 'BLOG',
        published: true,
        authorId: adminUser.id
      }
    });

    console.log('Created test article:', article);
  } catch (error) {
    console.error('Error seeding test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestArticle();
