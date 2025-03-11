import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface Review {
  id: string;
  title: string;
  slug: string;
  rating: number;
  description: string;
  category: string;
  type: string;
  status: string;
  tags?: string[];
  product: {
    name: string;
    brand: string;
    price?: string;
    image?: string;
  };
  overallRating: {
    [key: string]: number;
  };
  publishedAt: string;
  viewCount: number;
  featured: boolean;
  ogImage?: string;
}

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const {
    title,
    slug,
    rating = 0,
    description = '',
    category,
    tags = [],
    product,
    overallRating
  } = review;

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Calculate average rating from overallRating if available
  const averageRating = overallRating && typeof overallRating === 'object'
    ? Object.values(overallRating).filter(val => typeof val === 'number').reduce((a, b) => a + b, 0) / 
      Object.values(overallRating).filter(val => typeof val === 'number').length
    : rating || 0;

  // Ensure tags is always an array
  const displayTags = Array.isArray(tags) ? tags : [];

  return (
    <Link to={`/review/${slug}`} className="block h-[320px]">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full">
        <AspectRatio ratio={16 / 9}>
          <img
            src={review.ogImage || product?.image || '/placeholder-image.jpg'}
            alt={title}
            className="object-cover w-full h-full"
          />
        </AspectRatio>

        <CardContent className="px-4 pt-4 pb-6 flex flex-col h-[calc(320px-8/16*100%)]">
          <div className="flex items-center justify-between gap-4 mb-2">
            <Link
              to={`/category/${category?.toLowerCase() || 'uncategorized'}`}
              className="text-sm text-muted-foreground hover:text-primary relative z-10"
              onClick={handleCategoryClick}
            >
              {category || 'Uncategorized'}
            </Link>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">{Number.isFinite(averageRating) ? averageRating.toFixed(1) : '0.0'}</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3 line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>

          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {description}
          </p>

          {displayTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {displayTags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {displayTags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{displayTags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default ReviewCard;
