'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  onLoad?: () => void;
}

export function generateImageSizes(config: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  default: string;
}): string {
  return `
    (max-width: 640px) ${config.mobile || config.default},
    (max-width: 1024px) ${config.tablet || config.default},
    (min-width: 1024px) ${config.desktop || config.default},
    ${config.default}
  `.trim();
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  fill = false,
  sizes = '100vw',
  quality = 75,
  onLoad,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  // Default fallback image
  const fallbackImage = '/images/placeholder.png';

  // Combine provided className with loading state classes
  const imageClasses = `
    ${className}
    ${isLoading ? 'animate-pulse bg-gray-200' : ''}
    transition-opacity duration-300
    ${isLoading ? 'opacity-0' : 'opacity-100'}
  `.trim();

  // Base image props
  const baseImageProps = {
    src: error ? fallbackImage : src,
    alt,
    width: fill ? undefined : width,
    height: fill ? undefined : height,
    className: imageClasses,
    quality,
    sizes,
    onLoad: handleLoad,
    onError: handleError,
  };

  // Add conditional props
  const imageProps = {
    ...baseImageProps,
    ...(priority && { priority: true }),
    ...(fill && { fill: true }),
  };

  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''}`}>
      {/* Loading skeleton */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"
          style={{ aspectRatio: width && height ? width/height : undefined }}
          aria-hidden="true"
        />
      )}

      {/* Image */}
      <Image {...imageProps} />

      {/* Error state */}
      {error && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg"
          role="alert"
          aria-live="polite"
        >
          <span className="text-sm text-gray-500">Failed to load image</span>
        </div>
      )}

      {/* Accessibility description */}
      <span className="sr-only">{alt}</span>
    </div>
  );
}