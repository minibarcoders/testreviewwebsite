import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
};

// Try to reuse existing client during development
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Handle shutdown gracefully
process.on('beforeExit', () => {
  void prisma.$disconnect();
});

// Add error logging
if (process.env.NODE_ENV === 'production') {
  prisma.$use(async (params, next) => {
    try {
      return await next(params);
    } catch (error) {
      console.error('Prisma Query Error:', {
        model: params.model,
        action: params.action,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  });
}

export default prisma;
