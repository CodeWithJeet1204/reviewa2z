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
  description: string;
  category: string;
  type: string;
  status: string;
  rating: number;
  overallRating: {
    design: number;
    performance: number;
    features: number;
    value: number;
  };
  product: {
    name: string;
    brand: string;
    price?: string;
    image?: string;
  };
  tags?: string[];
  viewCount: number;
  featured: boolean;
  publishedAt: string;
  updatedAt: string;
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
        .select('*')
        .eq('featured', true)
        .eq('status', 'published')
        .order('publishedAt', { ascending: false })
        .limit(6);
        
      if (error) {
        console.error("Error fetching featured reviews:", error);
        throw error;
      }
      
      if (!data) return [];

      console.log(data);
      
      return data.map(review => ({
        ...review,
        tags: [],
        overallRating: review.overallRating || {
          design: review.rating,
          performance: review.rating,
          features: review.rating,
          value: review.rating
        },
        product: review.product || {
          name: review.title,
          brand: review.specs?.brand,
          price: review.specs?.price,
          image: '/placeholder-image.jpg'
        }
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
    <section className="bg-background py-16">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Featured Reviews</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        >
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[300px] h-[400px] rounded-xl bg-muted animate-pulse"
              />
            ))
          ) : featuredReviews?.length === 0 ? (
            <div className="text-center py-10 w-full">
              <p className="text-muted-foreground">No featured reviews available.</p>
            </div>
          ) : (
            featuredReviews?.map((review) => (
              <div key={review.id} className="min-w-[300px]">
                <ReviewCard review={review} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedReviewsSection;
