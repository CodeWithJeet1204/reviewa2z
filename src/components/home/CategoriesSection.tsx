
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

interface CategoryWithCount {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  count: number;
}

const CategoriesSection = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['homeCategories'],
    queryFn: async () => {
      // First get all categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (categoriesError) throw categoriesError;
      
      // Then get counts using RPC function
      const { data: countsData, error: countsError } = await supabase
        .rpc('get_category_counts');
      
      if (countsError) {
        console.error("Error fetching category counts:", countsError);
        // Return categories without counts if RPC fails
        return categoriesData.map((category: any) => ({
          ...category,
          count: 0
        }));
      }
      
      // Combine the data
      const categoriesWithCounts = categoriesData.map((category: any) => {
        const countData = countsData.find((item: any) => item.category_id === category.id);
        return {
          ...category,
          count: countData ? countData.count : 0
        };
      });
      
      return categoriesWithCounts as CategoryWithCount[];
    }
  });

  return (
    <div className="bg-background/50 py-16">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Browse by Category</h2>
            <p className="text-muted-foreground mt-2">Explore reviews organized by product categories</p>
          </div>
          <Button variant="ghost" asChild className="group">
            <Link to="/categories" className="flex items-center gap-1">
              All categories
              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg bg-muted animate-pulse h-[100px]"></div>
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link key={category.id} to={`/category/${category.slug}`}>
                <Card className="h-full glass hover:shadow-md transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-6 flex flex-col items-center text-center h-full">
                    <div className="text-4xl mb-2 transition-transform group-hover:scale-110">
                      {category.icon}
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
