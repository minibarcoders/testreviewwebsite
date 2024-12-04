const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@fixedorcustom.com';
  const password = 'admin123'; // Change this to a secure password
  const name = 'Admin User';

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
      },
      create: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
      },
    });

    console.log('Admin user created/updated successfully:', user);
  } catch (error) {
    console.error('Error managing admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
