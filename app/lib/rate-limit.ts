import { withRedis } from './redis';

export async function rateLimit(
  key: string,
  limit: number = 100,
  window: number = 60
): Promise<{
  success: boolean;
  remaining: number;
  reset: number;
}> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - window;

  return await withRedis(
    async (redis) => {
      // Remove old requests
      await redis.zremrangebyscore(key, 0, windowStart);

      // Count recent requests
      const count = await redis.zcard(key);

      if (count >= limit) {
        // Get reset time
        const oldestRequest = await redis.zrange(key, 0, 0, 'WITHSCORES');
        const reset = oldestRequest[1] ? parseInt(oldestRequest[1]) + window : now + window;

        return {
          success: false,
          remaining: 0,
          reset,
        };
      }

      // Add current request
      await redis.zadd(key, now, `${now}-${Math.random()}`);

      return {
        success: true,
        remaining: limit - count - 1,
        reset: now + window,
      };
    },
    // Fallback when Redis is unavailable - allow the request
    {
      success: true,
      remaining: 1,
      reset: now + window,
    }
  );
}