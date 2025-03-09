import { supabase } from '@/lib/supabase';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export async function generateSitemap(): Promise<string> {
  const baseUrl = 'https://reviewa2z.com';
  const urls: SitemapUrl[] = [];

  // Add static pages
  urls.push(
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/about', changefreq: 'monthly', priority: 0.7 },
    { loc: '/search', changefreq: 'always', priority: 0.8 }
  );

  // Add categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, updated_at');

  if (categories) {
    categories.forEach(category => {
      urls.push({
        loc: `/category/${category.slug}`,
        lastmod: category.updated_at,
        changefreq: 'weekly',
        priority: 0.9
      });
    });
  }

  // Add reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('slug, updated_at');

  if (reviews) {
    reviews.forEach(review => {
      urls.push({
        loc: `/review/${review.slug}`,
        lastmod: review.updated_at,
        changefreq: 'weekly',
        priority: 0.8
      });
    });
  }

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${new Date(url.lastmod).toISOString()}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}

// Function to generate robots.txt
export function generateRobotsTxt(sitemapUrl: string): string {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${sitemapUrl}

# Crawl-delay
Crawl-delay: 1

# Disallow paths
Disallow: /api/
Disallow: /admin/
Disallow: /private/
Disallow: /*?*

# Allow important paths
Allow: /review/
Allow: /category/
Allow: /search
Allow: /about

# Host
Host: https://reviewa2z.com`;
} 