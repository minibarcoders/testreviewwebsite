const bcryptjs = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const nodeCrypto = require('crypto');

const prisma = new PrismaClient();

function generateSlug(title: string) {
  const randomId = nodeCrypto.randomBytes(8).toString('hex');
  return `${title.toLowerCase().replace(/ /g, '-')}-${randomId}`;
}

async function main() {
  const email = 'admin@fixedorcustom.com';
  const password = 'Tech2024!'; // New secure password
  const name = 'Admin User';

  try {
    // Create a new hash
    const hashedPassword = await bcryptjs.hash(password, 10);
    console.log('Generated hash:', hashedPassword);

    // Create or update the admin user
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        name,
        role: 'ADMIN',
      },
      create: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
      },
    });

    console.log('Admin user created/updated successfully:', user);

    // Verify the password works
    const isValid = await bcryptjs.compare(password, user.password);
    console.log('Password verification:', isValid);

    // Create initial reviews
    await prisma.article.create({
      data: {
        title: 'Review of the New MacBook Pro',
        slug: generateSlug('Review of the New MacBook Pro'),
        summary: 'A detailed review of the latest MacBook Pro.',
        content: 'This is a detailed review of the new MacBook Pro...',
        imageUrl: '/images/placeholder.jpg',
        category: 'REVIEW',
        published: true,
        authorId: user.id,
        rating: { overall: 9, design: 9, features: 8, performance: 10, value: 8 },
      },
    });
    await prisma.article.create({
      data: {
        title: 'Review of the New iPad Air',
        slug: generateSlug('Review of the New iPad Air'),
        summary: 'A detailed review of the latest iPad Air.',
        content: 'This is a detailed review of the new iPad Air...',
        imageUrl: '/images/placeholder.jpg',
        category: 'REVIEW',
        published: true,
        authorId: user.id,
        rating: { overall: 8, design: 9, features: 8, performance: 9, value: 7 },
      },
    });

    // Create initial blog posts
    await prisma.article.create({
      data: {
        title: 'Guide to Building a Custom PC',
        slug: generateSlug('Guide to Building a Custom PC'),
        summary: 'A comprehensive guide to building your own custom PC.',
        content: 'This is a comprehensive guide to building your own custom PC...',
        imageUrl: '/images/placeholder.jpg',
        category: 'BLOG',
        published: true,
        authorId: user.id,
      },
    });
    await prisma.article.create({
      data: {
        title: 'The Best Tech Gadgets of 2024',
        slug: generateSlug('The Best Tech Gadgets of 2024'),
        summary: 'A list of the best tech gadgets of 2024.',
        content: 'This is a list of the best tech gadgets of 2024...',
        imageUrl: '/images/placeholder.jpg',
        category: 'BLOG',
        published: true,
        authorId: user.id,
      },
    });

    console.log('Initial reviews and blog posts created successfully.');
    console.log('\nAdmin Login Credentials:');
    console.log('------------------------');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('------------------------');
  } catch (error) {
    console.error('Error managing admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
