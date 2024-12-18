import bcrypt from 'bcryptjs';
import prisma from './lib/prisma';

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('Usage: ts-node debug-password.ts <email>');
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.error('User not found');
      process.exit(1);
    }

    console.log('Stored hash:', user.password);
    console.log('Hash length:', user.password.length);
    console.log('Hash format check:', user.password.startsWith('$2'));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();