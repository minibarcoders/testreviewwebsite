import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { validateArticle } from '@/lib/validation';

// Mock next-auth/jwt
jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(),
}));

// Mock Redis
jest.mock('@/lib/redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  },
  getPaginationParams: jest.fn().mockImplementation(({ page, limit }) => ({
    skip: ((page || 1) - 1) * (limit || 10),
    take: limit || 10,
    page: page || 1,
  })),
  generateCacheKey: jest.fn().mockImplementation(() => 'test-cache-key'),
  cacheGet: jest.fn().mockImplementation(() => null),
  cacheSet: jest.fn(),
  cacheInvalidate: jest.fn(),
}));

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    article: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

// Mock validation
jest.mock('@/lib/validation', () => {
  class ValidationError extends Error {
    constructor() {
      super('Validation failed');
      this.name = 'ValidationError';
    }
  }

  return {
    validateArticle: jest.fn().mockImplementation((data) => {
      if (!data.title) {
        throw new ValidationError();
      }
      return data;
    }),
    ValidationError,
  };
});

// Import the mocked getToken after mocking
import { getToken } from 'next-auth/jwt';
import { GET, POST } from '@/api/articles/route';

const mockGetToken = getToken as jest.MockedFunction<typeof getToken>;

// Helper function to create test requests
function createTestRequest(path: string, options: RequestInit = {}) {
  const url = new URL(path, 'http://localhost:3000');
  const headers = new Headers(options.headers || {});
  headers.set('content-type', 'application/json');
  
  const req = new Request(url, {
    ...options,
    headers,
  }) as unknown as NextRequest;
  
  // Add NextRequest specific properties
  Object.defineProperty(req, 'nextUrl', {
    get() { return url; },
  });
  
  // Add json method if body exists
  if (options.body) {
    req.json = async () => JSON.parse(options.body as string);
  }
  
  return req;
}

describe('Articles API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/articles', () => {
    const mockArticles = [
      {
        id: '1',
        title: 'Test Article',
        content: 'This is a test article content that meets the minimum length requirement of 100 characters. It includes detailed information about the topic.',
        summary: 'This is a test article summary that meets the minimum length requirement of 50 characters.',
        slug: 'test-article',
        imageUrl: 'https://example.com/test.jpg',
        category: 'BLOG',
        published: true,
        author: {
          name: 'Test Author',
          email: 'test@example.com',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('returns published articles for unauthenticated users', async () => {
      mockGetToken.mockResolvedValue(null);
      (prisma.article.findMany as jest.Mock).mockResolvedValue(mockArticles);
      (prisma.article.count as jest.Mock).mockResolvedValue(1);

      const request = createTestRequest('/api/articles?published=true');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(1);
      expect(data.data[0]).toEqual(mockArticles[0]);
    });

    it('returns all articles for admin users', async () => {
      mockGetToken.mockResolvedValue({
        name: 'Admin User',
        email: 'admin@example.com',
        sub: '1',
        id: '1',
        role: 'ADMIN',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
        jti: 'test-jti',
      });
      (prisma.article.findMany as jest.Mock).mockResolvedValue(mockArticles);
      (prisma.article.count as jest.Mock).mockResolvedValue(1);

      const request = createTestRequest('/api/articles');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(1);
    });

    it('handles pagination parameters', async () => {
      mockGetToken.mockResolvedValue(null);
      (prisma.article.findMany as jest.Mock).mockResolvedValue(mockArticles);
      (prisma.article.count as jest.Mock).mockResolvedValue(1);

      const request = createTestRequest('/api/articles?page=1&limit=10&published=true');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.pagination).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasMore: false,
      });
    });
  });

  describe('POST /api/articles', () => {
    const mockArticle = {
      title: 'New Article',
      content: 'This is a test article content that meets the minimum length requirement of 100 characters. It includes detailed information about the topic.',
      summary: 'This is a test article summary that meets the minimum length requirement of 50 characters.',
      category: 'BLOG',
      imageUrl: 'https://example.com/test.jpg',
    };

    it('creates article when user is admin', async () => {
      mockGetToken.mockResolvedValue({
        name: 'Admin User',
        email: 'admin@example.com',
        sub: '1',
        id: '1',
        role: 'ADMIN',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
        jti: 'test-jti',
      });
      (prisma.article.create as jest.Mock).mockResolvedValue({
        ...mockArticle,
        id: '1',
        slug: 'new-article',
        published: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          name: 'Admin',
          email: 'admin@example.com',
        },
      });

      const request = createTestRequest('/api/articles', {
        method: 'POST',
        body: JSON.stringify(mockArticle),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.article).toBeDefined();
    });

    it('returns 401 when user is not admin', async () => {
      mockGetToken.mockResolvedValue(null);

      const request = createTestRequest('/api/articles', {
        method: 'POST',
        body: JSON.stringify(mockArticle),
      });

      const response = await POST(request);
      expect(response.status).toBe(401);
    });

    it('validates required fields', async () => {
      mockGetToken.mockResolvedValue({
        name: 'Admin User',
        email: 'admin@example.com',
        sub: '1',
        id: '1',
        role: 'ADMIN',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
        jti: 'test-jti',
      });

      const request = createTestRequest('/api/articles', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Failed to create article');
    });
  });
});