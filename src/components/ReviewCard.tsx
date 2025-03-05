
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarIcon, ThumbsUp, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  id: string;
  title: string;
  category: string;
  image: string;
  rating: number;
  brief: string;
  commentsCount: number;
  likesCount: number;
  tags: string[];
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  id,
  title,
  category,
  image,
  rating,
  brief,
  commentsCount,
  likesCount,
  tags,
}) => {
  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={cn(
            "h-4 w-4 transition-transform",
            i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
            i <= rating && "animate-scale-in"
          )}
          style={{ animationDelay: `${i * 100}ms` }}
        />
      );
    }
    return stars;
  };

  return (
    <Link to={`/review/${id}`}>
      <Card className="overflow-hidden transition-all duration-300 h-full hover:shadow-md hover:scale-[1.02] group">
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-primary/90 backdrop-blur-sm text-xs">
              {category}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex">{renderStars()}</div>
            <span className="text-sm font-medium text-primary">{rating.toFixed(1)}</span>
          </div>
          
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
          
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {brief}
          </p>
          
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 2} more
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="px-5 py-3 border-t flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{commentsCount} comments</span>
          </div>
          <div className="flex items-center">
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span>{likesCount} likes</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ReviewCard;
