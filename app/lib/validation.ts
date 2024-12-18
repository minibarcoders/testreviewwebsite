import { z } from 'zod';

// Password requirements:
// - Minimum 8 characters
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one number
// - At least one special character
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .regex(
      passwordRegex,
      'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  image: z.string().url().optional(),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Helper function to validate image URL
const imageUrlSchema = z.string().refine((url) => {
  // Accept both relative URLs starting with / and absolute URLs
  return url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://');
}, {
  message: 'Invalid image URL format'
});

// Common fields for both drafts and published articles
const baseArticleSchema = {
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().nullable().optional(),
  content: z.string().min(1, 'Content is required'),
  summary: z.string().min(1, 'Summary is required'),
  imageUrl: imageUrlSchema,
  category: z.enum(['REVIEW', 'NEWS', 'GUIDE', 'BLOG']),
  rating: z.object({
    overall: z.number().min(0).max(10),
    design: z.number().min(0).max(10),
    features: z.number().min(0).max(10),
    performance: z.number().min(0).max(10),
    value: z.number().min(0).max(10),
  }).optional(),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
};

// Schema for published articles with stricter validation
export const publishedArticleSchema = z.object({
  ...baseArticleSchema,
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  summary: z.string().min(50, 'Summary must be at least 50 characters'),
  published: z.literal(true),
});

// Schema for draft articles with minimal validation
export const draftArticleSchema = z.object({
  ...baseArticleSchema,
  published: z.literal(false),
});

// Combined schema that validates based on the published field
export const articleSchema = z.discriminatedUnion('published', [
  publishedArticleSchema,
  draftArticleSchema,
]);

export type UserInput = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ArticleInput = z.infer<typeof articleSchema>;

export function validateUser(data: unknown): UserInput {
  return userSchema.parse(data);
}

export function validateLogin(data: unknown): LoginInput {
  return loginSchema.parse(data);
}

export function validateArticle(data: unknown): ArticleInput {
  return articleSchema.parse(data);
}

// Helper function to sanitize HTML content
export function sanitizeHtml(html: string): string {
  // This is a basic implementation. Consider using a library like DOMPurify for production
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}

// Helper function to generate a secure random token
export function generateToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  
  return Array.from(randomValues)
    .map(val => chars[val % chars.length])
    .join('');
}