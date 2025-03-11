import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, Tag, Calendar, Plus, Minus, ShoppingCart, Clock, Eye, Check } from 'lucide-react';
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

interface ProductImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  isPrimary: boolean;
}

interface ProductPrice {
  amount: number;
  currency: string;
}

interface Product {
  name: string;
  brand: string;
  price: ProductPrice;
  availability?: string;
  condition?: string;
  images: ProductImage[];
  features: string[];
}

interface RatingCategory {
  name: string;
  score: number;
}

interface OverallRating {
  overall: number;
  categories: RatingCategory[];
}

interface Specification {
  [key: string]: string | number | boolean | null;
}

interface ComparisonProduct {
  productName: string;
  value: string;
  winner: string;
}

interface ComparisonFeature {
  feature: string;
  products: ComparisonProduct[];
}

interface PurchaseLink {
  vendor: string;
  url: string;
  price: number;
  currency: string;
  availability: boolean;
}

interface StructuredData {
  articleBody: string;
  wordCount: number;
  articleSection: string;
  thumbnailUrl: string;
}

interface Review {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  type: string;
  status: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  category: string;
  tags: string[];
  product: Product;
  specifications: Record<string, string>;
  overallRating: OverallRating;
  rating: number;
  pros: string[];
  cons: string[];
  publishedAt: string;
  updatedAt: string;
  viewCount?: number;
  readTime?: number;
  featured: boolean;
  structuredData: StructuredData;
  comparisonTable: ComparisonFeature[];
  purchaseLinks: PurchaseLink[];
}

const ReviewPage = () => {
  const { slug } = useParams();

  const { data: review, isLoading, error } = useQuery<Review>({
    queryKey: ['review', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Review slug is required');

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          category
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Review not found');
      
      return {
        ...data,
        content: data.content || '',
        pros: data.pros || [],
        cons: data.cons || [],
        tags: data.tags || [],
        specifications: data.specs || {},
        rating: typeof data.rating === 'string' ? parseFloat(data.rating) : (data.rating || 0),
        product: {
          name: data.product?.name || data.title,
          brand: data.product?.brand || '',
          price: data.product?.price || {
            amount: 0,
            currency: 'USD'
          },
          availability: data.product?.availability || undefined,
          condition: data.product?.condition || undefined,
          images: data.product?.images || [{
            url: data.ogImage || '/placeholder-image.jpg',
            alt: data.title,
            width: 800,
            height: 800,
            isPrimary: true
          }],
          features: data.product?.features || []
        },
        comparisonTable: Array.isArray(data.comparisonTable) ? data.comparisonTable : [],
        purchaseLinks: data.purchaseLinks || [],
        readTime: data.readTime || undefined,
        viewCount: data.viewCount || 0,
        type: data.type || 'review',
        status: data.status || 'published',
        structuredData: data.structuredData || {
          articleBody: data.content || '',
          wordCount: 0,
          articleSection: data.category || '',
          thumbnailUrl: data.ogImage || ''
        }
      };
    }
  });

  useEffect(() => {
    if (review) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: review.product.name,
        description: review.description,
        brand: {
          '@type': 'Brand',
          name: review.product.brand
        },
        offers: {
          '@type': 'Offer',
          price: review.product.price.amount,
          priceCurrency: review.product.price.currency,
          availability: `https://schema.org/${review.product.availability}`,
          itemCondition: `https://schema.org/${review.product.condition}`
        },
        review: {
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: review.rating,
            bestRating: '5'
          },
          author: {
            '@type': 'Organization',
            name: 'ReviewA2Z'
          },
          reviewBody: review.structuredData.articleBody || review.content,
          wordCount: review.structuredData.wordCount,
          articleSection: review.structuredData.articleSection,
          datePublished: review.publishedAt,
          dateModified: review.updatedAt
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: review.rating,
          reviewCount: review.viewCount,
          bestRating: '5'
        },
        image: review.product.images[0]?.url || review.structuredData.thumbnailUrl || '/placeholder-image.jpg'
      };

      script.innerHTML = JSON.stringify(structuredData);
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

  // Calculate average rating with type checking
  const averageRating = review.overallRating && typeof review.overallRating === 'object'
    ? Object.values(review.overallRating)
        .map(value => typeof value === 'string' ? parseFloat(value) : value)
        .filter(value => !isNaN(value))
        .reduce((a, b) => a + b, 0) / 
      Object.values(review.overallRating).length
    : review.rating || 0;

  return (
    <>
      <Helmet>
        <title>{review.metaTitle || `${review.title} Review & Rating | ReviewA2Z`}</title>
        <meta name="description" content={review.metaDescription || review.description} />
        <meta name="keywords" content={review.keywords?.join(', ')} />
        <meta name="type" content={review.type} />
        
        {/* Open Graph */}
        <meta property="og:title" content={review.metaTitle || `${review.title} Review & Rating | ReviewA2Z`} />
        <meta property="og:description" content={review.metaDescription || review.description} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={review.product.images[0]?.url || review.structuredData.thumbnailUrl || '/placeholder-image.jpg'} />
        
        {/* Twitter */}
        <meta name="twitter:title" content={review.metaTitle || `${review.title} Review & Rating | ReviewA2Z`} />
        <meta name="twitter:description" content={review.metaDescription || review.description} />
        <meta name="twitter:image" content={review.product.images[0]?.url || review.structuredData.thumbnailUrl || '/placeholder-image.jpg'} />
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* Article specific */}
        <meta property="article:published_time" content={review.publishedAt} />
        <meta property="article:modified_time" content={review.updatedAt} />
        <meta property="article:section" content={review.category} />
        <meta property="article:tag" content={review.keywords?.join(', ')} />
        {review.tags?.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        
        {/* Canonical URL */}
        <link rel="canonical" href={review.canonicalUrl || `https://reviewa2z.com/review/${review.slug}`} />
      </Helmet>

      <div className="min-h-screen">
        <Navbar />
        <main className="container px-4 md:px-6 mx-auto py-12 mt-24">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm mb-8 text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to={`/category/${review.category.toLowerCase().replace(/\s*&\s*/g, '-').replace(/\s+/g, '-')}`} className="hover:text-primary">
              {review.category}
            </Link>
            <span>/</span>
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
                      src={review.product.images[0]?.url || '/placeholder-image.jpg'} 
                      alt={review.product.images[0]?.alt || review.title}
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="mt-8">
                  <div className="glass rounded-xl p-6">
                    {/* Category Ratings */}
                    {review.overallRating?.categories && review.overallRating.categories.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {review.overallRating.categories.map((category) => (
                          <div key={category.name} className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <Star className="h-5 w-5 text-yellow-500 mr-1" />
                              <span className="text-2xl font-bold">{category.score.toFixed(1)}</span>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground capitalize">
                              {category.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Overall Rating */}
                    <div className={`text-center ${review.overallRating?.categories && review.overallRating.categories.length > 0 ? 'pt-4 border-t' : ''}`}>
                      <div className="flex items-center justify-center">
                        <Star className="h-8 w-8 text-yellow-500 mr-2" />
                        <span className="text-4xl font-bold">{review.rating.toFixed(1)}</span>
                        <span className="text-xl text-muted-foreground ml-1">/5</span>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground text-center mt-2">
                        Overall Rating
                      </p>
                    </div>
                  </div>
                </div>

                {/* Purchase Links */}
                {review.purchaseLinks && review.purchaseLinks.length > 0 && (
                  <div className="mt-8 glass rounded-xl p-6">
                    <h3 className="text-base font-medium mb-4 flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Where to Buy
                    </h3>
                    <div className="space-y-3">
                      {review.purchaseLinks.map((link, index) => {
                        const price = typeof link.price === 'string' ? parseFloat(link.price) : link.price;
                        return (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{link.vendor}</span>
                              <span className="text-primary">
                                ${price.toFixed(2)} {link.currency}
                              </span>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

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
                    {format(new Date(review.publishedAt), 'MMMM d, yyyy')}
                  </div>
                  {review.category && (
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      {review.category}
                    </div>
                  )}
                  {review.readTime > 0 && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {review.readTime} min read
                    </div>
                  )}
                  {review.viewCount > 0 && (
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      {review.viewCount} views
                    </div>
                  )}
                </div>
                {review.description && (
                  <p className="text-xl leading-relaxed text-muted-foreground">
                    {review.description}
                  </p>
                )}
              </div>

              {/* Product Information */}
              <div className="mb-8 glass rounded-xl p-6 bg-background/50 backdrop-blur-sm border border-border/50">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold">{review.product.name}</h2>
                      {review.product.brand && (
                        <p className="text-muted-foreground">by {review.product.brand}</p>
                      )}
                    </div>
                    {(review.product.price?.amount > 0 || review.product.availability) && (
                      <div className="text-right">
                        {review.product.price?.amount > 0 && (
                          <div className="text-2xl font-bold text-primary">
                            ${review.product.price.amount.toFixed(2)} {review.product.price.currency}
                          </div>
                        )}
                        {review.product.availability && (
                          <div className="text-sm text-muted-foreground">
                            {review.product.availability === 'InStock' ? 'In Stock' : 'Out of Stock'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {review.product.features && review.product.features.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                      <ul className="grid grid-cols-2 gap-2">
                        {review.product.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <Tabs defaultValue="review" className="w-full">
                <TabsList className="w-full grid grid-cols-3 gap-4 p-1 h-14 bg-background/95 backdrop-blur-sm rounded-xl sticky top-20 z-10">
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
                  {review.comparisonTable && review.comparisonTable.length > 0 && (
                    <TabsTrigger 
                      value="comparison" 
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 text-lg font-medium rounded-lg"
                    >
                      Comparison
                    </TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="review" className="mt-8">
                  {/* Main Content */}
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    {review.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-lg leading-relaxed mb-6">
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
                        {Array.isArray(review.pros) && review.pros.map((pro, index) => (
                          <li key={index} className="flex items-start text-lg group">
                            <span className="text-green-500 mr-3 font-bold transition-transform duration-300 group-hover:scale-110">+</span>
                            <span className="group-hover:text-foreground/90 transition-colors duration-300">{pro}</span>
                          </li>
                        ))}
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
                        {Array.isArray(review.cons) && review.cons.map((con, index) => (
                          <li key={index} className="flex items-start text-lg group">
                            <span className="text-red-500 mr-3 font-bold transition-transform duration-300 group-hover:scale-110">-</span>
                            <span className="group-hover:text-foreground/90 transition-colors duration-300">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="specs" className="mt-8">
                  <div className="glass rounded-xl p-8 bg-background/50 backdrop-blur-sm border border-border/50">
                    <div className="grid gap-6">
                      {Object.keys(review.specifications || {}).map((key) => (
                        <div 
                          key={key} 
                          className="grid grid-cols-2 gap-6 py-4 border-b last:border-0 hover:bg-primary/5 transition-colors duration-300 rounded-lg px-4"
                        >
                          <div className="font-medium text-lg text-foreground/80">{key}</div>
                          <div className="text-foreground text-lg">{review.specifications[key]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {review.comparisonTable && review.comparisonTable.length > 0 && (
                  <TabsContent value="comparison" className="mt-8">
                    <div className="glass rounded-xl p-8 bg-background/50 backdrop-blur-sm border border-border/50">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="text-left p-4 border-b font-medium">Feature</th>
                              {review.comparisonTable[0].products.map((product, index) => (
                                <th key={index} className="text-left p-4 border-b font-medium">
                                  {product.productName}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {review.comparisonTable.map((row, index) => (
                              <tr key={index}>
                                <td className="p-4 border-b font-medium">{row.feature}</td>
                                {row.products.map((product, productIndex) => (
                                  <td 
                                    key={productIndex} 
                                    className={`p-4 border-b ${product.winner === "True" ? 'text-green-500 font-medium' : ''}`}
                                  >
                                    {product.value}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                )}
              </Tabs>

              {/* Comments Section */}
              <div className="mt-16">
                <CommentSection reviewId={review.id} />
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
