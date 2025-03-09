
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, Tag, Calendar, Plus, Minus, Eye, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CommentSection from '@/components/CommentSection';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet-async';
import { generateReviewStructuredData } from '@/utils/seo';
import SEOLink from '@/components/SEOLink';

const ReviewPage = () => {
  const { slug } = useParams();

  // Update view count when viewing a review
  const incrementViewCount = async (reviewId: string) => {
    try {
      await supabase
        .from('reviews')
        .update({ view_count: supabase.rpc('increment', { x: 0 }) })
        .eq('id', reviewId);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

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
      
      // Increment view count asynchronously
      if (data.id) {
        incrementViewCount(data.id);
      }
      
      return {
        ...data,
        content: data.content || '',
        pros: data.pros || [],
        cons: data.cons || [],
        tags: data.tags || [],
        specs: data.specs || {},
        product: data.product || {},
        rating: data.rating || 0,
        comments_count: data.comments_count || 0,
        view_count: data.view_count || 0,
        read_time: data.read_time || Math.ceil((data.content?.length || 0) / 1000),
        category: data.category || { name: 'Uncategorized', slug: 'uncategorized' },
        meta_title: data.meta_title || data.title,
        meta_description: data.meta_description || data.brief,
        keywords: data.keywords || [],
        canonical_url: data.canonical_url || `/review/${data.slug}`
      };
    }
  });

  useEffect(() => {
    if (review) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(generateReviewStructuredData(review));
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    }
  }, [review]);

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Loading Review... | ReviewA2Z</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
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
      </>
    );
  }

  if (error || !review) {
    return (
      <>
        <Helmet>
          <title>Review Not Found | ReviewA2Z</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
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
      </>
    );
  }

  // Ensure content is a string before splitting
  const contentParagraphs = typeof review.content === 'string' 
    ? review.content.split('\n\n')
    : [];

  // Get product specifications from either specs or product field
  const specifications = review.specs || (review.product?.specifications ? Object.fromEntries(
    review.product.specifications.map((spec: any) => [spec.name, spec.value])
  ) : {});

  return (
    <>
      <Helmet>
        <title>{review.meta_title || `${review.title} Review & Rating | ReviewA2Z`}</title>
        <meta name="description" content={review.meta_description || `${review.brief} Read our detailed AI-powered review, analysis, and expert recommendations.`} />
        <meta name="keywords" content={review.keywords?.join(', ') || `${review.title}, ${review.category?.name || ''}, product review, AI review, ${review.tags?.join(', ')}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={review.meta_title || `${review.title} Review & Rating | ReviewA2Z`} />
        <meta property="og:description" content={review.meta_description || review.brief} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={review.og_image || review.image_url} />
        
        {/* Twitter */}
        <meta name="twitter:title" content={review.meta_title || `${review.title} Review & Rating | ReviewA2Z`} />
        <meta name="twitter:description" content={review.meta_description || review.brief} />
        <meta name="twitter:image" content={review.og_image || review.image_url} />
        
        {/* Article specific */}
        <meta property="article:published_time" content={review.published_at || review.created_at} />
        <meta property="article:modified_time" content={review.updated_at} />
        <meta property="article:section" content={review.category?.name} />
        {review.tags?.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        
        {/* Canonical URL */}
        <link rel="canonical" href={review.canonical_url || `https://reviewa2z.com/review/${review.slug}`} />
      </Helmet>

      <div className="min-h-screen">
        <Navbar />
        <main className="container px-4 md:px-6 mx-auto py-12 mt-24">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm mb-8 text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link to={`/category/${review.category?.slug || 'uncategorized'}`} className="hover:text-primary">
              {review.category?.name || 'Uncategorized'}
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-foreground">{review.title}</span>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-12 mb-12">
            {/* Image Section - 40% width */}
            <div className="lg:w-[40%]">
              <div className="sticky top-32">
                <div className="rounded-xl overflow-hidden shadow-lg bg-muted">
                  <div className="aspect-[4/3] relative">
                    <img 
                      src={review.image_url || review.og_image || '/placeholder.svg'} 
                      alt={review.title}
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="h-5 w-5 text-yellow-500 mr-1" />
                      <span className="text-2xl font-bold">{review.rating}</span>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Rating</p>
                  </div>
                  
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Eye className="h-5 w-5 text-blue-500 mr-1" />
                      <span className="text-2xl font-bold">{review.view_count || 0}</span>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Views</p>
                  </div>
                  
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-5 w-5 text-green-500 mr-1" />
                      <span className="text-2xl font-bold">{review.read_time || 5}</span>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Min Read</p>
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
                
                {/* Purchase Links */}
                {review.purchase_links && review.purchase_links.length > 0 && (
                  <div className="mt-8 glass rounded-xl p-6">
                    <h3 className="text-base font-medium mb-4">Where to Buy</h3>
                    <div className="space-y-3">
                      {review.purchase_links.map((link: any, index: number) => (
                        <SEOLink
                          key={index}
                          to={link.url}
                          isExternal={true}
                          title={`Buy ${review.title} at ${link.vendor}`}
                          className="flex items-center justify-between p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                        >
                          <span>{link.vendor}</span>
                          <span className="font-bold">
                            {link.price && `${link.currency || '$'}${link.price}`}
                          </span>
                        </SEOLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content Section - 60% width */}
            <div className="flex-1">
              {/* Review Header */}
              <div className="mb-10">
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">{review.title}</h1>
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(new Date(review.published_at || review.created_at), 'MMMM d, yyyy')}
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

              <Tabs defaultValue="review" className="w-full">
                <TabsList className="w-full grid grid-cols-2 gap-4 p-1 h-14 bg-background/95 backdrop-blur-sm rounded-xl">
                  <TabsTrigger 
                    value="review" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 text-lg font-medium rounded-lg"
                  >
                    Review
                  </TabsTrigger>
                  <TabsTrigger 
                    value="specs" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 text-lg font-medium rounded-lg"
                  >
                    Specifications
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="review" className="mt-8">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass rounded-xl p-8 bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-colors duration-300">
                      <h3 className="text-2xl font-semibold text-green-500 mb-6 flex items-center gap-2">
                        <span className="inline-block p-2 rounded-lg bg-green-500/10">
                          <Plus className="h-5 w-5 text-green-500" />
                        </span>
                        Pros
                      </h3>
                      <ul className="space-y-4">
                        {Array.isArray(review.pros) ? review.pros.map((pro, index) => (
                          <li key={index} className="flex items-start text-lg group">
                            <span className="text-green-500 mr-3 font-bold transition-transform duration-300 group-hover:scale-110">+</span>
                            <span className="group-hover:text-foreground/90 transition-colors duration-300">{pro}</span>
                          </li>
                        )) : null}
                      </ul>
                    </div>

                    <div className="glass rounded-xl p-8 bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-colors duration-300">
                      <h3 className="text-2xl font-semibold text-red-500 mb-6 flex items-center gap-2">
                        <span className="inline-block p-2 rounded-lg bg-red-500/10">
                          <Minus className="h-5 w-5 text-red-500" />
                        </span>
                        Cons
                      </h3>
                      <ul className="space-y-4">
                        {Array.isArray(review.cons) ? review.cons.map((con, index) => (
                          <li key={index} className="flex items-start text-lg group">
                            <span className="text-red-500 mr-3 font-bold transition-transform duration-300 group-hover:scale-110">-</span>
                            <span className="group-hover:text-foreground/90 transition-colors duration-300">{con}</span>
                          </li>
                        )) : null}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Comparison Table if available */}
                  {review.comparison_table && review.comparison_table.length > 0 && (
                    <div className="mt-12">
                      <h3 className="text-2xl font-semibold mb-6">Product Comparison</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-muted">
                              <th className="p-4 text-left">Feature</th>
                              {review.comparison_table[0].products.map((product: any, idx: number) => (
                                <th key={idx} className="p-4 text-left">{product.productName}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {review.comparison_table.map((row: any, rowIdx: number) => (
                              <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                                <td className="p-4 font-medium">{row.feature}</td>
                                {row.products.map((product: any, prodIdx: number) => (
                                  <td key={prodIdx} className="p-4">
                                    <div className="flex items-center">
                                      {product.winner && <span className="mr-1 text-primary">★</span>}
                                      {product.value}
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="specs" className="mt-8">
                  <div className="glass rounded-xl p-8 bg-background/50 backdrop-blur-sm border border-border/50">
                    <div className="grid gap-6">
                      {Object.entries(specifications).length > 0 ? (
                        Object.entries(specifications).map(([key, value], index) => (
                          <div 
                            key={key} 
                            className="grid grid-cols-2 gap-6 py-4 border-b last:border-0 hover:bg-primary/5 transition-colors duration-300 rounded-lg px-4"
                          >
                            <div className="font-medium text-lg text-foreground/80">{key}</div>
                            <div className="text-foreground text-lg">{value as string}</div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground py-8">No specifications available for this product.</p>
                      )}
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
    </>
  );
};

export default ReviewPage;
