import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, X, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReviewCard from '@/components/ReviewCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialSort = searchParams.get('sort') || 'relevance';
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    if (sortBy !== 'relevance') params.set('sort', sortBy);
    setSearchParams(params);
  }, [searchTerm, selectedCategory, sortBy, setSearchParams]);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['searchResults', searchTerm, selectedCategory, sortBy, selectedTags],
    queryFn: async () => {
      if (!searchTerm && !selectedCategory && selectedTags.length === 0) {
        return [];
      }
      
      let query = supabase
        .from('reviews')
        .select(`
          *,
          category:categories(name, slug)
        `);
      
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,brief.ilike.%${searchTerm}%`);
      }
      
      if (selectedCategory) {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', selectedCategory)
          .single();
          
        if (categoryData) {
          query = query.eq('category_id', categoryData.id);
        }
      }
      
      if (selectedTags.length > 0) {
        query = query.contains('tags', selectedTags);
      }
      
      switch (sortBy) {
        case 'latest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'highest_rated':
          query = query.order('rating', { ascending: false });
          break;
        case 'most_commented':
          query = query.order('comments_count', { ascending: false });
          break;
        case 'most_liked':
          query = query.order('likes_count', { ascending: false });
          break;
        case 'relevance':
        default:
          if (searchTerm) {
            query = query.order('title', { ascending: true });
          } else {
            query = query.order('created_at', { ascending: false });
          }
          break;
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });

  const { data: allTags } = useQuery({
    queryKey: ['allTags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('tags');
      
      if (error) throw error;
      
      const tagSet = new Set<string>();
      data.forEach(review => {
        if (review.tags) {
          review.tags.forEach((tag: string) => tagSet.add(tag));
        }
      });
      
      return Array.from(tagSet);
    }
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
    setSelectedCategory('');
    setSortBy('relevance');
    setSelectedTags([]);
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container px-4 md:px-6 mx-auto py-8 mt-24">
        <div className="flex items-center text-sm mb-4 text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground">Search</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Search Reviews</h1>
          <p className="text-lg text-muted-foreground">Find AI-generated reviews across all categories</p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for products, brands, or keywords..."
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
                  <SelectItem value="relevance">Relevance</SelectItem>
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
                {(selectedCategory || selectedTags.length > 0) && (
                  <Badge variant="secondary" className="ml-1">
                    {(selectedCategory ? 1 : 0) + selectedTags.length}
                  </Badge>
                )}
              </Button>
              {(searchTerm || selectedCategory || sortBy !== 'relevance' || selectedTags.length > 0) && (
                <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="glass p-4 rounded-xl animate-fade-in space-y-4">
              <div>
                <h3 className="font-medium mb-2">Category</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={selectedCategory === '' ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory('')}
                  >
                    All Categories
                  </Badge>
                  {categories && categories.map((category) => (
                    <Badge 
                      key={category.id} 
                      variant={selectedCategory === category.slug ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(category.slug)}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Tags</h3>
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
                    <p className="text-sm text-muted-foreground">No tags available</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator className="mb-8" />

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-medium">Searching...</p>
          </div>
        ) : reviews && reviews.length > 0 ? (
          <>
            <p className="text-muted-foreground mb-6">Found {reviews.length} results</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </>
        ) : searchTerm || selectedCategory || selectedTags.length > 0 ? (
          <div className="text-center py-16">
            <p className="text-xl font-medium mb-4">No results found</p>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search query or filters.
            </p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl font-medium mb-4">Start your search</p>
            <p className="text-muted-foreground mb-6">
              Use the search bar above to find reviews by product name, features, or keywords.
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
              {["Smartphones", "Laptops", "Headphones", "Smart Home", "Gaming", "Fitness Trackers"].map((term) => (
                <Badge 
                  key={term} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={() => setSearchTerm(term)}
                >
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
