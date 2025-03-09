import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SEOImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  caption?: string;
  fallback?: string;
}

export default function SEOImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  caption,
  fallback,
  ...props
}: SEOImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Generate WebP version URL
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const actualSrc = error ? (fallback || src) : src;

  useEffect(() => {
    // Preload image if priority is true
    if (priority && !loaded) {
      const img = new Image();
      img.src = actualSrc;
      img.onload = () => setLoaded(true);
    }
  }, [priority, actualSrc, loaded]);

  return (
    <figure className={cn('relative', className)}>
      <picture>
        {/* WebP source */}
        <source
          srcSet={webpSrc}
          type="image/webp"
        />
        {/* Original format source */}
        <source
          srcSet={actualSrc}
          type={`image/${src.split('.').pop()?.toLowerCase()}`}
        />
        {/* Fallback img element */}
        <img
          src={actualSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setError(true)}
          onLoad={() => setLoaded(true)}
          className={cn(
            'transition-opacity duration-300',
            !loaded && 'opacity-0',
            loaded && 'opacity-100'
          )}
          itemProp="image"
          {...props}
        />
      </picture>
      {caption && (
        <figcaption 
          className="mt-2 text-sm text-muted-foreground text-center"
          itemProp="caption"
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
} 