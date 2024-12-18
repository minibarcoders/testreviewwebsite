import { render, screen } from '../test-utils';
import HomePage from '@/components/HomePage';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('HomePage', () => {
  const mockReviews = [
    {
      id: '1',
      title: 'Test Review',
      content: 'Test content',
      summary: 'Test review summary',
      slug: 'test-review',
      imageUrl: 'https://example.com/review.jpg',
      createdAt: new Date(),
      rating: {
        overall: 8.5,
        design: 8,
        features: 9,
        performance: 8,
        value: 9,
      },
      author: {
        name: 'Test Author',
      },
    },
  ];

  const mockPosts = [
    {
      id: '2',
      title: 'Test Blog Post',
      content: 'Test content',
      summary: 'Test blog summary',
      slug: 'test-post',
      imageUrl: 'https://example.com/post.jpg',
      createdAt: new Date(),
      rating: null,
      author: {
        name: 'Test Author',
      },
    },
  ];

  it('displays reviews with images and ratings', () => {
    render(<HomePage latestReviews={mockReviews} latestPosts={[]} />);

    // Check if review image is rendered
    const reviewImage = screen.getByAltText('Test Review');
    expect(reviewImage).toBeInTheDocument();
    expect(reviewImage).toHaveAttribute('src', 'https://example.com/review.jpg');

    // Check if rating is displayed
    const rating = screen.getByText('8.5/10');
    expect(rating).toBeInTheDocument();

    // Check if review title and summary are displayed
    expect(screen.getByText('Test Review')).toBeInTheDocument();
    expect(screen.getByText('Test review summary')).toBeInTheDocument();
  });

  it('displays blog posts with images', () => {
    render(<HomePage latestReviews={[]} latestPosts={mockPosts} />);

    // Check if blog post image is rendered
    const postImage = screen.getByAltText('Test Blog Post');
    expect(postImage).toBeInTheDocument();
    expect(postImage).toHaveAttribute('src', 'https://example.com/post.jpg');

    // Check if blog post title and summary are displayed
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.getByText('Test blog summary')).toBeInTheDocument();
  });

  it('displays placeholder image when imageUrl is missing', () => {
    const postsWithoutImage = [{
      ...mockPosts[0],
      imageUrl: '',
    }];

    render(<HomePage latestReviews={[]} latestPosts={postsWithoutImage} />);

    // Check if placeholder image is rendered
    const placeholderImage = screen.getByAltText('Test Blog Post');
    expect(placeholderImage).toBeInTheDocument();
    expect(placeholderImage).toHaveAttribute('src', '/images/placeholder.png');
  });

  it('displays both reviews and blog posts', () => {
    render(<HomePage latestReviews={mockReviews} latestPosts={mockPosts} />);

    // Check if both sections are present
    expect(screen.getByText('Latest Reviews')).toBeInTheDocument();
    expect(screen.getByText('Latest Posts')).toBeInTheDocument();

    // Check if both articles are displayed with their images
    const reviewImage = screen.getByAltText('Test Review');
    const postImage = screen.getByAltText('Test Blog Post');
    
    expect(reviewImage).toBeInTheDocument();
    expect(postImage).toBeInTheDocument();
    
    expect(reviewImage).toHaveAttribute('src', 'https://example.com/review.jpg');
    expect(postImage).toHaveAttribute('src', 'https://example.com/post.jpg');
  });

  it('links to the correct article pages', () => {
    render(<HomePage latestReviews={mockReviews} latestPosts={mockPosts} />);

    // Check review link
    const reviewLink = screen.getByRole('link', { name: /test review/i });
    expect(reviewLink).toHaveAttribute('href', '/reviews/test-review');

    // Check blog post link
    const postLink = screen.getByRole('link', { name: /test blog post/i });
    expect(postLink).toHaveAttribute('href', '/blog/test-post');
  });
});