import React, { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReviewCard from '@/components/ReviewCard';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/providers/ThemeProvider';
import '@/styles/scrollbar-hide.css';

// Define the type for featured reviews
interface Review {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  image_url?: string;
  rating: number;
  brief: string;
  comments_count: number;
  tags?: string[];
  category?: {
    name: string;
    slug: string;
  };
  is_featured: boolean;
}

const FeaturedReviewsSection = () => {
  const { theme } = useTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Width of one card
      const newScrollPosition = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const { data: featuredReviews, isLoading, error } = useQuery<Review[]>({
    queryKey: ['featuredReviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          category:categories(name, slug)
        `)
        .eq('is_featured', true)
        .limit(6);
        
      if (error) {
        console.error("Error fetching featured reviews:", error);
        throw error;
      }
      
      if (!data) return [];
      
      return data.map(review => ({
        ...review,
        tags: review.tags || [],
        comments_count: review.comments_count || 0,
        rating: review.rating || 0
      }));
    },
    staleTime: 60000, // Cache for 1 minute
    retry: 3, // Retry failed requests 3 times
  });

  if (error) {
    console.error("Error loading featured reviews:", error);
    return (
      <div className="bg-background py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center py-10">
            <p className="text-muted-foreground">Error loading featured reviews. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background py-16">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Featured Reviews</h2>
          <p className="text-muted-foreground mt-2">Discover our expert takes on the latest products</p>
        </div>
        
        <div className="relative">
          {/* Left scroll button */}
          <Button
            variant={theme === 'system' ? 'secondary' : 'default'}
            size="icon"
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg hidden md:flex hover:scale-110 transition-transform"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Reviews container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="min-w-[300px] w-[300px] rounded-lg bg-muted animate-pulse h-[350px] snap-center flex-shrink-0"></div>
              ))
            ) : featuredReviews && featuredReviews.length > 0 ? (
              featuredReviews.map((review) => (
                <div key={review.id} className="min-w-[300px] w-[300px] snap-center flex-shrink-0">
                  <ReviewCard review={review} />
                </div>
              ))
            ) : (
              <div className="text-center py-10 w-full">
                <p className="text-muted-foreground">No featured reviews found</p>
              </div>
            )}
          </div>

          {/* Right scroll button */}
          <Button
            variant={theme === 'system' ? 'secondary' : 'default'}
            size="icon"
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg hidden md:flex hover:scale-110 transition-transform"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedReviewsSection;
