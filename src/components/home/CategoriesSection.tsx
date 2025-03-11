import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

interface CategoryWithCount {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  count: number;
}

const CategoriesSection = () => {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['homeCategories'],
    queryFn: async () => {
      // First get all categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError);
        throw categoriesError;
      }
      
      // Then get review counts for each category
      const counts: Record<string, number> = {};
      
      try {
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('category')
          .eq('status', 'published');
        
        if (!reviewsError && reviewsData) {
          reviewsData.forEach((review: any) => {
            if (review.category) {
              counts[review.category] = (counts[review.category] || 0) + 1;
            }
          });
        }
      } catch (error) {
        console.error("Error counting reviews per category:", error);
      }
      
      // Combine the data
      const categoriesWithCounts = categoriesData.map((category: any) => ({
        ...category,
        count: counts[category.name] || 0
      }));
      
      return categoriesWithCounts as CategoryWithCount[];
    },
    staleTime: 60000,
    retry: 3,
  });

  if (error) {
    console.error("Error loading categories:", error);
  }

  return (
    <div className="bg-background/50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Browse by Category</h2>
          <p className="text-muted-foreground mt-2">Explore reviews organized by product categories</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-lg bg-muted animate-pulse h-[100px]"></div>
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/category/${category.slug}`}
                className="block h-full transition-all duration-300 hover:scale-[1.02]"
              >
                <Card className="h-full glass hover:shadow-md transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6 flex flex-col items-center text-center h-full">
                    <div className="text-4xl mb-2 transition-transform group-hover:scale-110">
                      {category.icon || '📦'}
                    </div>
                    <h3 className="font-medium text-lg mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count} {category.count === 1 ? 'review' : 'reviews'}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No categories found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesSection;
