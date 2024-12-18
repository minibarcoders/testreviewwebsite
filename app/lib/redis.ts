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