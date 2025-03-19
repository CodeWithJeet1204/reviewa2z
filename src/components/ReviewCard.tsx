import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Review {
  id: string;
  title: string;
  slug: string;
  rating: number;
  description: string;
  category: string;
  type: string;
  status: string;
  product: {
    name: string;
    brand: string;
    price?: string;
    image?: string;
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
    rating,
    description = '',
    category,
  } = review;

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Link to={`/review/${slug}`} className="block h-[320px]">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full">
        <div className="relative h-48 overflow-hidden rounded-t-xl">
          {/* Blurred background */}
          <div 
            className="absolute inset-0 bg-cover bg-center blur-xl scale-110"
            style={{ 
              backgroundImage: `url(${review.ogImage || '/placeholder-image.jpg'})`,
              opacity: 0.5
            }}
          />
          {/* Main image */}
          <img
            src={review.ogImage || '/placeholder-image.jpg'}
            alt={review.title}
            className="relative h-full w-auto mx-auto object-contain z-10"
          />
        </div>

        <CardContent className="px-4 pt-4 pb-6 flex flex-col flex-grow">
          <div className="flex items-center justify-between gap-4 mb-2">
            <Link
              to={`/category/${category?.toLowerCase().replace(/\s*&\s*/g, '-').replace(/\s+/g, '-')}`}
              className="text-sm text-muted-foreground hover:text-primary relative z-10"
              onClick={handleCategoryClick}
            >
              {category || 'Uncategorized'}
            </Link>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3 line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>

          <p className="text-muted-foreground text-sm line-clamp-2">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ReviewCard;
