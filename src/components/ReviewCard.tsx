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
  brief: string;
  image_url?: string;
  category_id: string;
  comments_count: number;
  tags?: string[];
  category?: {
    name: string;
    slug: string;
  };
}

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const {
    title,
    slug,
    rating = 0,
    brief = '',
    image_url = '',
    category,
    tags = []
  } = review;

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Link to={`/review/${slug}`} className="block">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full">
        <AspectRatio ratio={16 / 9}>
          <img
            src={image_url || '/placeholder-image.jpg'}
            alt={title}
            className="object-cover w-full h-full"
          />
        </AspectRatio>

        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4 mb-2">
            {category && (
              <Link
                to={`/category/${category.slug}`}
                className="text-sm text-muted-foreground hover:text-primary relative z-10"
                onClick={handleCategoryClick}
              >
                {category.name}
              </Link>
            )}
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {brief}
          </p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{tags.length - 3} more
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
