-- Add SEO fields to reviews table
ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS keywords TEXT[],
  ADD COLUMN IF NOT EXISTS canonical_url TEXT,
  ADD COLUMN IF NOT EXISTS og_image TEXT,
  ADD COLUMN IF NOT EXISTS structured_data JSONB,
  ADD COLUMN IF NOT EXISTS word_count INTEGER,
  ADD COLUMN IF NOT EXISTS read_time INTEGER,
  ADD COLUMN IF NOT EXISTS author_name TEXT,
  ADD COLUMN IF NOT EXISTS author_bio TEXT,
  ADD COLUMN IF NOT EXISTS author_avatar TEXT,
  ADD COLUMN IF NOT EXISTS product_schema JSONB,
  ADD COLUMN IF NOT EXISTS review_schema JSONB;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS reviews_meta_title_idx ON reviews(meta_title);
CREATE INDEX IF NOT EXISTS reviews_keywords_idx ON reviews USING GIN(keywords);
CREATE INDEX IF NOT EXISTS reviews_word_count_idx ON reviews(word_count);

-- Update existing reviews with default SEO values
UPDATE reviews
SET
  meta_title = COALESCE(meta_title, title || ' Review & Rating | ReviewA2Z'),
  meta_description = COALESCE(meta_description, brief),
  keywords = COALESCE(keywords, tags),
  canonical_url = COALESCE(canonical_url, 'https://reviewa2z.com/review/' || slug),
  og_image = COALESCE(og_image, image_url),
  word_count = COALESCE(word_count, length(content) - length(replace(content, ' ', '')) + 1),
  read_time = COALESCE(read_time, CEIL((length(content) - length(replace(content, ' ', '')) + 1)::float / 200)),
  structured_data = COALESCE(structured_data, jsonb_build_object(
    '@context', 'https://schema.org',
    '@type', 'Product',
    'name', title,
    'description', brief,
    'review', jsonb_build_object(
      '@type', 'Review',
      'reviewRating', jsonb_build_object(
        '@type', 'Rating',
        'ratingValue', rating,
        'bestRating', '5'
      ),
      'author', jsonb_build_object(
        '@type', 'Organization',
        'name', 'ReviewA2Z'
      ),
      'reviewBody', content
    )
  )),
  product_schema = COALESCE(product_schema, jsonb_build_object(
    'brand', (specs->>'brand'),
    'model', title,
    'sku', (specs->>'sku'),
    'gtin', (specs->>'gtin'),
    'mpn', (specs->>'mpn'),
    'price', jsonb_build_object(
      'amount', (CASE WHEN specs->>'price' IS NOT NULL 
                THEN (specs->>'price')::numeric 
                ELSE NULL END),
      'currency', 'USD'
    ),
    'availability', 'InStock',
    'condition', 'NewCondition'
  )),
  review_schema = COALESCE(review_schema, jsonb_build_object(
    'reviewBody', content,
    'wordCount', (length(content) - length(replace(content, ' ', '')) + 1),
    'reviewRating', jsonb_build_object(
      'ratingValue', rating,
      'bestRating', 5,
      'worstRating', 1
    ),
    'pros', pros,
    'cons', cons
  ))
WHERE meta_title IS NULL; 