import { render, screen } from '../test-utils';
import BlogPage from '@/blog/page';
import { prisma } from '@/lib/prisma';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} src={props.src || ''} alt={props.alt} />;
  },
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, variants }: any) => (
      <div className={className}>{children}</div>
    ),
  },
}));

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    article: {
      findMany: jest.fn(),
    },
  },
}));

// Mock utils
jest.mock('app/lib/utils', () => ({
  ...jest.requireActual('app/lib/utils'),
  isServer: jest.fn().mockReturnValue(false),
}));

describe('BlogPage', () => {
  const mockPosts = [
    {
      id: '1',
      title: 'Test Blog Post',
      content: 'Test content',
      summary: 'Test blog summary',
      slug: 'test-post',
      imageUrl: 'https://example.com/post.jpg',
      category: 'BLOG',
      published: true,
      createdAt: new Date('2023-01-01'),
      author: {
        name: 'Test Author',
      },
    },
    {
      id: '2',
      title: 'Another Blog Post',
      content: 'Another test content',
      summary: 'Another test summary',
      slug: 'another-post',
      imageUrl: 'https://example.com/another.jpg',
      category: 'BLOG',
      published: true,
      createdAt: new Date('2023-01-02'),
      author: {
        name: 'Test Author',
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.article.findMany as jest.Mock).mockResolvedValue(mockPosts);
  });

  it('displays blog posts with images', async () => {
    const page = await BlogPage();
    render(page);

    // Check if both posts are displayed
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(2);

    // Check if images are rendered
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', 'https://example.com/post.jpg');
    expect(images[1]).toHaveAttribute('src', 'https://example.com/another.jpg');

    // Check if titles and summaries are displayed
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.getByText('Another Blog Post')).toBeInTheDocument();
    expect(screen.getByText('Test blog summary')).toBeInTheDocument();
    expect(screen.getByText('Another test summary')).toBeInTheDocument();
  });

  it('displays post metadata correctly', async () => {
    const page = await BlogPage();
    render(page);

    // Check author names
    expect(screen.getAllByText('Test Author')).toHaveLength(2);

    // Check dates
    expect(screen.getByText('January 1, 2023')).toBeInTheDocument();
    expect(screen.getByText('January 2, 2023')).toBeInTheDocument();
  });

  it('links to individual blog posts', async () => {
    const page = await BlogPage();
    render(page);

    // Check if links are correct
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/blog/test-post');
    expect(links[1]).toHaveAttribute('href', '/blog/another-post');
  });

  it('displays posts in a grid layout', async () => {
    const page = await BlogPage();
    render(page);

    // Check if grid container exists with correct classes
    const grid = screen.getByRole('main').querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2');
  });

  it('handles missing images gracefully', async () => {
    const postsWithoutImage = [{
      ...mockPosts[0],
      imageUrl: '',
    }];
    (prisma.article.findMany as jest.Mock).mockResolvedValue(postsWithoutImage);

    const page = await BlogPage();
    render(page);

    // Check if image element still exists
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '');
  });

  it('shows no posts when server-side', async () => {
    // Mock isServer to return true for this test
    const utils = jest.requireMock('app/lib/utils');
    utils.isServer.mockReturnValue(true);

    const page = await BlogPage();
    render(page);

    // Check that no articles are rendered
    const articles = screen.queryAllByRole('article');
    expect(articles).toHaveLength(0);
  });
});