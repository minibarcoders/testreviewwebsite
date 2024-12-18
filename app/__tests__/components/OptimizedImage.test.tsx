import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { generateImageSizes } from '@/components/ui/OptimizedImage';

describe('OptimizedImage', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test image',
    width: 200,
    height: 200,
  };

  it('renders with loading state', () => {
    render(<OptimizedImage {...defaultProps} />);
    
    const image = screen.getByRole('img', { name: defaultProps.alt });
    expect(image).toBeInTheDocument();
    expect(image.className).toContain('opacity-0');
  });

  it('shows image after loading', async () => {
    render(<OptimizedImage {...defaultProps} />);
    
    const image = screen.getByRole('img', { name: defaultProps.alt });
    fireEvent.load(image);
    
    await waitFor(() => {
      expect(image.className).toContain('opacity-100');
    });
  });

  it('shows error state when image fails to load', async () => {
    render(<OptimizedImage {...defaultProps} />);
    
    const image = screen.getByRole('img', { name: defaultProps.alt });
    fireEvent.error(image);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load image')).toBeInTheDocument();
    });
  });

  it('uses fallback image when src fails', async () => {
    render(<OptimizedImage {...defaultProps} />);
    
    const image = screen.getByRole('img', { name: defaultProps.alt });
    fireEvent.error(image);
    
    await waitFor(() => {
      expect(image).toHaveAttribute('src', '/images/placeholder.png');
    });
  });

  it('handles fill prop correctly', () => {
    render(<OptimizedImage {...defaultProps} fill />);
    
    const container = screen.getByRole('img', { name: defaultProps.alt }).parentElement;
    expect(container).toHaveClass('w-full h-full');
  });

  it('applies custom className', () => {
    const customClass = 'custom-test-class';
    render(<OptimizedImage {...defaultProps} className={customClass} />);
    
    const image = screen.getByRole('img', { name: defaultProps.alt });
    expect(image).toHaveClass(customClass);
  });

  it('calls onLoad callback when provided', async () => {
    const onLoad = jest.fn();
    render(<OptimizedImage {...defaultProps} onLoad={onLoad} />);
    
    const image = screen.getByRole('img', { name: defaultProps.alt });
    fireEvent.load(image);
    
    await waitFor(() => {
      expect(onLoad).toHaveBeenCalled();
    });
  });

  describe('generateImageSizes', () => {
    it('generates correct sizes string', () => {
      const sizes = generateImageSizes({
        mobile: '100vw',
        tablet: '50vw',
        desktop: '33vw',
        default: '100vw',
      });

      expect(sizes).toContain('(max-width: 640px) 100vw');
      expect(sizes).toContain('(max-width: 1024px) 50vw');
      expect(sizes).toContain('(min-width: 1024px) 33vw');
      expect(sizes).toContain('100vw');
    });
  });
});