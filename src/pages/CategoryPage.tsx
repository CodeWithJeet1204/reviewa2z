
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Search, Filter, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReviewCard from '@/components/ReviewCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Fetch category
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch reviews
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['categoryReviews', slug, sortBy, searchTerm, selectedTags],
    queryFn: async () => {
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('category_id', category?.id);
      
      // Apply search filter if provided
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }
      
      // Apply tag filters if any are selected
      if (selectedTags.length > 0) {
        query = query.containsAny('tags', selectedTags);
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'highest_rated':
          query = query.order('rating', { ascending: false });
          break;
        case 'most_commented':
          query = query.order('comments_count', { ascending: false });
          break;
        case 'most_liked':
          query = query.order('likes_count', { ascending: false });
          break;
        case 'latest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    enabled: !!category
  });

  // Fetch all tags used in this category
  const { data: allTags } = useQuery({
    queryKey: ['categoryTags', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('tags')
        .eq('category_id', category?.id);
      
      if (error) throw error;
      
      // Extract and deduplicate tags
      const tagSet = new Set<string>();
      data.forEach(review => {
        if (review.tags) {
          review.tags.forEach((tag: string) => tagSet.add(tag));
        }
      });
      
      return Array.from(tagSet);
    },
    enabled: !!category
  });

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('latest');
    setSelectedTags([]);
  };

  if (categoryLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container px-4 md:px-6 mx-auto py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-medium">Loading category...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container px-4 md:px-6 mx-auto py-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
            <p className="text-lg text-muted-foreground mb-6">
              We couldn't find the category you're looking for.
            </p>
            <Button asChild>
              <Link to="/">Return to Homepage</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container px-4 md:px-6 mx-auto py-8 mt-24">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm mb-4 text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground">{category.name}</span>
        </div>

        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">{category.icon || '📦'}</div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{category.name}</h1>
          </div>
          <p className="text-lg text-muted-foreground">{category.description || `Explore our collection of AI-generated reviews for ${category.name}.`}</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={`Search ${category.name} reviews...`}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="highest_rated">Highest Rated</SelectItem>
                  <SelectItem value="most_commented">Most Commented</SelectItem>
                  <SelectItem value="most_liked">Most Liked</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                Filters
                {selectedTags.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedTags.length}
                  </Badge>
                )}
              </Button>
              {(searchTerm || sortBy !== 'latest' || selectedTags.length > 0) && (
                <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Tag Filters */}
          {showFilters && (
            <div className="glass p-4 rounded-xl animate-fade-in">
              <h3 className="font-medium mb-2">Filter by Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags && allTags.length > 0 ? (
                  allTags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No tags available for this category</p>
                )}
              </div>
            </div>
          )}
        </div>

        <Separator className="mb-8" />

        {/* Reviews Grid */}
        {reviewsLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-medium">Loading reviews...</p>
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} {...review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl font-medium mb-4">No reviews found</p>
            <p className="text-muted-foreground mb-6">
              {searchTerm || selectedTags.length > 0
                ? "Try adjusting your filters or search query."
                : `We don't have any reviews for ${category.name} yet.`}
            </p>
            <Button asChild>
              <Link to="/">Browse Other Categories</Link>
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
