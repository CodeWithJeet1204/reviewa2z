
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
};

const CategoriesSection = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['homeCategories'],
    queryFn: async () => {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, slug, icon')
        .order('name')
        .limit(8);
      
      if (categoriesError) throw categoriesError;
      
      // Get category counts
      const { data: categoryCountsData, error: countError } = await supabase
        .rpc('get_category_counts');
        
      if (countError) throw countError;
      
      const countsMap: Record<string, number> = {};
      
      if (categoryCountsData) {
        categoryCountsData.forEach((item: { category_id: string, count: number }) => {
          if (item.category_id) {
            countsMap[item.category_id] = item.count;
          }
        });
      }
      
      return categoriesData.map((category: Omit<Category, 'count'>) => ({
        ...category,
        count: countsMap[category.id] || 0
      }));
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="bg-secondary/50 py-16">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="space-y-2 text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Browse by Category</h2>
          <p className="text-muted-foreground max-w-[700px] mx-auto">
            Find AI-generated reviews in your preferred product categories
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-medium">Loading categories...</p>
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link 
                to={`/category/${category.slug}`}
                key={category.id} 
                className={cn(
                  "group glass flex items-center p-4 rounded-xl transition-all duration-300",
                  "hover:shadow-md hover:scale-[1.02]"
                )}
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 mr-3 text-xl">
                  {category.icon || '📦'}
                </div>
                <div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} reviews</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No categories available at the moment.</p>
          </div>
        )}
        
        {categories && categories.length > 0 && (
          <div className="mt-10 text-center">
            <Button variant="outline" asChild>
              <Link to="/categories">
                View All Categories <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesSection;
