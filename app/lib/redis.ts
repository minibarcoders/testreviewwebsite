import Redis from 'ioredis';

// Initialize Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

// Cache TTL in seconds
const DEFAULT_TTL = 60 * 5; // 5 minutes

export interface CacheOptions {
  ttl?: number;
  invalidatePattern?: string;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

export async function cacheSet(
  key: string,
  data: any,
  options: CacheOptions = {}
): Promise<void> {
  try {
    const { ttl = DEFAULT_TTL } = options;
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error('Redis set error:', error);
  }
}

export async function cacheInvalidate(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('Redis invalidate error:', error);
  }
}

export async function generateCacheKey(
  base: string,
  params: Record<string, any>
): Promise<string> {
  const sortedParams = Object.entries(params)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}:${value}`)
    .join(':');

  return `${base}:${sortedParams}`;
}

// Helper function to handle pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export function getPaginationParams(params: PaginationParams = {}): {
  skip: number;
  take: number;
  page: number;
} {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 10));
  const skip = (page - 1) * limit;

  return {
    skip,
    take: limit,
    page,
  };
}

export { redis };