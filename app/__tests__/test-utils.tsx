import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

// Create a custom render function that includes providers
function render(
  ui: React.ReactElement,
  {
    session = null,
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </QueryClientProvider>
    );
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock session data
export const mockSession = {
  user: {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER',
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

// Mock admin session data
export const mockAdminSession = {
  ...mockSession,
  user: {
    ...mockSession.user,
    role: 'ADMIN',
  },
};

// Mock article data
export const mockArticle = {
  id: 'test-article-id',
  title: 'Test Article',
  subtitle: 'Test Subtitle',
  content: 'Test content',
  summary: 'Test summary',
  slug: 'test-article',
  imageUrl: '/images/test.jpg',
  category: 'BLOG',
  published: true,
  author: {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock review data
export const mockReview = {
  ...mockArticle,
  category: 'REVIEW',
  rating: {
    overall: 8.5,
    design: 8.0,
    features: 9.0,
    performance: 8.5,
    value: 8.0,
  },
  pros: ['Pro 1', 'Pro 2'],
  cons: ['Con 1', 'Con 2'],
};

// Custom async utilities
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

// Re-export everything
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Override render method
export { render };