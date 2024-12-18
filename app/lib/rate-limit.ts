import { withRedis } from './redis';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limit configurations
const GLOBAL_RATE_LIMIT = 1000; // requests per minute
const AUTH_RATE_LIMIT = 50; // requests per minute
const RATE_LIMIT_WINDOW = 60; // seconds

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

export async function globalRateLimit(ip: string) {
  return rateLimit(`rate-limit:global:${ip}`, GLOBAL_RATE_LIMIT, RATE_LIMIT_WINDOW);
}

export async function authRateLimit(ip: string) {
  return rateLimit(`rate-limit:auth:${ip}`, AUTH_RATE_LIMIT, RATE_LIMIT_WINDOW);
}

export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return '127.0.0.1';
}

export function getRateLimitResponse(result: { success: boolean; remaining: number; reset: number }) {
  if (!result.success) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': result.reset.toString(),
        'X-RateLimit-Limit': GLOBAL_RATE_LIMIT.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': result.reset.toString(),
      },
    });
  }
  return null;
}