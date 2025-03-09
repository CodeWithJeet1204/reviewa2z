import { supabase } from '@/lib/supabase';
import { generateKeywords } from '@/utils/seo';

export async function migrateArticlesToSEO() {
  try {
    // Fetch all existing articles
    const { data: articles, error } = await supabase
      .from('articles')
      .select('*');

    if (error) throw error;

    // Update each article with SEO fields
    for (const article of articles) {
      const keywords = generateKeywords(article.content);
      const wordCount = article.content.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200); // Average reading speed

      const updates = {
        // Generate SEO fields if not present
        metaTitle: article.metaTitle || article.title,
        metaDescription: article.metaDescription || article.description?.substring(0, 155),
        keywords: article.keywords || keywords,
        canonicalUrl: article.canonicalUrl || `/articles/${article.slug}`,
        ogImage: article.ogImage || article.featuredImage,
        
        // Add schema-specific fields
        structuredData: {
          articleBody: article.content,
          wordCount: wordCount,
          articleSection: article.category,
          thumbnailUrl: article.featuredImage,
        },

        // Add stats if not present
        readTime: article.readTime || readTime,
        viewCount: article.viewCount || 0,

        // Ensure required fields are present
        status: article.status || 'published',
        featured: article.featured || false,
        updatedAt: new Date().toISOString(),
      };

      // Update the article
      const { error: updateError } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', article.id);

      if (updateError) {
        console.error(`Error updating article ${article.id}:`, updateError);
      }
    }

    console.log('Article migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

export async function migrateProductsToSEO() {
  try {
    // Fetch all existing products
    const { data: products, error } = await supabase
      .from('products')
      .select('*');

    if (error) throw error;

    // Update each product with SEO fields
    for (const product of products) {
      const keywords = generateKeywords(product.description);

      const updates = {
        // Generate SEO fields if not present
        metaTitle: product.metaTitle || `${product.name} - Review and Analysis`,
        metaDescription: product.metaDescription || product.description?.substring(0, 155),
        keywords: product.keywords || keywords,
        
        // Ensure product fields are present
        condition: product.condition || 'NewCondition',
        availability: product.availability || 'InStock',
        
        // Add empty arrays for new fields if not present
        features: product.features || [],
        specifications: product.specifications || [],
        
        // Initialize stats if not present
        rating: product.rating || { average: 0, count: 0 },
        reviews: product.reviews || [],
        
        // Add status fields
        status: product.status || 'published',
        featured: product.featured || false,
        updatedAt: new Date().toISOString(),
      };

      // Update the product
      const { error: updateError } = await supabase
        .from('products')
        .update(updates)
        .eq('id', product.id);

      if (updateError) {
        console.error(`Error updating product ${product.id}:`, updateError);
      }
    }

    console.log('Product migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

export async function migrateCategoriesToSEO() {
  try {
    // Fetch all existing categories
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*');

    if (error) throw error;

    // Update each category with SEO fields
    for (const category of categories) {
      const keywords = generateKeywords(category.description);

      const updates = {
        // Generate SEO fields if not present
        metaTitle: category.metaTitle || `${category.name} Reviews and Comparisons`,
        metaDescription: category.metaDescription || category.description?.substring(0, 155),
        keywords: category.keywords || keywords,
        ogImage: category.ogImage || category.featuredImage,
        
        // Initialize stats if not present
        articleCount: category.articleCount || 0,
        productCount: category.productCount || 0,
        
        // Add hierarchy fields
        order: category.order || 0,
      };

      // Update the category
      const { error: updateError } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', category.id);

      if (updateError) {
        console.error(`Error updating category ${category.id}:`, updateError);
      }
    }

    console.log('Category migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
} 