-- Drop all auth-related tables and triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS review_likes CASCADE;
DROP TABLE IF EXISTS comment_likes CASCADE;

-- Clean up comments table
ALTER TABLE comments
  DROP COLUMN IF EXISTS user_id,
  DROP COLUMN IF EXISTS parent_id,
  DROP COLUMN IF EXISTS likes_count;

-- Clean up reviews table
ALTER TABLE reviews
  DROP COLUMN IF EXISTS likes_count;

-- Drop all auth-related policies
DROP POLICY IF EXISTS "Users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;
DROP POLICY IF EXISTS "Comment likes are viewable by everyone" ON comment_likes;
DROP POLICY IF EXISTS "Users can create their own comment likes" ON comment_likes;
DROP POLICY IF EXISTS "Users can delete their own comment likes" ON comment_likes;
DROP POLICY IF EXISTS "Review likes are viewable by everyone" ON review_likes;
DROP POLICY IF EXISTS "Users can create their own review likes" ON review_likes;
DROP POLICY IF EXISTS "Users can delete their own review likes" ON review_likes;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create new policies for anonymous access
CREATE POLICY "Enable read access for all users" ON comments
FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON comments
FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS comments_review_id_idx ON comments(review_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments(created_at DESC); 