
import { Database } from '@/types/database.types';
import { supabase } from '@/lib/supabase';

export async function generateSitemap(domain: string) {
  const { data: categories } = await supabase
    .from('categories')
    .select('slug');

  const { data: reviews } = await supabase
    .from('reviews')
    .select('slug');

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${domain}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${domain}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${domain}/categories</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${domain}/search</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;

  // Add category pages
  if (categories) {
    categories.forEach(category => {
      sitemap += `
  <url>
    <loc>${domain}/category/${category.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });
  }

  // Add review pages
  if (reviews) {
    reviews.forEach(review => {
      sitemap += `
  <url>
    <loc>${domain}/${review.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
  }

  sitemap += `
</urlset>`;

  return sitemap;
}
