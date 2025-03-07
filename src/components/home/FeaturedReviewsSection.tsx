
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import ReviewCard from '@/components/ReviewCard';
import { supabase } from '@/lib/supabase';

// Define the type for featured reviews
interface FeaturedReview {
  id: string;
  title: string;
  slug: string;
  category_id: number;
  image_url: string;
  rating: number;
  brief: string;
  likes_count: number;
  comments_count: number;
  tags: string[];
  category: {
    name: string;
    slug: string;
  };
}

const FeaturedReviewsSection = () => {
  const { data: featuredReviews, isLoading } = useQuery({
    queryKey: ['featuredReviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id, title, slug, category_id, image_url, rating, brief, likes_count, comments_count, tags,
          category:categories(name, slug)
        `)
        .eq('is_featured', true)
        .limit(6);
        
      if (error) throw error;
      
      return data as unknown as FeaturedReview[];
    }
  });

  return (
    <div className="bg-background py-16">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Reviews</h2>
            <p className="text-muted-foreground mt-2">Discover our expert takes on the latest products</p>
          </div>
          <Button variant="ghost" asChild className="group">
            <Link to="/search" className="flex items-center gap-1 w-full h-full">
              View all reviews 
              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg bg-muted animate-pulse h-[350px]"></div>
            ))}
          </div>
        ) : featuredReviews && featuredReviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredReviews.map((review) => (
              <ReviewCard 
                key={review.id}
                id={review.id}
                title={review.title}
                category={review.category.name}
                image={review.image_url}
                rating={review.rating}
                brief={review.brief}
                likesCount={review.likes_count}
                commentsCount={review.comments_count}
                tags={review.tags || []}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No featured reviews found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedReviewsSection;
