
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/config/seo';

/**
 * Generates a sitemap.xml file based on the site's content
 */
export async function generateSitemap() {
  try {
    // Fetch all published reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false });
    
    if (reviewsError) throw reviewsError;
    
    // Fetch all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('slug');
    
    if (categoriesError) throw categoriesError;
    
    // Start building the sitemap
    const baseUrl = siteConfig.url;
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/categories</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/search</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    
    // Add category pages
    categories.forEach(category => {
      sitemap += `
  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
    
    // Add review pages
    reviews.forEach(review => {
      sitemap += `
  <url>
    <loc>${baseUrl}/review/${review.slug}</loc>
    ${review.updated_at ? `<lastmod>${new Date(review.updated_at).toISOString()}</lastmod>` : ''}
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });
    
    sitemap += `
</urlset>`;
    
    return sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
}

/**
 * Generates a robots.txt file
 */
export function generateRobotsTxt(sitemapUrl: string) {
  return `User-agent: *
Allow: /
Sitemap: ${sitemapUrl}
`;
}
