import bcrypt from 'bcryptjs';
import prisma from './lib/prisma';

async function compareHashes() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage: ts-node compare-hashes.ts <email> <password>');
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

    const hash1 = await bcrypt.hash(password, 10);
    const hash2 = user.password;

    console.log('New hash:', hash1);
    console.log('Stored hash:', hash2);
    console.log('Match:', await bcrypt.compare(password, hash2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

compareHashes();