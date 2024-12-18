const bcryptjs = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { email: 'admin@fixedorcustom.com' },
    });
    
    console.log('Found user:', user);
    
    const password = 'Tech2024!';
    console.log('Testing password:', password);
    console.log('Stored hash:', user.password);
    
    // Create a new hash with the same password
    const newHash = await bcryptjs.hash(password, 10);
    console.log('New hash of same password:', newHash);
    
    // Compare the password
    const isValid = await bcryptjs.compare(password, user.password);
    console.log('Password valid:', isValid);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();