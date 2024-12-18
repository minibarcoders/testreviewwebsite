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
    console.log('\nTesting with password:', password);
    
    // Create a new hash with the same password
    const newHash = await bcryptjs.hash(password, 10);
    console.log('\nStored hash:', user.password);
    console.log('New hash   :', newHash);
    
    // Compare the password with stored hash
    const isValidStored = await bcryptjs.compare(password, user.password);
    console.log('\nCompare with stored hash:', isValidStored);
    
    // Compare the password with new hash (should always be true)
    const isValidNew = await bcryptjs.compare(password, newHash);
    console.log('Compare with new hash   :', isValidNew);
    
    // Compare the hashes directly (should be false as salts are different)
    console.log('\nHashes match directly:', user.password === newHash);
    
    // Get hash info
    console.log('\nStored hash info:', bcryptjs.getRounds(user.password), 'rounds');
    console.log('New hash info   :', bcryptjs.getRounds(newHash), 'rounds');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();