import bcrypt from 'bcryptjs';
import prisma from './lib/prisma';

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage: ts-node verify-password.ts <email> <password>');
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

    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password is valid:', isValid);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();