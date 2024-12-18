import Redis from 'ioredis';

let redis: Redis | null = null;

try {
  if (process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => {
        // Only retry once, then give up
        return times >= 1 ? null : 100;
      },
      enableOfflineQueue: false,
    });

    redis.on('error', (error) => {
      console.warn('Redis connection warning:', error);
      // Don't crash on connection errors
    });
  }
} catch (error) {
  console.warn('Redis initialization warning:', error);
  // Don't crash on initialization errors
}

export default redis;

// Helper function to safely interact with Redis
export async function withRedis<T>(
  operation: (client: Redis) => Promise<T>,
  fallback: T
): Promise<T> {
  if (!redis) {
    return fallback;
  }

  try {
    return await operation(redis);
  } catch (error) {
    console.warn('Redis operation warning:', error);
    return fallback;
  }
}

// Cache operations
export async function cacheGet(key: string): Promise<string | null> {
  return await withRedis(
    async (client) => await client.get(key),
    null
  );
}

export async function cacheSet(key: string, value: string, expireSeconds?: number): Promise<void> {
  await withRedis(
    async (client) => {
      if (expireSeconds) {
        await client.setex(key, expireSeconds, value);
      } else {
        await client.set(key, value);
      }
    },
    undefined
  );
}

export async function cacheInvalidate(key: string): Promise<void> {
  await withRedis(
    async (client) => await client.del(key),
    undefined
  );
}

export function generateCacheKey(...parts: string[]): string {
  return parts.join(':');
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationInfo;
}

export function getPaginationParams(params: PaginationParams) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 10));
  const skip = (page - 1) * limit;

  return {
    skip,
    take: limit,
    page,
  };
}