
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const CategoriesPage = () => {
  // Fetch all categories with optimized query and caching
  const { data: categories, isLoading } = useQuery({
    queryKey: ['allCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, icon, description')
        .order('name');
      
      if (error) throw error;
      
      // Get review counts in a single query
      const { data: reviewCounts, error: countError } = await supabase
        .from('reviews')
        .select('category_id, count')
        .count()
        .group('category_id');
      
      if (countError) throw countError;
      
      // Create a map of category_id to count
      const countsMap = reviewCounts?.reduce((acc, item) => {
        acc[item.category_id] = item.count;
        return acc;
      }, {}) || {};
      
      // Combine data
      return data.map(category => ({
        ...category,
        reviewCount: countsMap[category.id] || 0
      }));
    },
    staleTime: 60000, // Cache for 1 minute
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container px-4 md:px-6 mx-auto py-8 mt-24">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm mb-4 text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground">Categories</span>
        </div>

        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Browse by Category</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our AI-generated reviews across a wide range of product and service categories
          </p>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-medium">Loading categories...</p>
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/category/${category.slug}`}
                className={cn(
                  "group glass flex items-center p-6 rounded-xl transition-all duration-300",
                  "hover:shadow-md hover:scale-[1.02]"
                )}
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mr-4 text-3xl">
                  {category.icon || '📦'}
                </div>
                <div>
                  <h3 className="text-xl font-medium group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {category.reviewCount} {category.reviewCount === 1 ? 'review' : 'reviews'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl font-medium mb-4">No categories found</p>
            <p className="text-muted-foreground">
              Check back later for new categories and reviews.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CategoriesPage;
