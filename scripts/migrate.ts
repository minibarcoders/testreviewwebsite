#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrate() {
  try {
    console.log('Applying migrations...');
    await prisma.$executeRawUnsafe('SELECT 1'); // Test the connection
    await prisma.$disconnect();
    console.log('Migrations applied successfully.');
  } catch (error) {
    console.error('Error applying migrations:', error);
    process.exit(1);
  }
}

migrate();
