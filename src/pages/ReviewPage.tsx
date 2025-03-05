
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, ThumbsUp, MessageSquare, ChevronRight, ExternalLink, Tag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CommentSection from '@/components/CommentSection';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const ReviewPage = () => {
  const { slug } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [likeLoading, setLikeLoading] = useState(false);

  const { data: review, isLoading, error, refetch } = useQuery({
    queryKey: ['review', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          category:categories(name, slug)
        `)
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: userLike } = useQuery({
    queryKey: ['reviewLike', slug, user?.id],
    queryFn: async () => {
      if (!user || !review) return null;
      
      const { data } = await supabase
        .from('review_likes')
        .select('*')
        .eq('review_id', review.id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      return data;
    },
    enabled: !!user && !!review
  });

  const handleLikeReview = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to like reviews");
      return;
    }

    if (!review) return;

    setLikeLoading(true);
    try {
      if (userLike) {
        await supabase
          .from('review_likes')
          .delete()
          .eq('review_id', review.id)
          .eq('user_id', user.id);
          
        await supabase
          .from('reviews')
          .update({ likes_count: Math.max(0, review.likes_count - 1) })
          .eq('id', review.id);
      } else {
        await supabase
          .from('review_likes')
          .insert({
            review_id: review.id,
            user_id: user.id
          });
          
        await supabase
          .from('reviews')
          .update({ likes_count: (review.likes_count || 0) + 1 })
          .eq('id', review.id);
      }
      
      refetch();
      toast.success(userLike ? "Review unliked" : "Review liked");
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to process your action");
    } finally {
      setLikeLoading(false);
    }
  };

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
        <div className="container px-4 md:px-6 mx-auto py-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Review Not Found</h1>
            <p className="text-lg text-muted-foreground mb-6">
              We couldn't find the review you're looking for.
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

  const pros = review.pros || [];
  const cons = review.cons || [];
  const specs = review.specs || {};

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container px-4 md:px-6 mx-auto py-8 mt-24">
        <div className="flex items-center text-sm mb-4 text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link to={`/category/${review.category?.slug}`} className="hover:text-primary">
            {review.category?.name}
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground">{review.title}</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{review.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.round(review.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="ml-2 font-medium">{review.rating.toFixed(1)}</span>
            </div>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{review.comments_count} comments</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{review.likes_count} likes</span>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">{review.brief}</p>
        </div>

        <div className="rounded-xl overflow-hidden mb-8 glass p-2 shadow-md">
          <img
            src={review.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
            alt={review.title}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {review.tags && review.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-8">
          <Button 
            variant={userLike ? "default" : "outline"} 
            size="sm"
            onClick={handleLikeReview}
            disabled={likeLoading}
            className="transition-all duration-300"
          >
            <ThumbsUp className={`h-4 w-4 mr-2 ${userLike ? 'fill-primary-foreground' : ''}`} />
            {userLike ? 'Liked' : 'Like Review'}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="#comments">
              <MessageSquare className="h-4 w-4 mr-2" />
              Leave a Comment
            </a>
          </Button>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Detailed Review</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">Pros</h3>
                <ul className="space-y-2">
                  {pros && pros.length > 0 ? (
                    pros.map((pro: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                        <span>{pro}</span>
                      </li>
                    ))
                  ) : (
                    <li>No pros specified for this product.</li>
                  )}
                </ul>
              </div>
              
              <div className="glass p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">Cons</h3>
                <ul className="space-y-2">
                  {cons && cons.length > 0 ? (
                    cons.map((con: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                        <span>{con}</span>
                      </li>
                    ))
                  ) : (
                    <li>No cons specified for this product.</li>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="glass p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">AI Summary</h3>
              <p className="leading-relaxed">{review.brief}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="glass p-6 rounded-xl space-y-4">
            <h3 className="text-xl font-semibold mb-4">Detailed AI Review</h3>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {review.content?.split('\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="specs" className="glass p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(specs).length > 0 ? (
                Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b pb-2">
                    <span className="font-medium">{key}</span>
                    <span>{String(value)}</span>
                  </div>
                ))
              ) : (
                <p>No technical specifications available for this product.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div id="comments" className="pt-4">
          <h2 className="text-2xl font-semibold mb-6">Comments</h2>
          <CommentSection reviewId={review.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReviewPage;
