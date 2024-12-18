import { PrismaClient, Category } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test admin user
  const hashedPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create test blog post
  await prisma.article.upsert({
    where: { slug: 'welcome-to-our-blog' },
    update: {},
    create: {
      title: 'Welcome to Our Blog',
      content: 'This is our first blog post. Stay tuned for more content!',
      summary: 'Welcome to our new tech review and blog site.',
      imageUrl: '/images/welcome.jpg',
      slug: 'welcome-to-our-blog',
      published: true,
      category: Category.BLOG,
      authorId: admin.id,
    },
  });

  // Create test review
  await prisma.article.upsert({
    where: { slug: 'latest-smartphone-review' },
    update: {},
    create: {
      title: 'Latest Smartphone Review',
      content: 'This is our detailed review of the latest smartphone.',
      summary: 'An in-depth look at the newest flagship phone.',
      imageUrl: '/images/phone.jpg',
      slug: 'latest-smartphone-review',
      published: true,
      category: Category.REVIEW,
      rating: {
        overall: 4.5,
        design: 4.5,
        features: 4.0,
        performance: 4.8,
        value: 4.2,
      },
      pros: ['Great camera', 'Long battery life', 'Premium design'],
      cons: ['High price', 'No headphone jack'],
      authorId: admin.id,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });