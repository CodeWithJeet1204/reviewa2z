
import { siteConfig } from "@/config/seo";

/**
 * Generates SEO-friendly keywords from content
 * @param content The content to extract keywords from
 * @returns An array of keywords
 */
export function generateKeywords(content: string | null | undefined): string[] {
  if (!content) return siteConfig.keywords;

  // Extract the most common meaningful words
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => 
      word.length > 3 && 
      !['this', 'that', 'with', 'from', 'have', 'they', 'will', 'what', 'when', 'where', 'which', 'their'].includes(word)
    );

  // Count word frequency
  const wordCounts: Record<string, number> = {};
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });

  // Sort by frequency and get top 10
  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

/**
 * Generates a rich structured data object for a review
 */
export function generateReviewStructuredData(review: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: review.title,
    description: review.brief || review.meta_description,
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: '5'
      },
      author: {
        '@type': 'Organization',
        name: siteConfig.name
      },
      reviewBody: review.content
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: review.rating,
      reviewCount: review.comments_count || 1,
      bestRating: '5'
    },
    image: review.image_url || review.og_image,
    brand: review.product?.brand 
      ? {
          '@type': 'Brand',
          name: review.product.brand
        }
      : undefined
  };
}

/**
 * Generates a rich breadcrumb structured data object
 */
export function generateBreadcrumbStructuredData(items: {name: string, url: string}[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}
