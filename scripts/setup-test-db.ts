const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const { config } = require('dotenv');

// Load test environment variables
config({ path: '.env.test' });

const prisma = new PrismaClient();

async function setupTestDatabase() {
  try {
    console.log('Setting up test database...');

    // Reset database
    console.log('Resetting database...');
    await prisma.$executeRawUnsafe(`
      DROP SCHEMA IF EXISTS public CASCADE;
      CREATE SCHEMA public;
    `);

    // Run migrations
    console.log('Running migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });

    // Create test admin user
    console.log('Creating test admin user...');
    await prisma.user.create({
      data: {
        email: 'admin@test.com',
        name: 'Test Admin',
        password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu9kW', // "password123"
        role: 'ADMIN',
      },
    });

    // Create test regular user
    console.log('Creating test regular user...');
    await prisma.user.create({
      data: {
        email: 'user@test.com',
        name: 'Test User',
        password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu9kW', // "password123"
        role: 'USER',
      },
    });

    // Create test articles
    console.log('Creating test articles...');
    await prisma.article.createMany({
      data: [
        {
          title: 'Test Blog Post',
          slug: 'test-blog-post',
          content: 'This is a test blog post content.',
          summary: 'Test blog post summary',
          imageUrl: '/images/test.jpg',
          category: 'BLOG',
          published: true,
          authorId: (await prisma.user.findUnique({ where: { email: 'admin@test.com' } }))!.id,
        },
        {
          title: 'Test Review',
          slug: 'test-review',
          content: 'This is a test review content.',
          summary: 'Test review summary',
          imageUrl: '/images/test.jpg',
          category: 'REVIEW',
          published: true,
          authorId: (await prisma.user.findUnique({ where: { email: 'admin@test.com' } }))!.id,
          rating: {
            overall: 8.5,
            design: 8.0,
            features: 9.0,
            performance: 8.5,
            value: 8.0,
          },
          pros: ['Pro 1', 'Pro 2'],
          cons: ['Con 1', 'Con 2'],
        },
        {
          title: 'Draft Article',
          slug: 'draft-article',
          content: 'This is a draft article content.',
          summary: 'Draft article summary',
          imageUrl: '/images/test.jpg',
          category: 'BLOG',
          published: false,
          authorId: (await prisma.user.findUnique({ where: { email: 'admin@test.com' } }))!.id,
        },
      ],
    });

    console.log('Test database setup complete!');
  } catch (error) {
    console.error('Error setting up test database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  setupTestDatabase();
}

module.exports = { setupTestDatabase };