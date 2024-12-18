const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = async () => {
  // Kill the development server
  if (global.__SERVER__) {
    global.__SERVER__.kill('SIGTERM');
  }

  try {
    // Clean up database
    await prisma.$executeRawUnsafe(`
      DROP SCHEMA IF EXISTS public CASCADE;
      CREATE SCHEMA public;
    `);

    // Clean up Redis
    const Redis = require('ioredis');
    const redis = new Redis(process.env.REDIS_URL);
    await redis.flushall();
    await redis.quit();

    // Clean up any uploaded test files
    try {
      execSync('rm -rf public/uploads/test-*');
    } catch (error) {
      console.warn('Failed to clean up test uploads:', error);
    }

    // Clean up any test logs
    try {
      execSync('rm -rf logs/test-*');
    } catch (error) {
      console.warn('Failed to clean up test logs:', error);
    }

    console.log('E2E test cleanup completed successfully');
  } catch (error) {
    console.error('Error during E2E test cleanup:', error);
  } finally {
    // Disconnect from database
    await prisma.$disconnect();
  }

  // Clear global setup data
  delete global.__E2E_CONFIG__;
  delete global.__SERVER__;
};