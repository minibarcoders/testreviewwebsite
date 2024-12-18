import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  max: number;
}

class RateLimit {
  private cache: Map<string, { count: number; resetTime: number }>;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.cache = new Map();
    this.config = config;
  }

  check(ip: string): boolean {
    const now = Date.now();
    const record = this.cache.get(ip);

    if (!record) {
      this.cache.set(ip, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return true;
    }

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + this.config.windowMs;
      return true;
    }

    if (record.count >= this.config.max) {
      return false;
    }

    record.count += 1;
    return true;
  }
}

export const globalRateLimit = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

export const authRateLimit = new RateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login attempts per hour
});

export function getRateLimitResponse(isAuthRoute: boolean = false): NextResponse {
  return NextResponse.json(
    { 
      error: isAuthRoute 
        ? 'Too many login attempts, please try again later.'
        : 'Too many requests, please try again later.'
    },
    { status: 429 }
  );
}

export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return '127.0.0.1';
}