-- First, create a backup of the reviews table
CREATE TABLE reviews_backup AS SELECT * FROM reviews;

-- Drop existing indexes and foreign key constraints
DROP INDEX IF EXISTS reviews_meta_title_idx;
DROP INDEX IF EXISTS reviews_keywords_idx;
DROP INDEX IF EXISTS reviews_word_count_idx;

-- Alter the reviews table to match new schema
ALTER TABLE reviews
  -- Rename existing columns
  RENAME COLUMN brief TO description,
  RENAME COLUMN meta_title TO "metaTitle",
  RENAME COLUMN meta_description TO "metaDescription",
  RENAME COLUMN canonical_url TO "canonicalUrl",
  RENAME COLUMN og_image TO "ogImage",
  RENAME COLUMN word_count TO "wordCount",
  RENAME COLUMN read_time TO "readTime",
  RENAME COLUMN is_featured TO featured,
  RENAME COLUMN category_id TO category,
  
  -- Add new columns
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'review',
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS "overallRating" JSONB,
  ADD COLUMN IF NOT EXISTS product JSONB,
  ADD COLUMN IF NOT EXISTS "comparisonTable" JSONB,
  ADD COLUMN IF NOT EXISTS "purchaseLinks" JSONB[],
  ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS "viewCount" INTEGER DEFAULT 0;

-- Convert category_id to category name
UPDATE reviews r
SET category = (
  SELECT name 
  FROM categories c 
  WHERE c.id = r.category::integer
);

-- Update data types
ALTER TABLE reviews
  ALTER COLUMN category TYPE TEXT,
  ALTER COLUMN "publishedAt" TYPE TIMESTAMP WITH TIME ZONE USING created_at,
  ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITH TIME ZONE USING updated_at;

-- Drop old columns
ALTER TABLE reviews
  DROP COLUMN IF EXISTS created_at,
  DROP COLUMN IF EXISTS updated_at,
  DROP COLUMN IF EXISTS image_url,
  DROP COLUMN IF EXISTS comments_count,
  DROP COLUMN IF EXISTS product_schema,
  DROP COLUMN IF EXISTS review_schema,
  DROP COLUMN IF EXISTS author_name,
  DROP COLUMN IF EXISTS author_bio,
  DROP COLUMN IF EXISTS author_avatar;

-- Create new indexes
CREATE INDEX IF NOT EXISTS reviews_meta_title_idx ON reviews("metaTitle");
CREATE INDEX IF NOT EXISTS reviews_keywords_idx ON reviews USING GIN(keywords);
CREATE INDEX IF NOT EXISTS reviews_category_idx ON reviews(category);
CREATE INDEX IF NOT EXISTS reviews_status_idx ON reviews(status);
CREATE INDEX IF NOT EXISTS reviews_type_idx ON reviews(type);
CREATE INDEX IF NOT EXISTS reviews_published_at_idx ON reviews("publishedAt" DESC);

-- Update existing reviews with default values
UPDATE reviews
SET
  type = 'review',
  status = 'published',
  "overallRating" = COALESCE("overallRating", jsonb_build_object(
    'design', rating,
    'performance', rating,
    'features', rating,
    'value', rating
  )),
  product = COALESCE(product, jsonb_build_object(
    'name', title,
    'brand', (specs->>'brand'),
    'model', title,
    'price', (specs->>'price'),
    'availability', 'InStock'
  )),
  "comparisonTable" = COALESCE("comparisonTable", jsonb_build_object(
    'headers', jsonb_build_array('Feature', title),
    'rows', jsonb_build_array()
  )),
  "purchaseLinks" = COALESCE("purchaseLinks", jsonb_build_array()),
  "publishedAt" = COALESCE("publishedAt", NOW()),
  "updatedAt" = COALESCE("updatedAt", NOW()),
  "viewCount" = COALESCE("viewCount", 0)
WHERE type IS NULL; 