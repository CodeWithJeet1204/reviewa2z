
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import ReviewCard, { ReviewCardProps } from '@/components/ReviewCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

type FeaturedReview = {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  image_url: string;
  rating: number;
  brief: string;
  likes_count: number;
  comments_count: number;
  tags: string[];
  categories: {
    name: string;
  };
};

const FeaturedReviewsSection = () => {
  const { data: featuredReviews, isLoading } = useQuery({
    queryKey: ['featuredReviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id, 
          title, 
          slug, 
          category_id, 
          image_url, 
          rating, 
          brief, 
          likes_count, 
          comments_count, 
          tags,
          categories(name)
        `)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      
      return data.map((review: FeaturedReview): ReviewCardProps => ({
        id: review.id,
        title: review.title,
        category: review.categories?.name || 'Uncategorized',
        image: review.image_url || 'https://via.placeholder.com/300x200',
        rating: review.rating,
        brief: review.brief || '',
        commentsCount: review.comments_count || 0,
        likesCount: review.likes_count || 0,
        tags: review.tags || [],
        userLiked: false
      }));
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="container px-4 md:px-6 mx-auto py-12">
      <div className="space-y-2 text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight">Featured Reviews</h2>
        <p className="text-muted-foreground max-w-[700px] mx-auto">
          Discover our latest AI-generated reviews across popular categories
        </p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium">Loading reviews...</p>
        </div>
      ) : featuredReviews && featuredReviews.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredReviews.map((review) => (
            <div key={review.id} className="animate-fade-in" style={{ animationDelay: `${parseInt(review.id.slice(0, 8), 16) % 300}ms` }}>
              <ReviewCard {...review} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No featured reviews available at the moment.</p>
        </div>
      )}
      
      <div className="mt-12 text-center">
        <Button asChild>
          <Link to="/search">
            View All Reviews <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default FeaturedReviewsSection;
