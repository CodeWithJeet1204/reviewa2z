-- Remove authentication tables and columns

-- Drop foreign key constraints first
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_user_id_fkey;
ALTER TABLE review_likes DROP CONSTRAINT IF EXISTS review_likes_user_id_fkey;
ALTER TABLE review_likes DROP CONSTRAINT IF EXISTS review_likes_review_id_fkey;

-- Drop authentication-related tables
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS review_likes CASCADE;

-- Remove user_id column from comments table
ALTER TABLE comments DROP COLUMN IF EXISTS user_id;

-- Remove likes_count column from reviews table
ALTER TABLE reviews DROP COLUMN IF EXISTS likes_count;

-- Update comments table to be anonymous
ALTER TABLE comments 
  DROP COLUMN IF EXISTS author_name,
  ADD COLUMN IF NOT EXISTS anonymous_id uuid DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS display_name text; 