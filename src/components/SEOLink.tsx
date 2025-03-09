import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SEOLinkProps extends Omit<LinkProps, 'title'> {
  title?: string;
  description?: string;
  isExternal?: boolean;
  className?: string;
  children: React.ReactNode;
  rel?: string;
}

export default function SEOLink({
  to,
  title,
  description,
  isExternal = false,
  className,
  children,
  rel,
  ...props
}: SEOLinkProps) {
  const relAttribute = cn(
    rel,
    isExternal ? 'noopener noreferrer' : undefined,
  );

  const linkProps = {
    className: cn(
      'transition-colors duration-200',
      className
    ),
    ...props,
    ...(isExternal && { target: '_blank' }),
    ...(relAttribute && { rel: relAttribute }),
    ...(title && { 'aria-label': title }),
    ...(description && { 'aria-description': description }),
  };

  // For external links, use regular anchor tag
  if (isExternal) {
    return (
      <a
        href={to.toString()}
        {...linkProps}
        itemProp="url"
      >
        {children}
      </a>
    );
  }

  // For internal links, use React Router's Link
  return (
    <Link
      to={to}
      {...linkProps}
      itemProp="url"
    >
      {children}
    </Link>
  );
} 