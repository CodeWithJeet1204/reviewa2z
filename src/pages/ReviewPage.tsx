import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, Tag, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CommentSection from '@/components/CommentSection';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

const ReviewPage = () => {
  const { slug } = useParams();

  const { data: review, isLoading, error } = useQuery({
    queryKey: ['review', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Review slug is required');

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          category:categories(name, slug)
        `)
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Review not found');
      
      return {
        ...data,
        content: data.content || '',
        pros: data.pros || [],
        cons: data.cons || [],
        tags: data.tags || [],
        specs: data.specs || {},
        rating: data.rating || 0,
        comments_count: data.comments_count || 0,
        category: data.category || { name: 'Uncategorized', slug: 'uncategorized' }
      };
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container px-4 md:px-6 mx-auto py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-medium">Loading review...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container px-4 md:px-6 mx-auto py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Review not found</h1>
            <p className="text-muted-foreground mb-8">
              The review you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Ensure content is a string before splitting
  const contentParagraphs = typeof review.content === 'string' 
    ? review.content.split('\n\n')
    : [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container px-4 md:px-6 mx-auto py-12 mt-24">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm mb-8 text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to={`/category/${review.category?.slug || 'uncategorized'}`} className="hover:text-primary">
            {review.category?.name || 'Uncategorized'}
          </Link>
          <Link to={`/review/${review.slug}`} className="hover:text-primary">
            {review.title}
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-12 mb-12">
          {/* Image Section - 40% width */}
          <div className="lg:w-[40%]">
            <div className="sticky top-32">
              <div className="rounded-xl overflow-hidden shadow-lg bg-muted">
                <div className="aspect-[4/3] relative">
                  <img 
                    src={review.image_url || '/placeholder-image.jpg'} 
                    alt={review.title}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="mt-8">
                <div className="glass rounded-xl p-6 text-center">
                  <div className="flex items-center justify-center mb-3">
                    <Star className="h-6 w-6 text-yellow-500 mr-2" />
                    <span className="text-3xl font-bold">{review.rating}</span>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Rating</p>
                </div>
              </div>

              {/* Tags */}
              {review.tags && review.tags.length > 0 && (
                <div className="mt-8 glass rounded-xl p-6">
                  <h3 className="text-base font-medium mb-4 flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {review.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content Section - 60% width */}
          <div className="lg:w-[60%]">
            {/* Review Header */}
            <div className="mb-10">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">{review.title}</h1>
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(new Date(review.created_at), 'MMMM d, yyyy')}
                </div>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  {review.category?.name}
                </div>
              </div>
              {review.brief && (
                <p className="text-xl leading-relaxed text-muted-foreground">
                  {review.brief}
                </p>
              )}
            </div>

            <Tabs defaultValue="review" className="space-y-10">
              <TabsList className="w-full p-1">
                <TabsTrigger value="review" className="flex-1 py-3">Review</TabsTrigger>
                <TabsTrigger value="specs" className="flex-1 py-3">Specifications</TabsTrigger>
              </TabsList>

              <TabsContent value="review" className="space-y-10">
                {/* Main Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {contentParagraphs.map((paragraph, index) => (
                    <p key={index} className="text-lg leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <Separator className="my-12" />

                {/* Pros & Cons */}
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="glass rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-green-500 mb-6">Pros</h3>
                    <ul className="space-y-4">
                      {Array.isArray(review.pros) && review.pros.map((pro, index) => (
                        <li key={index} className="flex items-start text-lg">
                          <span className="text-green-500 mr-3 font-bold">+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="glass rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-red-500 mb-6">Cons</h3>
                    <ul className="space-y-4">
                      {Array.isArray(review.cons) && review.cons.map((con, index) => (
                        <li key={index} className="flex items-start text-lg">
                          <span className="text-red-500 mr-3 font-bold">-</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="specs">
                <div className="glass rounded-xl p-8">
                  <div className="grid gap-6">
                    {review.specs && typeof review.specs === 'object' && Object.entries(review.specs).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 gap-6 py-4 border-b last:border-0">
                        <div className="font-medium text-lg">{key}</div>
                        <div className="text-muted-foreground text-lg">{value as string}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Comments Section */}
            <div className="mt-16">
              <CommentSection reviewId={review.id} commentsCount={review.comments_count} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReviewPage;
