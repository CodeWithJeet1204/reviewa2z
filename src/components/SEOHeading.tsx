import React from 'react';
import { cn } from '@/lib/utils';

interface SEOHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children: React.ReactNode;
  id?: string;
}

export default function SEOHeading({
  level,
  className,
  children,
  id,
  ...props
}: SEOHeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  // Generate ID from text content if not provided
  const headingId = id || (typeof children === 'string' 
    ? children.toLowerCase().replace(/\s+/g, '-')
    : undefined);

  return (
    <Tag
      id={headingId}
      className={cn(
        'scroll-margin-top',
        level === 1 && 'text-4xl font-bold tracking-tight lg:text-5xl',
        level === 2 && 'text-3xl font-semibold tracking-tight',
        level === 3 && 'text-2xl font-semibold tracking-tight',
        level === 4 && 'text-xl font-semibold tracking-tight',
        level === 5 && 'text-lg font-semibold tracking-tight',
        level === 6 && 'text-base font-semibold tracking-tight',
        className
      )}
      itemProp="headline"
      {...props}
    >
      {children}
      {headingId && (
        <a
          href={`#${headingId}`}
          className="ml-2 opacity-0 hover:opacity-100 text-muted-foreground"
          aria-label={`Link to ${typeof children === 'string' ? children : 'this heading'}`}
        >
          #
        </a>
      )}
    </Tag>
  );
} 